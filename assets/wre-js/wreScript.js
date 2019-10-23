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
        this._entityId = owner;
        this._entity = wre.get_entity(this._entityId);
    }

    updateWrapper() {
        this._entity = wre.get_entity(this._entityId);
        this.update();
        wre.set_entity(this._entityId, this._entity);
    }

    // To be implemented by inheriters
    update() {}
}
