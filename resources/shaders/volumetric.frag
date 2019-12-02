#version 300 es

precision mediump float;

// Halo constants
const int MAX_HALOS = 64;

// The radius squared
const float R2 = 0.25;
// 1/(r^2)
const float recipR2 = 4.0;
// 1/(3 * r^2)
const float recip3R2 = 1.333333;
// 3/(4 * r)
const float normalizer = 1.5;

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
uniform sampler2D uni_color_texture;
uniform sampler2D uni_position_texture;

out vec4 final_color;

// From Chapter 10, Advanced Rendering
float calculate_halo(vec3 pobject) {
    vec3 vdir = normalize(uni_camera_position - pobject);
    float v2 = dot(vdir, vdir);
    float p2 = dot(pobject, pobject);
    float pv = -dot(pobject, vdir);
    float m = sqrt(max(pv * pv - v2 * (p2 - R2), 0.0));

    // TODO: actually use depth?
    float t0 = 0.0;

    // Calculate clamped limits of integration
    float t1 = clamp((pv - m) / v2, t0, 100.0);
    float t2 = clamp((pv + m) / v2, t0, 100.0);
    float u1 = t1 * t1;
    float u2 = t2 * t2;

    // Evaluate density integral, normalize, and square
    float B = ((1.0 - p2 * recipR2) * (t2 - t1) + pv * recipR2 * (u2 - u1) -
            v2 * recip3R2 * (t2 * u2 - t1 * u1)) * normalizer;

    return B * B * v2;
}

void main() {
    vec4 position = texture(uni_position_texture, tex_coords);
    vec4 halo_color = vec4(0.0);
    for (int i = 0; i < num_halos; i++) {
        float halo = calculate_halo(position.xyz - halo_positions[i]);
        halo_color += vec4(vec3(halo), 1.0);
    }
    final_color = 0.5 * halo_color * halo_color + 0.5 *
        texture(uni_color_texture, tex_coords);
}
