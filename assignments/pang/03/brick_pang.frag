/***********************************************************
 * Procedural Brick Pattern
 *
 * Author: Lena Gieseke
 * 
 * Implementation based on:
 * Ebert, David S. Texturing & Modeling a Procedural Approach. San Francisco, Calif.: Morgan Kaufmann, 2003.
 *
 * Date: April 2019
 *
 * Purpose: Prototyping a procedural brick pattern
 *
 *********************************************************/ 


#ifdef GL_ES
//checks if the code is being compiled with OpenGL ES 
precision mediump float;
// set the precision of floating-point numbers used in the shader
#endif
//This code is only complied if the OpenGL ES is defined

uniform vec2 u_resolution;
//define a uniform variable called "u_resolution" which is a floating point vector with two components. This vec2 defines the width and height of the rendering window
uniform float u_time;
//name the uniform variable as "u_time" and define it as data type "float" which can store numbers. This allows to provide current time to the shader. 


float BRICK_W = 0.3;  
float BRICK_H = 0.1; 
float MORTAR =  0.02; 
//set the float variables "BRICK_W", "BRICK_H", and "MORTAR" to specific numbers.  "BRICK_W" as the width of the brick, "BRICK_W" as the height of the brick, "MORTAR" as the width of the material. 

// HELPER FUNCTIONS
// (no need to comment these)

float getBias(float t, float bias)
{
  return (t / ((((1.0 / bias) - 2.0) * (1.0 - t)) + 1.0));
}
//pull the vlaue towards low end or high end
float getGain(float t, float gain)
{
  if(t < 0.5)
    return getBias(t * 2.0, gain) / 2.0;
  else
    return getBias(t * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
}
//stretch the value towards midpoint 
void main()
{

    vec2 coord = gl_FragCoord.xy/u_resolution;
    //creat a 2D vector called "coord" that represents the pixel's position on the screen. By dividing gl_FragCoord.xy and u_resolution, it normalises the coorcinates to the range of 0.0 to 1.0

    // All parameter values between 0..1
    float brick_mortar_w = BRICK_W + MORTAR;
    float brick_mortar_h = BRICK_H + MORTAR;
    float mortar_half_norm_w = (MORTAR * 0.5) / brick_mortar_w;
    float mortar_half_norm_h = (MORTAR * 0.5) / brick_mortar_h;

    // BRICK PATTERN
    // TODO: comment the following steps

    //calculate the x and y coordinates of current piexl based on the width and height of the brick. 
    float x = coord.x / brick_mortar_w;
    float y = coord.y / brick_mortar_h;
    // float x = coord.x;
    // float y = coord.y;

    //the first line finds the row of bricks it belongs to by rounding down value y and it stores in variable "y_index". 
    //the seond line checks if the index is even or odd. If the remainderis equal to 0.0, the row index is even. 
    //the thrid line moves the current pixel to the right by adding 0.5 /move half of the brick forward.
    float y_index = floor(y);
    if( mod(y_index, 2.0 ) == 0.0)
    {
        x += 0.5;
    }

    // floor returns a value equal to the nearest integer that is less than or equal to x, 
    // then floor(x) is being subtracted from x,which gives the fractional part of x.
    // subtracting y_index from y,it is the fractional part of y within its row.
    //these two lines give the position of current pixel. 

    x -= floor(x);
    y -= y_index;

    // Simplified versions:
    // float w = step(mortar_half_norm_w, x) - step(1.0 - mortar_half_norm_w, x);
    // float h = step(mortar_half_norm_h, y) - step(1.0 - mortar_half_norm_h, y);
    // or
    // float w = smoothstep(0.0, mortar_half_norm_w, x) - smoothstep(1.0 - mortar_half_norm_w, 1.0, x);
    // float h = smoothstep(0.0, mortar_half_norm_h, y) - smoothstep(1.0 - mortar_half_norm_h, 1.0, y);


    //dont really understand this part of the code
    float w = getBias(smoothstep(0.0, mortar_half_norm_w, x), 0.3) 
                - getBias(smoothstep(1.0 - mortar_half_norm_w, 1.0, x), 0.7);
    float h = getBias(smoothstep(0.0, mortar_half_norm_h, y), 0.3) 
                - getBias(smoothstep(1.0 - mortar_half_norm_h, 1.0, y), 0.7);
    

    // vec3 color = vec3(w * h);

    vec3 color = mix(vec3(0.2, 0.15, 0.15), vec3(0.5, 0.25, 0.2), getBias(w * h, 0.2));

    gl_FragColor = vec4(color, 1.0);
}
 