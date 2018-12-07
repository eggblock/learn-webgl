attribute vec3 aPos;
attribute vec3 aColor;
attribute vec2 aTexCoord;
varying vec3 outColor;
varying vec2 TexCoord;

uniform mat4 transform;

void main()
{
    gl_Position = transform * vec4(aPos.x, aPos.y, aPos.z, 1.0);
    outColor = aColor;
    TexCoord = aTexCoord;
}