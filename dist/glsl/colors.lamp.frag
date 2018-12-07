#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 lightColor;
uniform vec3 objectColor;

void main()
{
    gl_FragColor = vec4(1.0);
} 