import { LightManager } from '../../../../user-scripts/lightManager.js';
import { CircleLight } from '../../../../user-scripts/circleLight.js';
import { SpinMonkey } from '../../../../user-scripts/spinMonkey.js';

export function loadWreScript(name, eid) {
    let ScriptClass = eval(name);
    return new ScriptClass(eid);
}
