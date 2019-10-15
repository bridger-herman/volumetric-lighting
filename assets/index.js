import { importWasm } from './loadWasm.js';
import { JsScript } from './jsScript.js'
import * as wre from './pkg/wre_wasm.js'; // Example import



function init() {
    console.log('Hello from JavaScript!');
    let e = wre.create_entity();
    let s = new JsScript(e);
    wre.add_script(e, s);
}

window.onload = () => importWasm().then(init);
