#version 300 es

precision mediump float;

const int MAX_LIGHTS = 64;
const float SPHERE_INTENSITY_THRESHOLD = 2.0;
const float CYLINDER_INTENSITY_THRESHOLD = 0.2;
const float MIN_RADIUS = 0.1;

in vec2 tex_coords;

uniform vec3 uni_camera_position;
uniform vec3 uni_camera_forward;
uniform vec3 uni_camera_up;
uniform vec3 uni_camera_right;
uniform mat4 uni_camera_inv_proj;
uniform sampler2D uni_color_texture;
uniform sampler2D uni_position_texture;

// Point light information
uniform int uni_num_point_lights;
uniform vec3 uni_point_light_positions[MAX_LIGHTS];
uniform vec3 uni_point_light_colors[MAX_LIGHTS];
uniform float uni_point_light_halo_intensity[MAX_LIGHTS];

// Spot light information
uniform int uni_num_spot_lights;
uniform vec3 uni_spot_light_positions[MAX_LIGHTS];
uniform vec3 uni_spot_light_directions[MAX_LIGHTS];
uniform vec3 uni_spot_light_colors[MAX_LIGHTS];
uniform float uni_spot_light_angle_inside[MAX_LIGHTS];
uniform float uni_spot_light_angle_outside[MAX_LIGHTS];
uniform float uni_spot_light_halo_intensity[MAX_LIGHTS];

out vec4 final_color;

vec3 eval_ray(vec3 ray_start, vec3 ray_dir, float t) {
    return ray_start + ray_dir * t;
}

float luminosity(vec3 color) {
    return 0.3 * color.x + 0.6 * color.g + 0.1 * color.b;
}

vec3 sphere_halo(float frag_depth, vec3 ray_start, vec3 ray_dir, vec3
        sphere_center, vec3 halo_color) {
    // Calculate the effective radius of this sphere halo from its luminosity
    float effective_radius = sqrt(luminosity(halo_color) / SPHERE_INTENSITY_THRESHOLD);
    if (effective_radius < MIN_RADIUS) {
        return vec3(0.0);
    }

    // Solve the quadratic to see if ray intersects sphere
    vec3 start_to_center = ray_start - sphere_center;
    float a = dot(ray_dir, ray_dir);
    float b = 2.0 * dot(ray_dir, start_to_center);
    float c = dot(start_to_center, start_to_center) - effective_radius *
        effective_radius;

    float discriminant = b * b - 4.0 * a * c;
    discriminant = max(discriminant, 0.0);

    // Calculate the intersection t values and points
    float sqrt_disc = sqrt(discriminant);
    float t1 = (-b + sqrt_disc) / (2.0 * a);
    float t2 = (-b - sqrt_disc) / (2.0 * a);
    t1 = clamp(t1, 0.0, frag_depth);
    t2 = clamp(t2, 0.0, frag_depth);

    float l = abs(t1 - t2);
    return halo_color * ((l * l) / (effective_radius));
}

// http://www.iquilezles.org/www/articles/intersectors/intersectors.htm
vec3 cylinder_halo(float frag_depth, vec3 ray_start, vec3 ray_dir, vec3
        cb, vec3 ca, float radius, vec3 halo_color) {
    // Calculate the effective radius of this cylinder halo from its luminosity
    float effective_radius = sqrt(luminosity(halo_color) / CYLINDER_INTENSITY_THRESHOLD);
    if (effective_radius < MIN_RADIUS) {
        return vec3(0.0);
    }

    vec3 oc = ray_start - cb;
    float card = dot(ca, ray_dir);
    float caoc = dot(ca, oc);
    float a = 1.0 - card * card;
    float b = dot(oc, ray_dir) - caoc * card;
    float c = dot(oc, oc) - caoc * caoc - effective_radius * effective_radius;
    float h = b * b - a * c;
    h = clamp(h, 0.0, frag_depth);
    float h2 = sqrt(h);
    float t1 = (-b - h2) / a;
    float t2 = (-b + h2) / a;
    t1 = clamp(t1, 0.0, frag_depth);
    t2 = clamp(t2, 0.0, frag_depth);
    float l = abs(t2 - t1);
    return halo_color * ((l * l) / effective_radius);
}

void main() {
    vec4 position = texture(uni_position_texture, tex_coords);

    // Coords in range [-1, 1]
    vec2 device_coords = tex_coords * 2.0 - 1.0;

    // Calculate the ray between eye and pixel on near plane
    vec4 un_normalized_world = uni_camera_inv_proj * vec4(device_coords, 0.0,
            1.0);
    vec3 world_space_coords = vec3(un_normalized_world.xyz /
            un_normalized_world.w);
    vec3 ray_dir = normalize(world_space_coords.xyz - uni_camera_position);

    vec3 halo_value = vec3(0.0);

    // Add the spot light halos
    for (int i = 0; i < uni_num_spot_lights && i < MAX_LIGHTS; i++) {
        halo_value += cylinder_halo(
            position.w,
            uni_camera_position,
            ray_dir,
            uni_spot_light_positions[i],
            uni_spot_light_directions[i],
            0.8,
            uni_spot_light_colors[i] * uni_spot_light_halo_intensity[i]
        );
    }

    // Add the sphere halos
    for (int i = 0; i < uni_num_point_lights && i < MAX_LIGHTS; i++) {
        halo_value += sphere_halo(
            position.w,
            uni_camera_position,
            ray_dir,
            uni_point_light_positions[i],
            uni_point_light_colors[i] * uni_point_light_halo_intensity[i]
        );
    }

    final_color = vec4(halo_value, 1.0) + texture(uni_color_texture, tex_coords);
}
