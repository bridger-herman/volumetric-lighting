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

uniform sampler2D uni_image;

out vec4 final_color;

void main() {
    // get texture size
    ivec2 size = textureSize(uni_image, 0);

    // tex_coords is -1 to 1; convert to pixels
    vec2 tex_coords_pixels = vec2(0.5 * tex_coords.x * float(size.x), 0.5 *
            tex_coords.y * float(size.y));

    final_color = texture(uni_image, tex_coords);

    // if the alpha of this pixel is 0.5, we want to blur this pixel
    if (abs(final_color.a - 0.5) < 0.1) {
        vec3 color = vec3(0.0);
        float xx = 0.0, yy = 0.0;

        // loop over kernel values
        for (int y = 0; y < MAT_SIZE; y++) {
            for (int x = 0; x < MAT_SIZE; x++) {
                // clamp so that any edge values are oversampled
                xx = clamp(tex_coords_pixels.x + (float(x) - 1.0), 0.0, float(size.x));
                yy = clamp(tex_coords_pixels.y + (float(y) - 1.0), 0.0, float(size.y));

                vec2 kernel_coords = vec2(
                    2.0 * (xx / float(size.x)),
                    2.0 * (yy / float(size.y))
                );

                color += gaussian_kernel[x + y * MAT_SIZE] * texture(uni_image, kernel_coords).xyz;
            }
        }

        final_color = vec4(color, 1.0);
    } else {
        final_color.a = 1.0;
    }
}
