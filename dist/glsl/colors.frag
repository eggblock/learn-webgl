#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 lightColor;
uniform vec3 objectColor;

void main()
{
    gl_FragColor = vec4(lightColor*objectColor,1.0);
} 