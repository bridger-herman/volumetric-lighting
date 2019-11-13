#version 300 es

precision mediump float;

// a directional light
const vec3 lightDir = normalize(vec3(0, 1, 0.5));
const float ambient = 0.2;

in vec3 pos;
in vec3 norm;
in vec2 uv;

uniform vec4 uni_color;
uniform sampler2D uni_texture;

out vec4 frag_color;

void main() {
    vec4 in_color = uni_color;

    if (uni_color.a == 0.0) {
        in_color = texture(uni_texture, vec2(uv.x, 1.0 - uv.y));
    }

    // blinn-phong shading
    vec3 n = normalize(norm);
    vec3 v = normalize(-pos);
    vec3 h = normalize(lightDir + v);

    vec3 out_color = vec3(0);
    // ambient color
    out_color += in_color.xyz * ambient;
    // diffuse color
    out_color += in_color.xyz * max(dot(lightDir, n), 0.0);
    // specular color
    out_color += in_color.xyz * pow(max(dot(h, n), 0.0), 10.0);

    if (abs(uni_color.a - 0.5) < 0.001) {
        frag_color = vec4(out_color * 2.0, 0.5);
    }
    else {
        frag_color = vec4(out_color, 1.0);
    }
}
