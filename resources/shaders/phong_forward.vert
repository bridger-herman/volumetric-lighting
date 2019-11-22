#version 300 es

// glm.perspective(glm.radians(45), 16.0/9.0, 0.1, 30)
const mat4 proj = mat4(
    1.358 ,            0 ,            0 ,            0 ,
        0 ,      2.41421 ,            0 ,            0 ,
        0 ,            0 ,     -1.00669 ,           -1 ,
        0 ,            0 ,    -0.200669 ,            0
);

// glm.lookAt(glm.vec3(0, 1, 1), glm.vec3(0), glm.vec3(0, 1, -1))
// const mat4 view = mat4(
            // 1 ,            0 ,           -0 ,            0 ,
            // 0 ,     0.707107 ,     0.707107 ,            0 ,
            // 0 ,    -0.707107 ,     0.707107 ,            0 ,
           // -0 ,           -0 ,     -1.41421 ,            1
// );

layout(location = 0) in vec3 in_pos;
layout(location = 1) in vec3 in_norm;
layout(location = 2) in vec2 in_uv;

uniform mat4 uni_model;
uniform mat4 uni_normal;
uniform mat4 uni_view;

out vec3 pos;
out vec3 norm;
out vec2 uv;

void main() {
    vec4 final_pos = proj * uni_view * uni_model * vec4(in_pos, 1);
    pos = final_pos.xyz;

    // normal must be multiplied by inverse transpose of the model matrix
    norm = (uni_normal * vec4(in_norm, 0)).xyz;

    uv = in_uv;

    gl_Position = final_pos;
}

