/* wre.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Assorted useful JavaScript interactions for WRE
 */

import * as wre from './pkg/wre_wasm.js';

export const DEFAULT_SHADER = 'phong_forward';
export var DEFAULT_SHADER_ID = 0;

export function initWre() {
    return initShader(DEFAULT_SHADER).then((shaderId) => {
        DEFAULT_SHADER_ID = shaderId;
        wre.make_ready();
    });
}

export class WreScript {
    constructor(owner) {
        this._entityId = owner;
        this._entity = wre.get_entity(this._entityId);
        this.transform = wre.Transform.identity();
        this.start();
    }

    updateWrapper() {
        // Move the entity to JS
        this._entity = wre.get_entity(this._entityId);

        this.transform = this._entity.transform;
        this.update();
        this._entity.transform = this.transform;

        // Move the entity back to Rust
        wre.set_entity(this._entityId, this._entity);
        // BE CAREFUL, this._entity doesn't exist between here and when
        // get_entity() is called at the top of updateWrapper()
    }

    getTransform() {
        return this.transform.matrix.elements;
    }

    // To be implemented by inheriters
    start() {}
    update() {}
}

async function initShader(name) {
    let vertPromise =
        loadTextResource(`./resources/shaders/${name}.vert`).then((shaderText) => {
            console.debug(`Compiling vert shader '${name}'`);
            return wre.compile_vert_shader(shaderText)
    });
    let fragPromise =
        loadTextResource(`./resources/shaders/${name}.frag`).then((shaderText) => {
            console.debug(`Compiling frag shader '${name}'`);
            return wre.compile_frag_shader(shaderText)
    });
    return Promise.all([vertPromise, fragPromise]).then((shaders) => {
        console.debug(`Linking shader program '${name}'`);
        let program = wre.link_shader_program(...shaders);
        return wre.add_shader(name, program);
    });
}

export async function loadTextResource(path) {
    console.debug(`Loading resource ${path}`);
    let response = await fetch(path);
    let text = await response.text();
    return text;
}

function loadImageAsync(path) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

export async function loadImage(path) {
    console.debug(`Loading image ${path}`);
    let img = await loadImageAsync(path);
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let dataUrl = canvas.toDataURL('image/png');
    canvas.remove();
    return dataUrl;
}
