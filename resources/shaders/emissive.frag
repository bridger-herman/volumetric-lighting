#version 300 es

precision mediump float;

const int MAX_LIGHTS = 64;
const float ambient = 0.1;

in vec3 norm;
in vec3 pos;
in vec2 uv;

// The camera's position
uniform vec3 uni_camera_position;

// Color/texture information
uniform bool uni_use_texture;
uniform vec4 uni_color;
uniform vec4 uni_specular;
uniform sampler2D uni_texture;

// Lighting information
uniform int uni_num_lights;
uniform vec3 uni_light_positions[MAX_LIGHTS];
uniform vec3 uni_light_colors[MAX_LIGHTS];

// TEXTURE1 for frame buffer
layout(location = 0) out vec4 color;
// TEXTURE2 for frame buffer
layout(location = 1) out vec4 position;

void main() {
    // Only use a texture if there is one
    color = uni_color;
    if (uni_use_texture) {
        color *= texture(uni_texture, vec2(uv.x, 1.0 - uv.y));
    }
}

