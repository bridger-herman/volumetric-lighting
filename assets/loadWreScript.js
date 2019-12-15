import { LightManager } from '/assets/user-scripts/lightManager.js';
import { CircleLight } from '/assets/user-scripts/circleLight.js';
import { SpinMonkey } from '/assets/user-scripts/spinMonkey.js';

export function loadWreScript(name, eid) {
    let ScriptClass = eval(name);
    return new ScriptClass(eid);
}
