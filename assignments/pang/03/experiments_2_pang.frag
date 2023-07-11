precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float r = length(uv - 0.5);
  float g = abs(sin(r * 15.0 + u_time));
  float b = abs(cos(r * 55.0 + u_time * .05));
  gl_FragColor = vec4(r, g, b, 1);
}