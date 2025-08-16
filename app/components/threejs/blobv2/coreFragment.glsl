varying vec3 vPosition;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec3 vWorldPosition;

uniform float uTime;
uniform vec3 uCoreColor;
uniform float uCoreIntensity;
uniform float uCoreDarkness;
uniform float uCoreGlow;
uniform vec3 uGlowColor;

void main() {
  // Create dark core with subtle variations
  float noiseFactor = (vNoise + 1.0) * 0.5;
  noiseFactor = smoothstep(0.2, 0.8, noiseFactor);
  
  // Dark core color with subtle red glow in cracks
  vec3 darkCore = uCoreColor * uCoreDarkness;
  vec3 glowCore = mix(darkCore, uGlowColor, noiseFactor * 0.3);
  
  // Rim lighting for depth
  float rimLight = pow(1.0 - abs(dot(vNormal, vViewDirection)), 2.0);
  vec3 rimColor = uGlowColor * rimLight * 0.2;
  
  // Subtle pulsing like a beating heart
  float heartbeat = 0.8 + 0.2 * sin(uTime * 3.0) * sin(uTime * 2.7);
  
  // Internal heat veins
  float veinPattern = sin(vWorldPosition.x * 8.0 + uTime) * 
                     sin(vWorldPosition.y * 6.0 + uTime * 1.2) * 
                     sin(vWorldPosition.z * 7.0 + uTime * 0.8);
  veinPattern = smoothstep(0.3, 0.7, (veinPattern + 1.0) * 0.5);
  
  vec3 veinGlow = uGlowColor * veinPattern * 0.1 * heartbeat;
  
  // Final core color
  vec3 finalColor = glowCore * uCoreIntensity + rimColor + veinGlow;
  finalColor *= heartbeat;
  
  // Make it slightly transparent to show the molten interior
  float alpha = 0.9 + rimLight * 0.1;
  
  gl_FragColor = vec4(finalColor, alpha);
}
