/* shader.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Compile and link shaders, and add them to the rendering engine
 */

import { loadResource } from './resource.js'
import * as wre from '../pkg/wre_wasm.js';

export function initShader(name) {
    let vertPromise =
        loadResource(`/resources/shaders/${name}.vert`).then((shaderText) => {
            console.log(`Compiling vert shader '${name}'`);
            return wre.compile_vert_shader(shaderText)
    });
    let fragPromise =
        loadResource(`/resources/shaders/${name}.frag`).then((shaderText) => {
            console.log(`Compiling frag shader '${name}'`);
            return wre.compile_frag_shader(shaderText)
    });
    Promise.all([vertPromise, fragPromise]).then((shaders) => {
        let program = wre.link_shader_program(...shaders);
        wre.add_shader(name, program);
    });
}

