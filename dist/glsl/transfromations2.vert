attribute vec3 aPos;
attribute vec2 aTexCoord;
varying vec3 outColor;
varying vec2 TexCoord;

uniform mat4 transform;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos.x,aPos.y,aPos.z,1.0);
    TexCoord = aTexCoord;
}