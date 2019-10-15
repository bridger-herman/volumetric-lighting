// entity.js
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Entity (GameObject); mimics definition on the Rust side

export class JsEntity {
    constructor(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }
}
