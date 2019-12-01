#version 300 es

precision mediump float;

const float[] gaussian_kernel = float[](
    0.00390625, 0.015625, 0.0234375, 0.015625, 0.00390625,
    0.015625, 0.0625, 0.09375, 0.0625, 0.015625,
    0.0234375, 0.09375, 0.140625, 0.09375, 0.0234375,
    0.015625, 0.0625, 0.09375, 0.0625, 0.015625,
    0.00390625, 0.015625, 0.0234375, 0.015625, 0.00390625
);

const int MAT_SIZE = 5;

in vec2 tex_coords;

uniform sampler2D uni_color_texture;
uniform sampler2D uni_position_texture;

out vec4 final_color;

float luminosity(vec4 color) {
    return 0.3 * color.r + 0.59 * color.g + 0.11 * color.b;
}

void main() {
    // get texture size (in pixels)
    ivec2 size = textureSize(uni_color_texture, 0);

    // Find the current pixel coordinate
    int pixel_x = int(tex_coords.x * float(size.x));
    int pixel_y = int(tex_coords.y * float(size.y));

    final_color = texture(uni_color_texture, tex_coords);

    // loop over kernel values
    vec3 color_sum = vec3(0.0);
    int xx = 0, yy = 0;
    for (int y = 0; y < MAT_SIZE; y++) {
        for (int x = 0; x < MAT_SIZE; x++) {
            int pixel_x_kernel = pixel_x + (x - MAT_SIZE / 2);
            int pixel_y_kernel = pixel_y - (y - MAT_SIZE / 2);
            // clamp so that any edge values are oversampled
            xx = clamp(pixel_x_kernel, 0, size.x);
            yy = clamp(pixel_y_kernel, 0, size.y);

            vec2 kernel_coord_in_tex_space = vec2(
                (float(xx) / float(size.x)),
                (float(yy) / float(size.y))
            );

            color_sum += gaussian_kernel[x + y * MAT_SIZE] *
                texture(uni_color_texture, kernel_coord_in_tex_space).xyz;
        }
    }

    float l = luminosity(final_color);
    final_color = final_color * (1.0 - l) + vec4(color_sum, 1.0) * l;
}
