#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

// HELPER FUNCTIONS
// Divide the space
vec2 tile(vec2 _st,float _zoom){
    _st*=_zoom;
    
    return fract(_st);
}

// Rotation matrix (from The Book of Shaders)
vec2 rotate2D(vec2 _st,float _angle){
    // translate, rotate and translate back
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    _st+=.5;
    
    return _st;
}

vec2 square(vec2 _st,float _cut){
    vec2 bottomLeft=step(vec2(_cut),_st);
    vec2 topRight=step(vec2(1.-_cut),_st);
    
    return bottomLeft-topRight;
}

float circle(vec2 _st,float _radius,float _offset){
    vec2 d=_st-vec2(.5)-_offset;
    float c=1.-step(_radius*_radius,dot(d,d));
    
    return c;
}

void main()
{
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec3 color=vec3(0.);
    
    // Divide the space in 4 and let the flower spin
    st=tile(st+vec2(cos(u_time),sin(u_time))*.01,4.);
    
    // Rotate the flower
    st=rotate2D(st,PI*.2);
    
    // Create the flower parts
    vec2 outsidePetals=square(st,.02);
    vec2 insidePetals=square(st,.26);
    vec3 insideCircle=vec3(circle(st,.34,0.));
    
    // Construct the whole flower
    vec2 flower=(insidePetals+outsidePetals);
    color=vec3(flower.x*flower.y)-insideCircle;
    
    color=mix(vec3(.0275,.9451,.0745),vec3(.9686,.4471,.0235),color);
    
    /*  Divide the space for the inner seed and let it also spin,
    but in the opposite direction */
    vec2 seedGrid=tile(st+vec2(cos(u_time),sin(u_time))*-.024,1.);
    vec3 innerSeed=vec3(circle(seedGrid,.06,.02));
    
    color=mix(color,vec3(.8549,1.,.0235),innerSeed);
    
    gl_FragColor=vec4(color,1.);
}