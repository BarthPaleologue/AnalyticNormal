precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 worldViewProjection;
uniform mat4 world;

varying vec3 vNormal;

void main()
{
    vNormal = mat3(transpose(inverse(world))) * normal;

    gl_Position = worldViewProjection * vec4(position, 1.0);
}