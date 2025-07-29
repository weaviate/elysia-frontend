// Default configuration for the Abstract Sphere
export interface GlobeSettings {
  timeFrequency: number;
  distortionFrequency: number;
  distortionStrength: number;
  displacementFrequency: number;
  displacementStrength: number;
  lightAColor: string;
  lightBColor: string;
  lightAIntensity: number;
  lightBIntensity: number;
  lightAPosition: [number, number, number];
  lightBPosition: [number, number, number];
  subdivisionX: number;
  subdivisionY: number;
  fresnelOffset: number;
  fresnelMultiplier: number;
  fresnelPower: number;
  noiseStrength: number;
  noiseFrequency: number;
}

export const DEFAULT_GLOBE_SETTINGS: GlobeSettings = {
  timeFrequency: 0.3,
  distortionFrequency: 1.8,
  distortionStrength: 0.3,
  displacementFrequency: 2.4,
  displacementStrength: 0.15,
  lightAColor: "#7eff86",
  lightBColor: "#0c79f2",
  lightAIntensity: 6,
  lightBIntensity: 6,
  lightAPosition: [1.0, -2.0, 1],
  lightBPosition: [1.0, -2.0, 1],
  subdivisionX: 512,
  subdivisionY: 512,
  fresnelOffset: 0.01,
  fresnelMultiplier: 0.95,
  fresnelPower: 9.0,
  noiseStrength: 1.5,
  noiseFrequency: 1,
};

export const GLOBE_SETTINGS_STORAGE_KEY = "globe_settings";
