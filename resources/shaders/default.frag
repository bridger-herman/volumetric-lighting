#version 300 es

precision mediump float;

// a directional light
const vec3 lightDir = normalize(vec3(0, 1, -1));
const vec4 color = vec4(1.0, 0.0, 1.0, 1.0);

in vec3 pos;
// in vec3 norm;

out vec4 frag_color;

void main() {
    // blinn-phong shading
    // vec3 n = normalize(norm);
    vec3 n = normalize(vec3(1));
    vec3 v = normalize(-pos);
    vec3 h = normalize(lightDir + v);

    // if (color.w == 0.0) {
    // vec2 coords = vec2(UV.x, 1 - UV.y);
    // frag_color = texture(tex, coords);
    // }
    // else {
    vec3 outColor = vec3(0,0,0);
    // ambient color
    outColor += color.xyz * ambient;
    // diffuse color
    outColor += color.xyz * max(dot(lightDir, n), 0.0);
    // specular color
    outColor += color.xyz * pow(max(dot(h, n), 0.0), 10);
    // outColor = scale;
    frag_color = vec4(outColor, color.w);
    // }
}
