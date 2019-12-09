#version 300 es

precision mediump float;

const int MAX_LIGHTS = 64;
const float ambient = 0.1;

in vec3 pos;
in vec3 norm;
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

const vec4 spot_color = vec4(1);
const vec3 spot_position = vec3(3, 1, 3);
const vec3 spot_direction = vec3(0, -1, 0);
const float spot_angle_inside = radians(45.0);
const float spot_angle_outside = radians(48.0);

void main() {
    vec3 n = normalize(norm);

    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);

    // Spot light direction parameters
    vec3 dir_to_light = spot_position - pos;
    float dist_to_light = length(dir_to_light);
    dir_to_light = normalize(dir_to_light);
    float angle_to_light = dot(dir_to_light, -spot_direction);

    // Illumination_parameters
    float source_illumination = 1.0 / (dist_to_light * dist_to_light);
    float angle = dot(n, dir_to_light);

    // Spot light
    if (angle_to_light < spot_angle_outside && angle_to_light >
            spot_angle_inside) {
        // Partially illuminated
        float percentage = (angle_to_light - spot_angle_inside) /
            (spot_angle_outside - spot_angle_inside);
        vec3 color = spot_color.xyz * uni_color.xyz * angle * source_illumination;
        diffuse += mix(vec3(0.0), color, percentage);
    } else if (angle_to_light > spot_angle_inside) {
        // Fully illuminated
        diffuse += spot_color.xyz * uni_color.xyz * angle * source_illumination;
    }

    // Point lights
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

    position = vec4(pos, gl_FragCoord.z / gl_FragCoord.w);
}

