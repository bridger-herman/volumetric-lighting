// From wasm-bindgen:
// https://github.com/rustwasm/wasm-bindgen/tree/master/examples/without-a-bundler
//
// Use ES module import syntax to import functionality from the module
// that we have compiled.
//
// Note that the `default` import is an initialization function which
// will "boot" the module and make it ready to use. Currently browsers
// don't support natively imported WebAssembly as an ES module, but
// eventually the manual initialization won't be required!

// NOTE: this is relative to where your JavaScript modules are located
import { default as init } from './pkg/wre_wasm.js';

export var wasm = null;

export async function importWasm() {
  // First up we need to actually load the wasm file, so we use the
  // default export to inform it where the wasm file is located on the
  // server, and then we wait on the returned promise to wait for the
  // wasm to be loaded.
  //
  // Note that instead of a string here you can also pass in an instance
  // of `WebAssembly.Module` which allows you to compile your own module.
  // Also note that the promise, when resolved, yields the wasm module's
  // exports which is the same as importing the `*_bg` module in other
  // modes
  console.log('initialing wasm');

  // NOTE: this is relative to wherever your HTML files are located
  wasm = await init('./assets/pkg/wre_wasm_bg.wasm');

  console.log('wasm initialized');
}
