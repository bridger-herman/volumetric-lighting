#version 300 es

in vec2 tex_coords;

uniform sampler2D uni_image;

out vec4 final_color;

void main() {
    final_color = Texture(uni_image, tex_coords);
}