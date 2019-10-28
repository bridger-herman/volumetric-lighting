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
            let extent = glm.mul(this._dir, t);
            return glm.add(extent, this._start);
        }
    }
}


