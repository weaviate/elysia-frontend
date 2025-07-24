uniform float time;
uniform float pixelSize;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vDistance;
varying float vPixelFactor;

void main() {
    // Transform position
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Pass varyings to fragment shader
    vPosition = position;
    vNormal = normalMatrix * normal;
    vUv = uv;
    vWorldPosition = worldPosition.xyz;
    vDistance = length(mvPosition.xyz);
    
    // Calculate pixel factor for retro effect
    // Further objects get more pixelated
    vPixelFactor = 1.0 + vDistance * 0.1;
    
    gl_Position = projectionMatrix * mvPosition;
} 