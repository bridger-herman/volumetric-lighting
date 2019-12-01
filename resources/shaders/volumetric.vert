#version 300 es

layout (location = 0) in vec3 in_pos;
layout (location = 1) in vec2 in_norm;
layout (location = 2) in vec2 in_uv;

out vec2 tex_coords;

void main() {
    gl_Position = vec4(in_pos, 1);
    tex_coords = in_uv;
}
