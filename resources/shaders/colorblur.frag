#version 300 es

precision mediump float;

const mat3 gaussian_kernel = mat3 (
    0.0625,  0.125,  0.0625,
    0.125,  0.25,  0.125,
    0.0625,  0.125,  0.0625
);

in vec2 tex_coords;

uniform sampler2D uni_image;

out vec4 final_color;

void main() {
    // get texture size
    ivec2 size = textureSize(uni_image, 0);

    // tex_coords is -1 to 1; convert to pixels
    vec2 tex_coords_pixels = vec2(0.5 * tex_coords.x * float(size.x), 0.5 *
            tex_coords.y * float(size.y));

    // if the alpha of this pixel is 0.5, we want to blur this pixel
    if (final_color.a == 0.5) {
        vec3 color = vec3(0.0);
        float xx = 0.0, yy = 0.0;

        // loop over kernel values
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 3; x++) {
                // clamp so that any edge values are oversampled
                xx = clamp(tex_coords_pixels.x + (float(x) - 1.0), 0.0, float(size.x));
                yy = clamp(tex_coords_pixels.y + (float(y) - 1.0), 0.0, float(size.y));

                vec2 kernel_coords = vec2(
                    1.0 - 2.0 * (xx / float(size.x)),
                    2.0 * (yy / float(size.y))
                );

                color += gaussian_kernel[y][x] * texture(uni_image, kernel_coords).xyz;
            }
        }

        final_color = vec4(color, 1.0);
    }
}
