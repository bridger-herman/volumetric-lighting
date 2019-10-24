/* shader.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Compile and link shaders, and add them to the rendering engine
 */

import * as wre from './pkg/wre_wasm.js';
import { MoveTest } from './user-scripts/moveTest.js'

export function initWre() {
    initShader('unlit').then(() => {
        let e = wre.create_entity();
        console.log('create_entity');
        loadResource('/resources/models/hex.obj').then((obj_text) => {
            wre.add_mesh(e, obj_text);
            console.log('add mesh');
        }).then(() => {
            let s = new MoveTest(e);
            wre.add_script(e, s);
            console.log('add script');
        }).then(() => {
            wre.make_ready();
        });
    });
}

export class WreScript {
    constructor(owner) {
        this._entityId = owner;
        this._entity = wre.get_entity(this._entityId);
    }

    updateWrapper() {
        this._entity = wre.get_entity(this._entityId);
        this.update();
        wre.set_entity(this._entityId, this._entity);
    }

    // To be implemented by inheriters
    update() {}
}

async function initShader(name) {
    let vertPromise =
        loadResource(`/resources/shaders/${name}.vert`).then((shaderText) => {
            console.debug(`Compiling vert shader '${name}'`);
            return wre.compile_vert_shader(shaderText)
    });
    let fragPromise =
        loadResource(`/resources/shaders/${name}.frag`).then((shaderText) => {
            console.debug(`Compiling frag shader '${name}'`);
            return wre.compile_frag_shader(shaderText)
    });
    return Promise.all([vertPromise, fragPromise]).then((shaders) => {
        console.debug(`Linking shader program '${name}'`);
        let program = wre.link_shader_program(...shaders);
        wre.add_shader(name, program);
    });
}

export async function loadResource(path) {
    console.debug(`Loading resource ${path}`);
    let response = await fetch(path);
    let text = await response.text();
    return text;
}
