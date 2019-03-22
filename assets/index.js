import { importWasm } from './loadWasm.js';
// import { example_wasm_fn } from './pkg/wasm_starter.js'; // Example import

function init() {
  console.log('Hello from JavaScript!');
  // example_wasm_fn() // Example call to wasm code
}

window.onload = () => importWasm().then(init);
