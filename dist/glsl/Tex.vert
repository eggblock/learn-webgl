attribute vec3 aPos;
attribute vec3 aColor;
attribute vec2 aTexCoord;
varying vec3 outColor;
varying vec2 TexCoord;

void main()
{
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    outColor = aColor;
    TexCoord = aTexCoord;
}