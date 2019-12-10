import { LightManager } from '/assets/user-scripts/lightManager.js';

export function loadWreScript(name, eid) {
    let ScriptClass = eval(name);
    return new ScriptClass(eid);
}
