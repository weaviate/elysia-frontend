varying vec3 vPosition;
varying float vNoise;
varying float vDisplacement;
varying vec3 vOriginalPosition;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec3 vWorldPosition;
varying float vProximityFactor;
varying float vGlassFactor;
varying vec3 vReflectionVector;

uniform vec3 uColor;
uniform float uNoiseStrength;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform vec3 uGlassColor;
uniform float uColorIntensity;
uniform float uFresnelPower;
uniform float uFresnelIntensity;
uniform vec3 uFresnelColor;
uniform float uGlassiness;
uniform float uDistortionAmount;
uniform float uProximityRadius;
uniform float uMergingIntensity;
uniform float uIridescence;
uniform float uReflectionStrength;
uniform float uTime;

void main() {
  // === COMPLEX NOISE SYSTEM FOR MATERIALS ===
  float noiseFactor = (vNoise + 1.0) * 0.5;
  noiseFactor = smoothstep(0.1, 0.9, noiseFactor);
  
  // === MAGMA COLOR SYSTEM ===
  vec3 magmaColor;
  if (noiseFactor < 0.2) {
    magmaColor = mix(vec3(0.1, 0.0, 0.0), uInnerColor, noiseFactor / 0.2); // Dark to red
  } else if (noiseFactor < 0.5) {
    magmaColor = mix(uInnerColor, vec3(1.0, 0.3, 0.0), (noiseFactor - 0.2) / 0.3); // Red to orange
  } else if (noiseFactor < 0.8) {
    magmaColor = mix(vec3(1.0, 0.3, 0.0), uOuterColor, (noiseFactor - 0.5) / 0.3); // Orange to molten
  } else {
    magmaColor = mix(uOuterColor, vec3(1.0, 1.0, 0.8), (noiseFactor - 0.8) / 0.2); // Molten to white hot
  }
  
  // === GLASS COLOR WITH IRIDESCENCE ===
  float iridescenceShift = sin(vWorldPosition.x * 10.0 + uTime) * sin(vWorldPosition.y * 8.0 + uTime * 1.3) * uIridescence;
  vec3 iridescenceColor = vec3(
    0.5 + 0.5 * sin(iridescenceShift),
    0.5 + 0.5 * sin(iridescenceShift + 2.094), // 120 degrees
    0.5 + 0.5 * sin(iridescenceShift + 4.188)  // 240 degrees
  );
  vec3 glassColor = mix(uGlassColor, iridescenceColor, 0.4);
  
  // === PROXIMITY-BASED MERGING EFFECTS ===
  float mergingGlow = vProximityFactor * uMergingIntensity;
  vec3 mergingColor = vec3(1.0, 0.8, 1.0) * mergingGlow; // Purple-white merging energy
  
  // === FRESNEL CALCULATIONS ===
  float fresnel = dot(vNormal, vViewDirection);
  fresnel = 1.0 - abs(fresnel);
  float glassFresnelPower = mix(uFresnelPower * 0.5, uFresnelPower * 2.0, vGlassFactor);
  fresnel = pow(fresnel, glassFresnelPower);
  
  // === ADVANCED GLASS REFLECTIONS ===
  float reflectionIntensity = fresnel * uReflectionStrength * vGlassFactor;
  vec3 reflectionColor = mix(vec3(0.8, 0.9, 1.0), iridescenceColor, 0.3) * reflectionIntensity;
  
  // === MATERIAL MIXING ===
  float glassMixFactor = smoothstep(0.3, 0.7, vGlassFactor * uGlassiness);
  glassMixFactor += vProximityFactor * 0.3; // More glass when spheres are merging
  glassMixFactor = clamp(glassMixFactor, 0.0, 0.9);
  
  // Base material mix
  vec3 baseMaterial = mix(magmaColor, glassColor, glassMixFactor);
  
  // === COMPLEX LIGHTING SYSTEM ===
  float rimLight = pow(1.0 - abs(dot(vNormal, vViewDirection)), 3.0);
  vec3 rimColor = mix(vec3(1.0, 0.3, 0.0), vec3(0.3, 0.8, 1.0), glassMixFactor);
  
  // === DISTORTION EFFECTS ===
  float distortionMask = smoothstep(0.4, 0.6, vProximityFactor);
  vec3 distortionColor = vec3(1.0, 1.0, 1.0) * distortionMask * uDistortionAmount;
  
  // === FINAL COLOR COMBINATION ===
  vec3 finalColor = baseMaterial * uColorIntensity;
  finalColor += reflectionColor * 0.3;
  finalColor += mergingColor * 0.2;
  finalColor += rimColor * rimLight * uFresnelIntensity * 0.5;
  finalColor += distortionColor * 0.1;
  
  // Clamp to prevent blowout
  finalColor = clamp(finalColor, 0.0, 2.0);
  
  // === DYNAMIC TRANSPARENCY ===
  float alpha = mix(0.6, 0.2, glassMixFactor); // Glass areas more transparent
  alpha += rimLight * 0.1; // Rim areas more opaque
  alpha += mergingGlow * 0.1; // Merging areas more visible
  alpha = clamp(alpha, 0.1, 0.8);
  
  // === FINAL EFFECTS ===
  // Subtle pulsing intensity
  float pulse = 0.95 + 0.05 * sin(uTime * 2.0 + vWorldPosition.x * 5.0);
  finalColor *= pulse;
  
  // Subtle heat shimmer
  float shimmer = 1.0 + 0.02 * sin(uTime * 10.0 + vWorldPosition.y * 20.0) * (1.0 - glassMixFactor);
  finalColor *= shimmer;
  
  gl_FragColor = vec4(finalColor, alpha);
}
