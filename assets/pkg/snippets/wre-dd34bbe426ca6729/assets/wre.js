/* wre.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Assorted useful JavaScript interactions for WRE
 */

import * as wre from './pkg/wre_wasm.js';

export function initWre() {
    return initShader('default2').then(() => {
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
        if (this.constructor.name == 'PlaceToken') {
            console.log(`beginning updateWrapper(): ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
        this._entity = wre.get_entity(this._entityId);
        if (this.constructor.name == 'PlaceToken') {
            console.log(`after get_entity: ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
        this.transform = this._entity.transform;
        if (this.constructor.name == 'PlaceToken') {
            console.log(`after set local transform: ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
        this.update();
        if (this.constructor.name == 'PlaceToken') {
            console.log(`after update() call: ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
        this._entity.transform = this.transform;
        if (this.constructor.name == 'PlaceToken') {
            console.log(`after set entity transform: ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
        wre.set_entity(this._entityId, this._entity);
        if (this.constructor.name == 'PlaceToken') {
            console.log(`after set wre entity: ${this._keyframes[1.0].ptr} ${this.transform.ptr} ${this._entity.transform.ptr}`);
        }
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
        loadResource(`./resources/shaders/${name}.vert`).then((shaderText) => {
            console.debug(`Compiling vert shader '${name}'`);
            return wre.compile_vert_shader(shaderText)
    });
    let fragPromise =
        loadResource(`./resources/shaders/${name}.frag`).then((shaderText) => {
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
