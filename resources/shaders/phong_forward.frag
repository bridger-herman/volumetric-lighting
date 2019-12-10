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

// Point light information
uniform int uni_num_point_lights;
uniform vec3 uni_point_light_positions[MAX_LIGHTS];
uniform vec3 uni_point_light_colors[MAX_LIGHTS];

// Spot light information
uniform int uni_num_spot_lights;
uniform vec3 uni_spot_light_positions[MAX_LIGHTS];
uniform vec3 uni_spot_light_directions[MAX_LIGHTS];
uniform vec3 uni_spot_light_colors[MAX_LIGHTS];
uniform float uni_spot_light_angle_inside[MAX_LIGHTS];
uniform float uni_spot_light_angle_outside[MAX_LIGHTS];

// TEXTURE1 for frame buffer
layout(location = 0) out vec4 color;
// TEXTURE2 for frame buffer
layout(location = 1) out vec4 position;

void main() {
    vec3 n = normalize(norm);

    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);

    // Calculate spot light illumination
    for (int i = 0; i < uni_num_spot_lights && i < MAX_LIGHTS; i++) {
        // Spot light direction parameters
        vec3 dir_to_light = uni_spot_light_positions[i] - pos;
        float dist_to_light = length(dir_to_light);
        dir_to_light = normalize(dir_to_light);
        float angle_to_light = dot(dir_to_light, -uni_spot_light_directions[i]);

        // Illumination_parameters
        float source_illumination = 1.0 / (dist_to_light * dist_to_light);
        float angle = dot(n, dir_to_light);

        // Spot light
        if (angle_to_light < uni_spot_light_angle_outside[i] && angle_to_light
                > uni_spot_light_angle_inside[i]) {
            // Partially illuminated
            float percentage = (angle_to_light -
                    uni_spot_light_angle_inside[i]) /
                (uni_spot_light_angle_outside[i] -
                 uni_spot_light_angle_inside[i]);
            vec3 color = uni_spot_light_colors[i].xyz * uni_color.xyz * angle
                * source_illumination;
            diffuse += mix(vec3(0.0), color, percentage);
        } else if (angle_to_light > uni_spot_light_angle_inside[i]) {
            // Fully illuminated
            diffuse += uni_spot_light_colors[i].xyz * uni_color.xyz * angle *
                source_illumination;
        }
    }

    // Point lights
    for (int i = 0; i < uni_num_point_lights && i < MAX_LIGHTS; i++) {
        vec3 l = uni_point_light_positions[i] - pos;
        vec3 l_n = normalize(l);

        diffuse += 1.0 / pow(length(l), 2.0) * max(0.0, dot(n, l_n)) *
            uni_color.xyz * uni_point_light_colors[i];

        // Blinn-Phong specularity
        vec3 v = normalize(uni_camera_position - pos);
        vec3 h = normalize(l_n + v);
        specular += 1.0 / length(l) * pow(max(0.0, dot(h, n)), uni_specular.w) *
            uni_specular.xyz * uni_point_light_colors[i];
    }

    // Only use a texture if there is one
    color = vec4(diffuse + specular, 1.0);
    if (uni_use_texture) {
        color *= texture(uni_texture, vec2(uv.x, 1.0 - uv.y));
    }

    position = vec4(pos, gl_FragCoord.z / gl_FragCoord.w);
}

