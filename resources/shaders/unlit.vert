#version 300 es

in vec3 in_pos;
in vec3 in_norm;

uniform mat4 uni_model;

out vec4 norm;

void main() {
    gl_Position = uni_model * vec4(in_pos, 1);
    norm = vec4(in_norm, 1);
}

