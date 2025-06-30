#define M_PI 3.1415926535897932384626433832795

varying vec3 vNormal;
varying vec3 vColor;
varying float vNoiseVal;

uniform float uTime;
uniform float uTimeFrequency;
uniform float uDistortionFrequency;
uniform float uDistortionStrength;
uniform float uDisplacementFrequency;
uniform float uDisplacementStrength;
uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;
uniform vec3 uLightAColor;
uniform vec3 uLightBColor;
uniform vec3 uLightAPosition;
uniform vec3 uLightBPosition;
uniform float uLightAIntensity;
uniform float uLightBIntensity;
uniform float uNoiseStrength;
uniform float uNoiseFrequency;
uniform vec2 uSubdivision;

#pragma glslify: perlin4d = require('./partials/perlin4d.glsl')
#pragma glslify: perlin3d = require('./partials/perlin3d.glsl')

vec3 getDisplacedPosition(vec3 _position) {

  vec3 displacementPosition = _position;
  displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency, uTime * uTimeFrequency)) * uDistortionStrength;
  
  float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * uTimeFrequency));
  
  vec3 displacedPosition = _position;
  displacedPosition += normalize(_position) * perlinStrength * uDisplacementStrength;

  return displacedPosition;
}


void main() {

  // Position
  vec3 displacedPosition = getDisplacedPosition(position);
  vec4 viewPosition = viewMatrix * vec4(displacedPosition, 1.0);
  gl_Position = projectionMatrix * viewPosition;

  // Bi tngents
  float distanceA = (M_PI * 2.0) / uSubdivision.x;
  float distanceB = M_PI / uSubdivision.x;

  vec3 biTangent = cross(normal, tangent.xyz);

  vec3 positionA = position + tangent.xyz * distanceA;
  vec3 displacedPositionA = getDisplacedPosition(positionA).xyz;

  vec3 positionB = position + biTangent.xyz * distanceB;
  vec3 displacedPositionB = getDisplacedPosition(positionB).xyz;

  vec3 computedNormal = cross(displacedPositionA - displacedPosition, displacedPositionB - displacedPosition);  
  computedNormal = normalize(computedNormal);

  // Fresenl
  vec3 viewDirection = normalize(displacedPosition - cameraPosition);
  float fresnel = uFresnelOffset + (1.0 + dot(viewDirection, computedNormal)) * uFresnelMultiplier;
  fresnel = pow(max(0.0, fresnel), uFresnelPower);

  // Color
  float lightAIntensityValue = max(0.0, dot(computedNormal.xyz, normalize(- uLightAPosition))) * uLightAIntensity;
  float lightBIntensityValue = max(0.0, -dot(computedNormal.xyz, normalize(- uLightBPosition))) * uLightBIntensity;


  vec3 color = vec3(0.098);
  color = mix(color,uLightAColor,lightAIntensityValue*fresnel);
  color = mix(color,uLightBColor,lightBIntensityValue*fresnel);
  color = mix(color, vec3(1.0), clamp(pow(max(0.0, fresnel - 0.4), 3.0), 0.0, 1.0));


  vNormal = normal;
  vColor = color;
  vNoiseVal = perlin4d(vec4(position * uNoiseStrength, uTime * uNoiseFrequency));
}
