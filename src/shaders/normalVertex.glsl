precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 worldViewProjection;

varying vec3 vNormal;

void main()
{
    vNormal = normal;

    gl_Position = worldViewProjection * vec4(position, 1.0);
}