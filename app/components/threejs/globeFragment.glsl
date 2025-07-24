precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec3 glowColor;
uniform vec3 wireframeColor;
uniform vec3 branchColor;
uniform float pixelSize;
uniform bool retroMode;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vDistance;
varying float vPixelFactor;

// 4x4 Bayer matrix for ordered dithering
const mat4 bayerMatrix = mat4(
    0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
    12.0/16.0, 4.0/16.0, 14.0/16.0,  6.0/16.0,
    3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
    15.0/16.0, 7.0/16.0, 13.0/16.0,  5.0/16.0
);

// Get Bayer matrix threshold value
float getBayerValue(vec2 screenPos) {
    int x = int(mod(screenPos.x, 4.0));
    int y = int(mod(screenPos.y, 4.0));
    return bayerMatrix[y][x];
}

// Apply ordered dithering
vec3 orderedDither(vec3 color, vec2 screenPos, float intensity) {
    float threshold = getBayerValue(screenPos);
    
    // Reduce color levels for retro look
    float levels = 6.0; // Higher than before for more gradual effect
    vec3 quantized = floor(color * levels) / levels;    
    
    // Apply dithering based on error
    vec3 error = (color - quantized) * levels;
    quantized += step(threshold * intensity, error) / levels;
    
    return clamp(quantized, 0.0, 1.0);
}

// Pixelate the UV coordinates
vec2 pixelateUV(vec2 uv, float pixelSize) {
    if (!retroMode) return uv;
    
    vec2 pixelatedUV = floor(uv * pixelSize) / pixelSize;
    return pixelatedUV;
}

// Create scanlines effect
float scanlines(vec2 coord, float intensity) {
    float scanline = sin(coord.y * 800.0) * 0.05 * intensity + (1.0 - 0.05 * intensity);
    return scanline;
}

// Create noise for texture
float noise(vec2 coord) {
    return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
}

// CRT-style curvature distortion
vec2 crtCurve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

void main() {
    vec2 screenPos = gl_FragCoord.xy;
    vec2 uv = vUv;
    
    // Apply CRT curvature if retro mode is enabled
    if (retroMode) {
        uv = crtCurve(uv);
    }
    
    // Pixelate based on distance and pixel size
    float effectivePixelSize = pixelSize * vPixelFactor;
    vec2 pixelatedUV = pixelateUV(uv, effectivePixelSize);
    
    // Base color calculation
    vec3 baseColor = glowColor;
    
    // Calculate basic lighting (removed rim lighting for glow effect)
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float lightIntensity = max(0.4, dot(normal, lightDir));
    
    // Simple color with basic lighting (no glow effects)
    vec3 color = baseColor * lightIntensity;
    
    // Remove pulsing effect
    // float pulse = 0.8 + 0.2 * sin(time * 2.0);
    // color *= pulse;
    
    // Add wireframe-like grid effect
    vec2 grid = abs(fract(pixelatedUV * 20.0) - 0.5);
    float gridLine = smoothstep(0.0, 0.1, min(grid.x, grid.y));
    color += wireframeColor * (1.0 - gridLine) * 0.3;
    
    // Apply scanlines
    if (retroMode) {
        float scanlineEffect = scanlines(screenPos, 0.5);
        color *= scanlineEffect;
    }
    
    // Apply ordered dithering
    if (retroMode) {
        color = orderedDither(color, screenPos, 0.8);
    }
    
    // Add noise for that retro texture
    float noiseValue = noise(screenPos + time * 0.1) * 0.03;
    color += vec3(noiseValue);
    
    // Add chromatic aberration for CRT effect
    if (retroMode) {
        float aberration = 0.003;
        vec2 offset = (uv - 0.5) * aberration;
        color.r *= 1.0 + length(offset);
        color.b *= 1.0 - length(offset);
    }
    
    // Reduced vignette effect
    float dist = distance(uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.6, 1.0, dist);
    color *= vignette;
    
    // Final color output with normal alpha (no transparency for glow)
    gl_FragColor = vec4(color, 0.8);
} 