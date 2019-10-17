import * as wre from '../pkg/wre_wasm.js';

export class WreScript {
    constructor(owner) {
        this._owner = owner;
    }

    update() {
        let ownerObject = wre.get_entity(this._owner);
        ownerObject.transform.position.data[0] += 0.1;
        console.log(ownerObject.transform.position.data[0]);
        wre.set_entity(this._owner, ownerObject);
    }
}
