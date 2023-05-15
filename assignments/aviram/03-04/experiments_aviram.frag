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
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float BRICK_W = 0.3;  
float BRICK_H = 0.1; 
float MORTAR =  0.02; 

// HELPER FUNCTIONS
// (no need to comment these)

float getBias(float t, float bias)
{
  return (t / ((((1.0 / bias) - 2.0) * (1.0 - t)) + 1.0));
}

float getGain(float t, float gain)
{
  if(t < 0.5)
    return getBias(t * 2.0, gain) / 2.0;
  else
    return getBias(t * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 coord = fragCoord.xy / iResolution.xy;

    // All parameter values between 0..1
    float brick_mortar_w = 0.1 + 0.02;
    float brick_mortar_h = 0.1 + 0.02;
    float mortar_half_norm_w = (0.02 * 0.5) / brick_mortar_w;
    float mortar_half_norm_h = (0.02 * 0.5) / brick_mortar_h;

    // BRICK PATTERN

    float x = coord.x / brick_mortar_w;
    float y = coord.y / brick_mortar_h;

    float y_index = floor(y);
    if (mod(y_index, 4.0) == 0.0)
    {
        y += 0.4;

    }
    
    
    float x_index = floor(x);
    if (mod(x_index, 2.0) == 0.0)
    {
        x += 0.4;

    }


    x -= floor(x);
    y -= y_index;
    
    
    float w = (sin(x * 5.0) * cos(y * 5.0))- smoothstep(1.0 - mortar_half_norm_h, 1.0, y);
   // float h = (cos(x * 9.0) * sin(y * 9.0))- smoothstep(1.0 - mortar_half_norm_h, 1.0, x);

   // float w = smoothstep(0.0, mortar_half_norm_w, x) - smoothstep(1.0 - mortar_half_norm_w, 1.0, x);
   float h = smoothstep(0.0, mortar_half_norm_h, y) - smoothstep(1.0 - mortar_half_norm_h, 1.0, y);

    vec3 color = mix(vec3(0.1, 0.8, 0.2), vec3(0.2, 0.2, 0.2), smoothstep(0.0, 0.6
    , w * h));
    fragColor = vec4(color, 3.0);
    
}


