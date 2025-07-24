import React, { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import * as THREE from "three";

// Fragment shader for the pixelation and wobble effect
const fragmentShader = `
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float pixelationFactor;
  uniform bool enableWobble;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 resolution = iResolution * pixelationFactor;
    
    // Pixelate by reducing resolution
    vec2 pixelatedUV = floor(uv * resolution) / resolution;
    
    // Add wobble effect if enabled
    if (enableWobble) {
      pixelatedUV += vec2(sin(iTime * 3.0 + pixelatedUV.x * 10.0) * 0.003, 0.0);
    }
    
    outputColor = texture2D(inputBuffer, pixelatedUV);
  }
`;

// Custom Effect class
class PixelationEffectImpl extends Effect {
  constructor({
    pixelationFactor = 4.0,
    enableWobble = true,
  }: {
    pixelationFactor?: number;
    enableWobble?: boolean;
  } = {}) {
    super("PixelationEffect", fragmentShader, {
      uniforms: new Map([
        ["iResolution", new THREE.Uniform(new THREE.Vector2())],
        ["iTime", new THREE.Uniform(0)],
        ["pixelationFactor", new THREE.Uniform(pixelationFactor)],
        ["enableWobble", new THREE.Uniform(enableWobble)],
      ] as Array<[string, THREE.Uniform<any>]>),
    });
  }

  update(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ) {
    const uniforms = this.uniforms;
    uniforms
      .get("iResolution")!
      .value.set(inputBuffer.width, inputBuffer.height);
    uniforms.get("iTime")!.value += deltaTime;
  }
}

// React component wrapper
export const PixelationEffect = forwardRef<
  PixelationEffectImpl,
  {
    pixelationFactor?: number;
    enableWobble?: boolean;
  }
>(({ pixelationFactor, enableWobble }, ref) => {
  const effect = useMemo(
    () => new PixelationEffectImpl({ pixelationFactor, enableWobble }),
    [pixelationFactor, enableWobble]
  );

  return <primitive ref={ref} object={effect} />;
});

PixelationEffect.displayName = "PixelationEffect";
