#version 300 es

precision mediump float;

// Camera constants (copied from camera.rs)
const float near_plane = 0.1;
const float aspect = 16.0 / 9.0;
const float vert_half_angle = radians(45.0);
const float viewport_height = 2.0 * tan(vert_half_angle);
const float viewport_width = viewport_height * aspect;

const float MAX_T = 10.0;
const float STEP_T = 1.0;

// Halo constants
const int MAX_HALOS = 64;
const float HALO_POWER = 0.01;

// Halo definitions
const int num_halos = 5;
const vec3[] halo_positions = vec3[](
    vec3(0.0, 1.0, 2.0),
    vec3(0.0, 1.0, -2.0),
    vec3(0.0, 1.0, 0.0),
    vec3(2.0, 1.0, 0.0),
    vec3(-2.0, 1.0, 0.0)
);

in vec2 tex_coords;

uniform vec3 uni_camera_position;
uniform vec3 uni_camera_forward;
uniform vec3 uni_camera_up;
uniform vec3 uni_camera_right;
uniform mat4 uni_camera_inv_proj;
uniform sampler2D uni_color_texture;
uniform sampler2D uni_position_texture;

out vec4 final_color;

vec3 eval_ray(vec3 ray_start, vec3 ray_dir, float t) {
    return ray_start + ray_dir * t;
}

float sphere_integral(float frag_depth, vec3 ray_start, vec3 ray_dir, vec3
        sphere_center, float sphere_radius) {
    // Solve the quadratic to see if ray intersects sphere
    vec3 start_to_center = ray_start - sphere_center;
    float a = dot(ray_dir, ray_dir);
    float b = 2.0 * dot(ray_dir, start_to_center);
    float c = dot(start_to_center, start_to_center) - sphere_radius *
        sphere_radius;

    float discriminant = b * b - 4.0 * a * c;
    discriminant = max(discriminant, 0.0);

    // Calculate the intersection t values and points
    float sqrt_disc = sqrt(discriminant);
    float t1 = (-b + sqrt_disc) / (2.0 * a);
    float t2 = (-b - sqrt_disc) / (2.0 * a);
    t1 = clamp(t1, 0.0, frag_depth);
    t2 = clamp(t2, 0.0, frag_depth);

    float l = t1 - t2;
    return (l * l) / (sphere_radius);
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

    vec4 halo_color = vec4(0.0);
    for (int i = 0; i < num_halos; i++) {
        float halo_value = sphere_integral(
            position.w,
            uni_camera_position,
            ray_dir,
            halo_positions[i],
            0.3
        );
        halo_color += vec4(vec3(halo_value), 1.0);
    }
    final_color = halo_color + texture(uni_color_texture, tex_coords);
}
