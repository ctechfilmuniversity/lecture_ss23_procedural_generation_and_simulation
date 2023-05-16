/***********************************************************
 * Procedural Experiments
 *
 * Author: Lisa Passing
 * 
 * Date: May 2023
 *
 * This is wild experimentation using things from the session slides
 * and the book of shaders examples thrown together
 *
 *********************************************************/ 


#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

const float CELLS = 12.0;

void main()
{

    vec2 coord = gl_FragCoord.xy/u_resolution;

    float x = sin(CELLS * PI * coord.x);
    float y = sin(CELLS * PI * coord.y);

    float r = smoothstep(abs(x), 0.25, 0.6) 
        + (sin(5. * (smoothstep(abs(y), 0.7, 0.8))));
    float b = smoothstep(sign(x), 0.05, 0.7) * 0.3;

    // trippy animation version
    //float r = smoothstep(abs(x), 0.2, 0.4) 
    //    + (sin(4. * (u_time * 0.5) * (smoothstep(abs(y), 0.7, 0.8))));
    //float b = smoothstep(sign(x), 0.05, 0.7) * (sin(u_time)) + 0.3;

    vec3 color = vec3(r, 0.45, b);
    gl_FragColor = vec4(color, 1.0);
}
