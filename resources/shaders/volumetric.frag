#version 300 es

precision mediump float;

const float INFINITY = 1e10;

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

vec3 sphere_halo(float frag_depth, vec3 ray_start, vec3 ray_dir, vec3
        sphere_center, float sphere_radius, vec3 halo_color) {
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

    float l = abs(t1 - t2);
    return halo_color * ((l * l) / (sphere_radius));
}

// http://www.iquilezles.org/www/articles/intersectors/intersectors.htm
vec3 cyl_integral(float frag_depth, vec3 ray_start, vec3 ray_dir, vec3
        cb, vec3 ca, float radius, vec3 halo_color) {
    vec3 oc = ray_start - cb;
    float card = dot(ca, ray_dir);
    float caoc = dot(ca, oc);
    float a = 1.0 - card * card;
    float b = dot(oc, ray_dir) - caoc * card;
    float c = dot(oc, oc) - caoc * caoc - radius * radius;
    float h = b * b - a * c;
    h = clamp(h, 0.0, frag_depth);
    float h2 = sqrt(h);
    float t1 = (-b - h2) / a;
    float t2 = (-b + h2) / a;
    t1 = clamp(t1, 0.0, frag_depth);
    t2 = clamp(t2, 0.0, frag_depth);
    float l = abs(t2 - t1);
    return halo_color * ((l * l) / radius);
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

    // Add the spot light halo
    vec3 halo_value = cyl_integral(
        position.w,
        uni_camera_position,
        ray_dir,
        vec3(3, 1, 3),
        vec3(0, -1, 0),
        0.8,
        vec3(0.2)
    );

    // Add the sphere halos
    for (int i = 0; i < num_halos; i++) {
        halo_value += sphere_halo(
            position.w,
            uni_camera_position,
            ray_dir,
            halo_positions[i],
            0.3,
            vec3(0.5, 0.0, 0.5)
        );
    }
    final_color = vec4(halo_value, 1.0) + texture(uni_color_texture, tex_coords);
}
