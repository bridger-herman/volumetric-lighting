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

out vec4 color;

void main() {
    vec3 n = normalize(norm);

    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);

    for (int i = 0; i < uni_num_lights && i < MAX_LIGHTS; i++) {
        vec3 l = uni_light_positions[i] - pos;
        vec3 l_n = normalize(l);

        diffuse += 1.0 / pow(length(l), 2.0) * max(0.0, dot(n, l_n)) *
            uni_color.xyz * uni_light_colors[i];

        // Blinn-Phong specularity
        vec3 v = normalize(uni_camera_position - pos);
        vec3 h = normalize(l_n + v);
        specular += 1.0 / length(l) * pow(max(0.0, dot(h, n)), uni_specular.w) *
            uni_specular.xyz * uni_light_colors[i];
    }

    // Only use a texture if there is one
    color = vec4(diffuse + specular, 1.0);
    if (uni_use_texture) {
        color *= texture(uni_texture, vec2(uv.x, 1.0 - uv.y));
    }
}

