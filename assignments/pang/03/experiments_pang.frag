precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  //uv -= 0.5;
  int x = int(floor(uv.x * 5.0));
  int y = int(floor(uv.y * 5.0));
   
float r = length(uv - 0.5);
  float g = abs(sin(r * 25.0  + u_time * -1.0));
  float b = abs(cos(r * 35.0 * u_time));
  //gl_FragColor = vec4(r, g, b, 1);
  
  if (mod(float(x + y), 2.0) == 0.0) {
    gl_FragColor = vec4(-r, g, b, 1);
  } else {
    gl_FragColor = vec4(-r , -g, b, 1);
  }
}