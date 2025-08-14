    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vNoiseVal;
    uniform float uNoiseStrength;

    void main() {

      float grain = fract(sin(vNoiseVal * uNoiseStrength * 1000.0) * uNoiseStrength * 1000.0);
      grain = 0.5 + grain * 0.8;
      gl_FragColor = vec4(vColor * grain, 1.0);
    }
