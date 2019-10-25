// transform.rs
//
// Copyright (c) 2019, Univerisity of Minnesota
//
// Author: Bridger Herman (herma582@umn.edu)

//! Frontend for transforms

function createMatrix(pos, rot, scale) {
    let mat = glm.mat4(1.0);
    mat = glm.translate(mat, pos);
    mat = glm.rotate(mat, rot.z, glm.vec3(0.0, 0.0, 1.0));
    mat = glm.rotate(mat, rot.x, glm.vec3(1.0, 0.0, 0.0));
    mat = glm.rotate(mat, rot.y, glm.vec3(0.0, 1.0, 0.0));
    mat = glm.scale(mat, scale);
    return mat;
}

export class Transform {
    constructor(pos, rot, scale, entity) {
        this._position = pos;
        this._rotation = rot;
        this._scale = scale;
        this._matrix = createMatrix(this._position, this._rotation, this._scale);

        this._entity = entity;
        this.parent = null;
    }

    static identity() {
        return new Transform(glm.vec3(0.0), glm.vec3(0.0), glm.vec3(1.0));
    }

    get matrix() {
        return this._matrix;
    }

    _updateMatrix() {
        this._matrix = createMatrix(this._position, this._rotation, this._scale);
    }

    asArray() {
        return this._matrix.elements;
    }

    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
        this._updateMatrix();
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
        this._updateMatrix();
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale = scale;
        this._updateMatrix();
    }
}
