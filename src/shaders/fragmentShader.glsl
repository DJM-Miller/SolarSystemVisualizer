uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
// Normalized coordinates
vec2 uv = vUv;

// Scale and offset to cover the whole screen
uv *= 2.0;
uv -= 1.0;

// Add noise to create stars
float numStars = 500.0; // Adjust density of stars
float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
noise = smoothstep(0.0, 0.02, noise); // Adjust the threshold for stars
float starField = floor(noise * numStars) / numStars;

//Invert colors
starField = 1.0 - starField;

// Output stars on the screen
gl_FragColor = vec4(vec3(starField), 1.0);