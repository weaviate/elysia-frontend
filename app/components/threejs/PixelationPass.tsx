import React, { forwardRef, useMemo } from "react";
import { Pass } from "postprocessing";
import * as THREE from "three";

// Fragment shader for the final pixelation pass
const pixelationFragmentShader = `
  precision highp float;
  
  uniform sampler2D tDiffuse;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform bool enableWobble;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Add wobble effect if enabled
    if (enableWobble) {
      uv += vec2(sin(iTime * 3.0 + uv.x * 10.0) * 0.003, 0.0);
    }
    
    // Sample the low-res texture and let the GPU filtering handle the pixelation
    gl_FragColor = texture2D(tDiffuse, uv);
  }
`;

const pixelationVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Custom Pass class implementing the render-to-texture technique
class PixelationPassImpl extends Pass {
  private pixelationFactor: number;
  private enableWobble: boolean;
  private renderTarget: THREE.WebGLRenderTarget;
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;
  private quadScene: THREE.Scene;
  private orthoCam: THREE.OrthographicCamera;

  constructor({
    pixelationFactor = 4.0,
    enableWobble = true,
  }: {
    pixelationFactor?: number;
    enableWobble?: boolean;
  } = {}) {
    super("PixelationPass");

    this.pixelationFactor = pixelationFactor;
    this.enableWobble = enableWobble;

    // Create material for final pass
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        iResolution: { value: new THREE.Vector2() },
        iTime: { value: 0 },
        enableWobble: { value: enableWobble },
      },
      vertexShader: pixelationVertexShader,
      fragmentShader: pixelationFragmentShader,
    });

    // Create quad for final pass
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry, this.material);

    // Create scene and camera for final pass
    this.quadScene = new THREE.Scene();
    this.quadScene.add(this.quad);
    this.orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Initialize render target (will be resized in setSize)
    this.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter, // This is key for pixelation!
      format: THREE.RGBFormat,
      generateMipmaps: false,
    });
  }

  render(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    outputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ) {
    // Update time uniform
    this.material.uniforms.iTime.value += deltaTime;

    // First, render the input to our low-resolution render target
    const originalRenderTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(this.renderTarget);

    // Copy input buffer to low-res target
    const copyMaterial = new THREE.MeshBasicMaterial({
      map: inputBuffer.texture,
    });
    const tempQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      copyMaterial
    );
    const tempScene = new THREE.Scene();
    tempScene.add(tempQuad);

    renderer.render(tempScene, this.orthoCam);

    // Clean up temp objects
    copyMaterial.dispose();
    tempQuad.geometry.dispose();

    // Now render the low-res texture to the output with our shader
    this.material.uniforms.tDiffuse.value = this.renderTarget.texture;
    this.material.uniforms.iResolution.value.set(
      this.renderTarget.width,
      this.renderTarget.height
    );

    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(this.quadScene, this.orthoCam);

    // Restore original render target
    renderer.setRenderTarget(originalRenderTarget);
  }

  setSize(width: number, height: number) {
    // Calculate low resolution based on pixelation factor
    const lowResWidth = Math.max(1, Math.floor(width / this.pixelationFactor));
    const lowResHeight = Math.max(
      1,
      Math.floor(height / this.pixelationFactor)
    );

    this.renderTarget.setSize(lowResWidth, lowResHeight);
  }

  dispose() {
    this.renderTarget.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}

// React component wrapper
export const PixelationPass = forwardRef<
  PixelationPassImpl,
  {
    pixelationFactor?: number;
    enableWobble?: boolean;
  }
>(({ pixelationFactor, enableWobble }, ref) => {
  const pass = useMemo(
    () => new PixelationPassImpl({ pixelationFactor, enableWobble }),
    [pixelationFactor, enableWobble]
  );

  return <primitive ref={ref} object={pass} />;
});

PixelationPass.displayName = "PixelationPass";
