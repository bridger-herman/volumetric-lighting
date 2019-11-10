/* ray.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * A ray
 */

export class Ray {
    constructor(start, dir) {
        this._start = start;
        this._dir = dir;
        this._tMin = 0.0;
        this._tMax = 10.0;
    }

    eval(t) {
        if (t >= this._tMin || t <= this._tMax) {
            let extent = this._dir.mul(t);
            return extent.add(this._start);
        }
    }
}


