#version 300 es

precision mediump float;

// Volume radius
const float R2 = 1.0;
const float recipR2 = 1.0;
const float recip3R2 = 0.333333;
const float normalizer = 0.75;

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

    // Read z0
    // vec2 depth = gl_FragCoord.zw;
    // float t0 = 1.0 + (depth.x + depth.y) / dot(uni_camera_forward, vdir);
    // vec2 depth = cam_space_pos.zw;
    float t0 = 1.0 + (2.0) / dot(uni_camera_forward, vdir);

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
    float halo = calculate_halo(position.xyz - vec3(0, 1, 0));
    final_color = vec4(vec3(halo), 1.0);
    // final_color = halo * texture(uni_color_texture, tex_coords);
}
