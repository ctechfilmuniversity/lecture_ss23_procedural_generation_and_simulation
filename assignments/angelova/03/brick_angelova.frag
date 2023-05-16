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

float BRICK_W=.3;
float BRICK_H=.1;
float MORTAR=.02;

// HELPER FUNCTIONS
// (no need to comment these)

float getBias(float t,float bias)
{
    return(t/((((1./bias)-2.)*(1.-t))+1.));
}

float getGain(float t,float gain)
{
    if(t<.5)
    return getBias(t*2.,gain)/2.;
    else
    return getBias(t*2.-1.,1.-gain)/2.+.5;
}

void main()
{
    
    vec2 coord=gl_FragCoord.xy/u_resolution;
    
    // All parameter values between 0..1
    float brick_mortar_w=BRICK_W+MORTAR;
    float brick_mortar_h=BRICK_H+MORTAR;
    float mortar_half_norm_w=(MORTAR*.5)/brick_mortar_w;
    float mortar_half_norm_h=(MORTAR*.5)/brick_mortar_h;
    
    // BRICK PATTERN
    // TODO: comment the following steps
    
    // Divide the rows and columns into single bricks
    float x=coord.x/brick_mortar_w;
    float y=coord.y/brick_mortar_h;
    
    // float x = coord.x;
    // float y = coord.y;
    
    // Get every even row and shift the bricks at this row horizontally (with 0.5)
    float y_index=floor(y);
    if(mod(y_index,2.)==0.)
    {
        x+=.5;
    }
    
    // Repeat the pattern (create the rows and columns)
    x-=floor(x);
    y-=y_index;
    
    // Simplified versions:
    // float w = step(mortar_half_norm_w, x) - step(1.0 - mortar_half_norm_w, x);
    // float h = step(mortar_half_norm_h, y) - step(1.0 - mortar_half_norm_h, y);
    // or
    // float w = smoothstep(0.0, mortar_half_norm_w, x) - smoothstep(1.0 - mortar_half_norm_w, 1.0, x);
    // float h = smoothstep(0.0, mortar_half_norm_h, y) - smoothstep(1.0 - mortar_half_norm_h, 1.0, y);
    
    /*  Interpolation to create (smoother) transition between
    the brick and the mortar, because smoothstep is using the Hermit interpolation;
    With the first simplified version above (no smoothstep), the edges are sharper */
    float w=getBias(smoothstep(0.,mortar_half_norm_w,x),.3)
    -getBias(smoothstep(1.-mortar_half_norm_w,1.,x),.7);
    
    float h=getBias(smoothstep(0.,mortar_half_norm_h,y),.3)
    -getBias(smoothstep(1.-mortar_half_norm_h,1.,y),.7);
    
    // vec3 color = vec3(w * h);
    
    vec3 color=mix(vec3(.2,.15,.15),vec3(.5,.25,.2),getBias(w*h,.2));
    
    gl_FragColor=vec4(color,1.);
}
