/* wreScript.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Base class for a JS script that can be attached to an Entity
 */

import * as wre from '../pkg/wre_wasm.js';

export class WreScript {
    constructor(owner) {
        this._owner = owner;
    }

    update() {
        let ownerObject = wre.get_entity(this._owner);
        ownerObject.transform.position.data[0] += 0.1;
        wre.set_entity(this._owner, ownerObject);
    }
}
