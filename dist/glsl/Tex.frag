#ifdef GL_ES
precision mediump float;
#endif

varying vec3 outColor;
varying vec2 TexCoord;

uniform sampler2D ourTexture;


void main()
{
    vec4 color = texture2D(ourTexture,TexCoord);
    gl_FragColor = color; //vec4(1.0, 0.5, 0.2, 1.0);
} 