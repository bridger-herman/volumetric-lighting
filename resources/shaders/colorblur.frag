#version 300 es

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
    ivec2 size = textureSize(uni_image); // do I need a lod value?

    final_color = texture(uni_image, tex_coords);

    // if the alpha of this pixel is 0.5, we want to blur this pixel
    if (final_color.a == 0.5) {
        vec3 color = vec3(0,0,0);
        int xx = 0, yy = 0;

        // loop over kernel values
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 3; x++) {
                // clamp so that any edge values are oversampled
                xx = clamp(tex_coords.x + (x - 1), 0, size.x);
                yy = clamp(tex_coords.y + (y - 1), 0, size.y);

                color += gaussian_kernel[y][x] * texture(uni_image, vec2(xx,yy)).xyz;
            }
        }

        final_color = vec4(color, 1.0);
    }
}