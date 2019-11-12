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
    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);

    // blinn-phong shading
    vec3 n = normalize(norm);
    vec3 v = normalize(-pos);
    vec3 h = normalize(lightDir + v);

    vec3 outColor = vec3(0,0,0);
    // ambient color
    outColor += uni_color.xyz * ambient;
    // diffuse color
    outColor += uni_color.xyz * max(dot(lightDir, n), 0.0);
    // specular color
    outColor += uni_color.xyz * pow(max(dot(h, n), 0.0), 5.0);

    frag_color = vec4(diffuse + specular, 1.0);
    if (uni_color.a == 0.0) {
        frag_color += texture(uni_texture, vec2(uv.x, 1.0 - uv.y));
}
