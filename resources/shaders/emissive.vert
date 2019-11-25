#version 300 es

layout(location = 0) in vec3 in_pos;
layout(location = 1) in vec3 in_norm;
layout(location = 2) in vec2 in_uv;

uniform mat4 uni_model;
uniform mat4 uni_normal;
uniform mat4 uni_projection_view;

out vec3 pos;
out vec3 norm;
out vec2 uv;

void main() {
    vec4 frag_pos = uni_model * vec4(in_pos, 1.0);
    pos = frag_pos.xyz;
    gl_Position = uni_projection_view * frag_pos;

    // normal must be multiplied by inverse transpose of the model matrix
    norm = (uni_normal * vec4(in_norm, 0)).xyz;

    uv = in_uv;
}

