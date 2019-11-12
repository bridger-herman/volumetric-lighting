
let wasm;

function __wbg_elem_binding0(arg0, arg1) {
    wasm.__wbg_function_table.get(51)(arg0, arg1);
}
/**
*/
export function start() {
    wasm.start();
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
* @returns {any}
*/
export function create_entity() {
    const ret = wasm.create_entity();
    return takeObject(ret);
}

/**
* @param {number} eid
*/
export function destroy_entity(eid) {
    wasm.destroy_entity(eid);
}

/**
* @param {number} id
* @returns {Entity}
*/
export function get_entity(id) {
    const ret = wasm.get_entity(id);
    return Entity.__wrap(ret);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {number} id
* @param {Entity} entity
*/
export function set_entity(id, entity) {
    _assertClass(entity, Entity);
    const ptr0 = entity.ptr;
    entity.ptr = 0;
    wasm.set_entity(id, ptr0);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
* @param {number} eid
* @param {any} script
*/
export function add_script(eid, script) {
    wasm.add_script(eid, addHeapObject(script));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function passStringToWasm(arg) {

    let len = arg.length;
    let ptr = wasm.__wbindgen_malloc(len);

    const mem = getUint8Memory();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = wasm.__wbindgen_realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} name
* @param {any} program
* @returns {number}
*/
export function add_shader(name, program) {
    const ret = wasm.add_shader(passStringToWasm(name), WASM_VECTOR_LEN, addHeapObject(program));
    return ret >>> 0;
}

/**
* @param {number} eid
* @param {string} obj_source
*/
export function add_mesh(eid, obj_source) {
    wasm.add_mesh(eid, passStringToWasm(obj_source), WASM_VECTOR_LEN);
}

/**
* @param {string} b64_bytes
* @returns {number}
*/
export function add_texture(b64_bytes) {
    const ret = wasm.add_texture(passStringToWasm(b64_bytes), WASM_VECTOR_LEN);
    return ret >>> 0;
}

/**
*/
export function make_ready() {
    wasm.make_ready();
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* @param {string} source
* @returns {any}
*/
export function compile_vert_shader(source) {
    const ret = wasm.compile_vert_shader(passStringToWasm(source), WASM_VECTOR_LEN);
    return takeObject(ret);
}

/**
* @param {string} source
* @returns {any}
*/
export function compile_frag_shader(source) {
    const ret = wasm.compile_frag_shader(passStringToWasm(source), WASM_VECTOR_LEN);
    return takeObject(ret);
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {any} vert_shader
* @param {any} frag_shader
* @returns {any}
*/
export function link_shader_program(vert_shader, frag_shader) {
    try {
        const ret = wasm.link_shader_program(addBorrowedObject(vert_shader), addBorrowedObject(frag_shader));
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

let cachegetFloat32Memory = null;
function getFloat32Memory() {
    if (cachegetFloat32Memory === null || cachegetFloat32Memory.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory;
}

function getArrayF32FromWasm(ptr, len) {
    return getFloat32Memory().subarray(ptr / 4, ptr / 4 + len);
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function passArrayF32ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 4);
    getFloat32Memory().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
*/
export class Entity {

    static __wrap(ptr) {
        const obj = Object.create(Entity.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_entity_free(ptr);
    }
    /**
    * @returns {number}
    */
    get id() {
        const ret = wasm.__wbg_get_entity_id(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set id(arg0) {
        wasm.__wbg_set_entity_id(this.ptr, arg0);
    }
    /**
    * @param {number} id
    * @returns {Entity}
    */
    constructor(id) {
        const ret = wasm.entity_new(id);
        return Entity.__wrap(ret);
    }
    /**
    * @returns {Transform}
    */
    get transform() {
        const ret = wasm.entity_transform(this.ptr);
        return Transform.__wrap(ret);
    }
    /**
    * @param {Transform} tf
    */
    set transform(tf) {
        _assertClass(tf, Transform);
        wasm.entity_set_transform(this.ptr, tf.ptr);
    }
    /**
    * @returns {Material}
    */
    get material() {
        const ret = wasm.entity_material(this.ptr);
        return Material.__wrap(ret);
    }
    /**
    * @param {Material} mat
    */
    set material(mat) {
        _assertClass(mat, Material);
        wasm.entity_set_material(this.ptr, mat.ptr);
    }
}
/**
* A 2x2 column major matrix.
*/
export class Mat2 {

    static __wrap(ptr) {
        const obj = Object.create(Mat2.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mat2_free(ptr);
    }
    /**
    * @returns {Mat2}
    */
    static zero() {
        const ret = wasm.mat2_zero();
        return Mat2.__wrap(ret);
    }
    /**
    * @returns {Mat2}
    */
    static identity() {
        const ret = wasm.mat2_identity();
        return Mat2.__wrap(ret);
    }
    /**
    * Creates a new `Mat2` from four column vectors.
    * @param {Vec2} x_axis
    * @param {Vec2} y_axis
    * @returns {Mat2}
    */
    static from_cols(x_axis, y_axis) {
        _assertClass(x_axis, Vec2);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec2);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        const ret = wasm.mat2_from_cols(ptr0, ptr1);
        return Mat2.__wrap(ret);
    }
    /**
    * Creates a new `Mat2` from a `[f32; 4]` stored in column major order.
    * If your data is stored in row major you will need to `transpose` the resulting `Mat2`.
    * Creates a new `[f32; 4]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat2` first.
    * Creates a new `Mat2` from a `[[f32; 2]; 2]` stored in column major order.
    * If your data is in row major order you will need to `transpose` the resulting `Mat2`.
    * Creates a new `[[f32; 2]; 2]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat2` first.
    * Create a 2x2 matrix containing scale and rotation (in radians).
    * @param {Vec2} scale
    * @param {number} angle
    * @returns {Mat2}
    */
    static from_scale_angle(scale, angle) {
        _assertClass(scale, Vec2);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        const ret = wasm.mat2_from_scale_angle(ptr0, angle);
        return Mat2.__wrap(ret);
    }
    /**
    * Create a 2x2 matrix containing a rotation (in radians).
    * @param {number} angle
    * @returns {Mat2}
    */
    static from_angle(angle) {
        const ret = wasm.mat2_from_angle(angle);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Vec2} scale
    * @returns {Mat2}
    */
    static from_scale(scale) {
        _assertClass(scale, Vec2);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        const ret = wasm.mat2_from_scale(ptr0);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Vec2} x
    */
    set_x_axis(x) {
        _assertClass(x, Vec2);
        const ptr0 = x.ptr;
        x.ptr = 0;
        wasm.mat2_set_x_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec2} y
    */
    set_y_axis(y) {
        _assertClass(y, Vec2);
        const ptr0 = y.ptr;
        y.ptr = 0;
        wasm.mat2_set_y_axis(this.ptr, ptr0);
    }
    /**
    * @returns {Vec2}
    */
    x_axis() {
        const ret = wasm.mat2_x_axis(this.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @returns {Vec2}
    */
    y_axis() {
        const ret = wasm.mat2_y_axis(this.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @returns {Mat2}
    */
    transpose() {
        const ret = wasm.mat2_transpose(this.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    determinant() {
        const ret = wasm.mat2_determinant(this.ptr);
        return ret;
    }
    /**
    * @returns {Mat2}
    */
    inverse() {
        const ret = wasm.mat2_inverse(this.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    mul_vec2(other) {
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat2_mul_vec2(this.ptr, ptr0);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Mat2} other
    * @returns {Mat2}
    */
    mul_mat2(other) {
        _assertClass(other, Mat2);
        const ret = wasm.mat2_mul_mat2(this.ptr, other.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Mat2`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Mat2} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        _assertClass(other, Mat2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat2_abs_diff_eq(this.ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * @param {Mat2} other
    * @returns {Mat2}
    */
    add(other) {
        _assertClass(other, Mat2);
        const ret = wasm.mat2_add(this.ptr, other.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Mat2} other
    * @returns {Mat2}
    */
    sub(other) {
        _assertClass(other, Mat2);
        const ret = wasm.mat2_sub(this.ptr, other.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat2}
    */
    mul(other) {
        const ret = wasm.mat2_mul(this.ptr, other);
        return Mat2.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.mat2_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
    /**
    * @param {Mat2} other
    * @returns {Mat2}
    */
    sub_mat2(other) {
        _assertClass(other, Mat2);
        const ret = wasm.mat2_sub_mat2(this.ptr, other.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Mat2} other
    * @returns {Mat2}
    */
    add_mat2(other) {
        _assertClass(other, Mat2);
        const ret = wasm.mat2_add_mat2(this.ptr, other.ptr);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat2}
    */
    mul_scalar(other) {
        const ret = wasm.mat2_mul_scalar(this.ptr, other);
        return Mat2.__wrap(ret);
    }
    /**
    * @param {Vec2} x_axis
    * @param {Vec2} y_axis
    * @returns {Mat2}
    */
    constructor(x_axis, y_axis) {
        _assertClass(x_axis, Vec2);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec2);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        const ret = wasm.mat2_new(ptr0, ptr1);
        return Mat2.__wrap(ret);
    }
}
/**
* A 3x3 column major matrix.
*
* This type is 16 byte aligned.
*/
export class Mat3 {

    static __wrap(ptr) {
        const obj = Object.create(Mat3.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mat3_free(ptr);
    }
    /**
    * @returns {Mat3}
    */
    static zero() {
        const ret = wasm.mat3_zero();
        return Mat3.__wrap(ret);
    }
    /**
    * @returns {Mat3}
    */
    static identity() {
        const ret = wasm.mat3_identity();
        return Mat3.__wrap(ret);
    }
    /**
    * Creates a new `Mat3` from three column vectors.
    * @param {Vec3} x_axis
    * @param {Vec3} y_axis
    * @param {Vec3} z_axis
    * @returns {Mat3}
    */
    static from_cols(x_axis, y_axis, z_axis) {
        _assertClass(x_axis, Vec3);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec3);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        _assertClass(z_axis, Vec3);
        const ptr2 = z_axis.ptr;
        z_axis.ptr = 0;
        const ret = wasm.mat3_from_cols(ptr0, ptr1, ptr2);
        return Mat3.__wrap(ret);
    }
    /**
    * Creates a new `Mat3` from a `[f32; 9]` stored in column major order.
    * If your data is stored in row major you will need to `transpose` the resulting `Mat3`.
    * Creates a new `[f32; 9]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat3` first.
    * Creates a new `Mat3` from a `[[f32; 3]; 3]` stored in column major order.
    * If your data is in row major order you will need to `transpose` the resulting `Mat3`.
    * Creates a new `[[f32; 3]; 3]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat3` first.
    * Creates a new `Mat3` that can scale, rotate and translate a 2D vector.
    * `angle` is in radians.
    * @param {Vec2} scale
    * @param {number} angle
    * @param {Vec2} translation
    * @returns {Mat3}
    */
    static from_scale_angle_translation(scale, angle, translation) {
        _assertClass(scale, Vec2);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        _assertClass(translation, Vec2);
        const ptr1 = translation.ptr;
        translation.ptr = 0;
        const ret = wasm.mat3_from_scale_angle_translation(ptr0, angle, ptr1);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Quat} rotation
    * @returns {Mat3}
    */
    static from_quat(rotation) {
        _assertClass(rotation, Quat);
        const ptr0 = rotation.ptr;
        rotation.ptr = 0;
        const ret = wasm.mat3_from_quat(ptr0);
        return Mat3.__wrap(ret);
    }
    /**
    * Create a 3x3 rotation matrix from a normalized rotation axis and angle (in radians).
    * @param {Vec3} axis
    * @param {number} angle
    * @returns {Mat3}
    */
    static from_axis_angle(axis, angle) {
        _assertClass(axis, Vec3);
        const ptr0 = axis.ptr;
        axis.ptr = 0;
        const ret = wasm.mat3_from_axis_angle(ptr0, angle);
        return Mat3.__wrap(ret);
    }
    /**
    * Create a 3x3 rotation matrix from the given euler angles (in radians).
    * @param {number} yaw
    * @param {number} pitch
    * @param {number} roll
    * @returns {Mat3}
    */
    static from_rotation_ypr(yaw, pitch, roll) {
        const ret = wasm.mat3_from_rotation_ypr(yaw, pitch, roll);
        return Mat3.__wrap(ret);
    }
    /**
    * Create a 3x3 rotation matrix from the angle (in radians) around the x axis.
    * @param {number} angle
    * @returns {Mat3}
    */
    static from_rotation_x(angle) {
        const ret = wasm.mat3_from_rotation_x(angle);
        return Mat3.__wrap(ret);
    }
    /**
    * Create a 3x3 rotation matrix from the angle (in radians) around the y axis.
    * @param {number} angle
    * @returns {Mat3}
    */
    static from_rotation_y(angle) {
        const ret = wasm.mat3_from_rotation_y(angle);
        return Mat3.__wrap(ret);
    }
    /**
    * Create a 3x3 rotation matrix from the angle (in radians) around the z axis.
    * @param {number} angle
    * @returns {Mat3}
    */
    static from_rotation_z(angle) {
        const ret = wasm.mat3_from_rotation_z(angle);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Vec3} scale
    * @returns {Mat3}
    */
    static from_scale(scale) {
        _assertClass(scale, Vec3);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        const ret = wasm.mat3_from_scale(ptr0);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Vec3} x
    */
    set_x_axis(x) {
        _assertClass(x, Vec3);
        const ptr0 = x.ptr;
        x.ptr = 0;
        wasm.mat3_set_x_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec3} y
    */
    set_y_axis(y) {
        _assertClass(y, Vec3);
        const ptr0 = y.ptr;
        y.ptr = 0;
        wasm.mat3_set_y_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec3} z
    */
    set_z_axis(z) {
        _assertClass(z, Vec3);
        const ptr0 = z.ptr;
        z.ptr = 0;
        wasm.mat3_set_z_axis(this.ptr, ptr0);
    }
    /**
    * @returns {Vec3}
    */
    x_axis() {
        const ret = wasm.mat3_x_axis(this.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    y_axis() {
        const ret = wasm.mat3_y_axis(this.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    z_axis() {
        const ret = wasm.mat3_z_axis(this.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Mat3}
    */
    transpose() {
        const ret = wasm.mat3_transpose(this.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    determinant() {
        const ret = wasm.mat3_determinant(this.ptr);
        return ret;
    }
    /**
    * @returns {Mat3}
    */
    inverse() {
        const ret = wasm.mat3_inverse(this.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    mul_vec3(other) {
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat3_mul_vec3(this.ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * Multiplies two 3x3 matrices.
    * @param {Mat3} other
    * @returns {Mat3}
    */
    mul_mat3(other) {
        _assertClass(other, Mat3);
        const ret = wasm.mat3_mul_mat3(this.ptr, other.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Mat3} other
    * @returns {Mat3}
    */
    add_mat3(other) {
        _assertClass(other, Mat3);
        const ret = wasm.mat3_add_mat3(this.ptr, other.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Mat3} other
    * @returns {Mat3}
    */
    sub_mat3(other) {
        _assertClass(other, Mat3);
        const ret = wasm.mat3_sub_mat3(this.ptr, other.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat3}
    */
    mul_scalar(other) {
        const ret = wasm.mat3_mul_scalar(this.ptr, other);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    transform_point2(other) {
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat3_transform_point2(this.ptr, ptr0);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    transform_vector2(other) {
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat3_transform_vector2(this.ptr, ptr0);
        return Vec2.__wrap(ret);
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Mat3`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Mat3} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        _assertClass(other, Mat3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat3_abs_diff_eq(this.ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * @param {Mat3} other
    * @returns {Mat3}
    */
    add(other) {
        _assertClass(other, Mat3);
        const ret = wasm.mat3_add(this.ptr, other.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {Mat3} other
    * @returns {Mat3}
    */
    sub(other) {
        _assertClass(other, Mat3);
        const ret = wasm.mat3_sub(this.ptr, other.ptr);
        return Mat3.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat3}
    */
    mul(other) {
        const ret = wasm.mat3_mul(this.ptr, other);
        return Mat3.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.mat3_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
    /**
    * @param {Vec3} x_axis
    * @param {Vec3} y_axis
    * @param {Vec3} z_axis
    * @returns {Mat3}
    */
    constructor(x_axis, y_axis, z_axis) {
        _assertClass(x_axis, Vec3);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec3);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        _assertClass(z_axis, Vec3);
        const ptr2 = z_axis.ptr;
        z_axis.ptr = 0;
        const ret = wasm.mat3_new(ptr0, ptr1, ptr2);
        return Mat3.__wrap(ret);
    }
}
/**
* A 4x4 column major matrix.
*
* This type is 16 byte aligned.
*/
export class Mat4 {

    static __wrap(ptr) {
        const obj = Object.create(Mat4.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mat4_free(ptr);
    }
    /**
    * Creates a new `Mat4` with all elements set to `0.0`.
    * @returns {Mat4}
    */
    static zero() {
        const ret = wasm.mat4_zero();
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` identity matrix.
    * @returns {Mat4}
    */
    static identity() {
        const ret = wasm.mat4_identity();
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` from four column vectors.
    * @param {Vec4} x_axis
    * @param {Vec4} y_axis
    * @param {Vec4} z_axis
    * @param {Vec4} w_axis
    * @returns {Mat4}
    */
    static from_cols(x_axis, y_axis, z_axis, w_axis) {
        _assertClass(x_axis, Vec4);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec4);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        _assertClass(z_axis, Vec4);
        const ptr2 = z_axis.ptr;
        z_axis.ptr = 0;
        _assertClass(w_axis, Vec4);
        const ptr3 = w_axis.ptr;
        w_axis.ptr = 0;
        const ret = wasm.mat4_from_cols(ptr0, ptr1, ptr2, ptr3);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` from a `[f32; 16]` stored in column major order.
    * If your data is stored in row major you will need to `transpose` the resulting `Mat4`.
    * Creates a new `[f32; 16]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat4` first.
    * Creates a new `Mat4` from a `[[f32; 4]; 4]` stored in column major order.
    * If your data is in row major order you will need to `transpose` the resulting `Mat4`.
    * Creates a new `[[f32; 4]; 4]` storing data in column major order.
    * If you require data in row major order `transpose` the `Mat4` first.
    * @param {Vec3} scale
    * @param {Quat} rotation
    * @param {Vec3} translation
    * @returns {Mat4}
    */
    static from_scale_rotation_translation(scale, rotation, translation) {
        _assertClass(scale, Vec3);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        _assertClass(rotation, Quat);
        const ptr1 = rotation.ptr;
        rotation.ptr = 0;
        _assertClass(translation, Vec3);
        const ptr2 = translation.ptr;
        translation.ptr = 0;
        const ret = wasm.mat4_from_scale_rotation_translation(ptr0, ptr1, ptr2);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Quat} rotation
    * @param {Vec3} translation
    * @returns {Mat4}
    */
    static from_rotation_translation(rotation, translation) {
        _assertClass(rotation, Quat);
        const ptr0 = rotation.ptr;
        rotation.ptr = 0;
        _assertClass(translation, Vec3);
        const ptr1 = translation.ptr;
        translation.ptr = 0;
        const ret = wasm.mat4_from_rotation_translation(ptr0, ptr1);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Quat} rotation
    * @returns {Mat4}
    */
    static from_quat(rotation) {
        _assertClass(rotation, Quat);
        const ptr0 = rotation.ptr;
        rotation.ptr = 0;
        const ret = wasm.mat4_from_quat(ptr0);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec3} translation
    * @returns {Mat4}
    */
    static from_translation(translation) {
        _assertClass(translation, Vec3);
        const ptr0 = translation.ptr;
        translation.ptr = 0;
        const ret = wasm.mat4_from_translation(ptr0);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` containing a rotation around a normalized rotation axis of
    * angle (in radians).
    * @param {Vec3} axis
    * @param {number} angle
    * @returns {Mat4}
    */
    static from_axis_angle(axis, angle) {
        _assertClass(axis, Vec3);
        const ptr0 = axis.ptr;
        axis.ptr = 0;
        const ret = wasm.mat4_from_axis_angle(ptr0, angle);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` containing a rotation around the given euler angles
    * (in radians).
    * @param {number} yaw
    * @param {number} pitch
    * @param {number} roll
    * @returns {Mat4}
    */
    static from_rotation_ypr(yaw, pitch, roll) {
        const ret = wasm.mat4_from_rotation_ypr(yaw, pitch, roll);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` containing a rotation around the x axis of angle
    * (in radians).
    * @param {number} angle
    * @returns {Mat4}
    */
    static from_rotation_x(angle) {
        const ret = wasm.mat4_from_rotation_x(angle);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` containing a rotation around the y axis of angle
    * (in radians).
    * @param {number} angle
    * @returns {Mat4}
    */
    static from_rotation_y(angle) {
        const ret = wasm.mat4_from_rotation_y(angle);
        return Mat4.__wrap(ret);
    }
    /**
    * Creates a new `Mat4` containing a rotation around the z axis of angle
    * (in radians).
    * @param {number} angle
    * @returns {Mat4}
    */
    static from_rotation_z(angle) {
        const ret = wasm.mat4_from_rotation_z(angle);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec3} scale
    * @returns {Mat4}
    */
    static from_scale(scale) {
        _assertClass(scale, Vec3);
        const ptr0 = scale.ptr;
        scale.ptr = 0;
        const ret = wasm.mat4_from_scale(ptr0);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec4} x
    */
    set_x_axis(x) {
        _assertClass(x, Vec4);
        const ptr0 = x.ptr;
        x.ptr = 0;
        wasm.mat4_set_x_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec4} y
    */
    set_y_axis(y) {
        _assertClass(y, Vec4);
        const ptr0 = y.ptr;
        y.ptr = 0;
        wasm.mat4_set_y_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec4} z
    */
    set_z_axis(z) {
        _assertClass(z, Vec4);
        const ptr0 = z.ptr;
        z.ptr = 0;
        wasm.mat4_set_z_axis(this.ptr, ptr0);
    }
    /**
    * @param {Vec4} w
    */
    set_w_axis(w) {
        _assertClass(w, Vec4);
        const ptr0 = w.ptr;
        w.ptr = 0;
        wasm.mat4_set_w_axis(this.ptr, ptr0);
    }
    /**
    * @returns {Vec4}
    */
    x_axis() {
        const ret = wasm.mat4_x_axis(this.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {Vec4}
    */
    y_axis() {
        const ret = wasm.mat4_y_axis(this.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {Vec4}
    */
    z_axis() {
        const ret = wasm.mat4_z_axis(this.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {Vec4}
    */
    w_axis() {
        const ret = wasm.mat4_w_axis(this.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {Mat4}
    */
    transpose() {
        const ret = wasm.mat4_transpose(this.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    determinant() {
        const ret = wasm.mat4_determinant(this.ptr);
        return ret;
    }
    /**
    * @returns {Mat4}
    */
    inverse() {
        const ret = wasm.mat4_inverse(this.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec3} eye
    * @param {Vec3} center
    * @param {Vec3} up
    * @returns {Mat4}
    */
    static look_at_lh(eye, center, up) {
        _assertClass(eye, Vec3);
        const ptr0 = eye.ptr;
        eye.ptr = 0;
        _assertClass(center, Vec3);
        const ptr1 = center.ptr;
        center.ptr = 0;
        _assertClass(up, Vec3);
        const ptr2 = up.ptr;
        up.ptr = 0;
        const ret = wasm.mat4_look_at_lh(ptr0, ptr1, ptr2);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec3} eye
    * @param {Vec3} center
    * @param {Vec3} up
    * @returns {Mat4}
    */
    static look_at_rh(eye, center, up) {
        _assertClass(eye, Vec3);
        const ptr0 = eye.ptr;
        eye.ptr = 0;
        _assertClass(center, Vec3);
        const ptr1 = center.ptr;
        center.ptr = 0;
        _assertClass(up, Vec3);
        const ptr2 = up.ptr;
        up.ptr = 0;
        const ret = wasm.mat4_look_at_rh(ptr0, ptr1, ptr2);
        return Mat4.__wrap(ret);
    }
    /**
    * Builds a right-handed perspective projection matrix with [-1,1] depth range.
    * This is the equivalent of the common perspective function `gluPerspective` in OpenGL.
    * See https://www.khronos.org/opengl/wiki/GluPerspective_code
    * @param {number} fov_y_radians
    * @param {number} aspect_ratio
    * @param {number} z_near
    * @param {number} z_far
    * @returns {Mat4}
    */
    static perspective_glu_rh(fov_y_radians, aspect_ratio, z_near, z_far) {
        const ret = wasm.mat4_perspective_glu_rh(fov_y_radians, aspect_ratio, z_near, z_far);
        return Mat4.__wrap(ret);
    }
    /**
    * Build infinite right-handed perspective projection matrix with [0,1] depth range.
    * @param {number} fov_y_radians
    * @param {number} aspect_ratio
    * @param {number} z_near
    * @returns {Mat4}
    */
    static perspective_infinite_rh(fov_y_radians, aspect_ratio, z_near) {
        const ret = wasm.mat4_perspective_infinite_rh(fov_y_radians, aspect_ratio, z_near);
        return Mat4.__wrap(ret);
    }
    /**
    * Build infinite reverse right-handed perspective projection matrix with [0,1] depth range.
    * @param {number} fov_y_radians
    * @param {number} aspect_ratio
    * @param {number} z_near
    * @returns {Mat4}
    */
    static perspective_infinite_reverse_rh(fov_y_radians, aspect_ratio, z_near) {
        const ret = wasm.mat4_perspective_infinite_reverse_rh(fov_y_radians, aspect_ratio, z_near);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec4} other
    * @returns {Vec4}
    */
    mul_vec4(other) {
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat4_mul_vec4(this.ptr, ptr0);
        return Vec4.__wrap(ret);
    }
    /**
    * Multiplies two 4x4 matrices.
    * @param {Mat4} other
    * @returns {Mat4}
    */
    mul_mat4(other) {
        _assertClass(other, Mat4);
        const ret = wasm.mat4_mul_mat4(this.ptr, other.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Mat4} other
    * @returns {Mat4}
    */
    add_mat4(other) {
        _assertClass(other, Mat4);
        const ret = wasm.mat4_add_mat4(this.ptr, other.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Mat4} other
    * @returns {Mat4}
    */
    sub_mat4(other) {
        _assertClass(other, Mat4);
        const ret = wasm.mat4_sub_mat4(this.ptr, other.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat4}
    */
    mul_scalar(other) {
        const ret = wasm.mat4_mul_scalar(this.ptr, other);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    transform_point3(other) {
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat4_transform_point3(this.ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    transform_vector3(other) {
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat4_transform_vector3(this.ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Mat4`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Mat4} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        _assertClass(other, Mat4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.mat4_abs_diff_eq(this.ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * @returns {Float32Array}
    */
    to_flat_vec() {
        const retptr = 8;
        const ret = wasm.mat4_to_flat_vec(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getArrayF32FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 4);
        return v0;
    }
    /**
    * @param {Mat4} other
    * @returns {Mat4}
    */
    add(other) {
        _assertClass(other, Mat4);
        const ret = wasm.mat4_add(this.ptr, other.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Mat4} other
    * @returns {Mat4}
    */
    sub(other) {
        _assertClass(other, Mat4);
        const ret = wasm.mat4_sub(this.ptr, other.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Mat4}
    */
    mul(other) {
        const ret = wasm.mat4_mul(this.ptr, other);
        return Mat4.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.mat4_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
    /**
    * @param {Vec4} x_axis
    * @param {Vec4} y_axis
    * @param {Vec4} z_axis
    * @param {Vec4} w_axis
    * @returns {Mat4}
    */
    constructor(x_axis, y_axis, z_axis, w_axis) {
        _assertClass(x_axis, Vec4);
        const ptr0 = x_axis.ptr;
        x_axis.ptr = 0;
        _assertClass(y_axis, Vec4);
        const ptr1 = y_axis.ptr;
        y_axis.ptr = 0;
        _assertClass(z_axis, Vec4);
        const ptr2 = z_axis.ptr;
        z_axis.ptr = 0;
        _assertClass(w_axis, Vec4);
        const ptr3 = w_axis.ptr;
        w_axis.ptr = 0;
        const ret = wasm.mat4_new(ptr0, ptr1, ptr2, ptr3);
        return Mat4.__wrap(ret);
    }
}
/**
*/
export class Material {

    static __wrap(ptr) {
        const obj = Object.create(Material.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_material_free(ptr);
    }
    /**
    * @returns {number}
    */
    get shader_id() {
        const ret = wasm.__wbg_get_material_shader_id(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set shader_id(arg0) {
        wasm.__wbg_set_material_shader_id(this.ptr, arg0);
    }
    /**
    * @returns {Vec4}
    */
    get color() {
        const ret = wasm.__wbg_get_material_color(this.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @param {Vec4} arg0
    */
    set color(arg0) {
        _assertClass(arg0, Vec4);
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_material_color(this.ptr, ptr0);
    }
    /**
    * @returns {number}
    */
    get texture_id() {
        const retptr = 8;
        const ret = wasm.__wbg_get_material_texture_id(retptr, this.ptr);
        const memi32 = getInt32Memory();
        return memi32[retptr / 4 + 0] === 0 ? undefined : memi32[retptr / 4 + 1] >>> 0;
    }
    /**
    * @param {number | undefined} arg0
    */
    set texture_id(arg0) {
        wasm.__wbg_set_material_texture_id(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @param {number} shader_id
    * @param {Vec4} color
    * @param {number | undefined} texture_id
    * @returns {Material}
    */
    constructor(shader_id, color, texture_id) {
        _assertClass(color, Vec4);
        const ptr0 = color.ptr;
        color.ptr = 0;
        const ret = wasm.material_new(shader_id, ptr0, !isLikeNone(texture_id), isLikeNone(texture_id) ? 0 : texture_id);
        return Material.__wrap(ret);
    }
}
/**
* A quaternion representing an orientation.
*
* This quaternion is intended to be of unit length but may denormalize due to
* floating point \"error creep\" which can occur when successive quaternion
* operations are applied.
*
* This type is 16 byte aligned.
*/
export class Quat {

    static __wrap(ptr) {
        const obj = Object.create(Quat.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_quat_free(ptr);
    }
    /**
    * Creates a new rotation quaternion.
    *
    * This should generally not be called manually unless you know what you are doing. Use one of
    * the other constructors instead such as `identity` or `from_axis_angle`.
    *
    * `new` is mostly used by unit tests and `serde` deserialization.
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    * @returns {Quat}
    */
    constructor(x, y, z, w) {
        const ret = wasm.quat_new(x, y, z, w);
        return Quat.__wrap(ret);
    }
    /**
    * @returns {Quat}
    */
    static identity() {
        const ret = wasm.quat_identity();
        return Quat.__wrap(ret);
    }
    /**
    * Creates a new rotation quaternion from an unaligned `&[f32]`.
    *
    * # Preconditions
    *
    * The resulting quaternion is expected to be of unit length.
    *
    * # Panics
    *
    * Panics if `slice` length is less than 4.
    * @param {Float32Array} slice
    * @returns {Quat}
    */
    static from_slice_unaligned(slice) {
        const ret = wasm.quat_from_slice_unaligned(passArrayF32ToWasm(slice), WASM_VECTOR_LEN);
        return Quat.__wrap(ret);
    }
    /**
    * Writes the quaternion to an unaligned `&mut [f32]`.
    *
    * # Panics
    *
    * Panics if `slice` length is less than 4.
    * @param {Float32Array} slice
    */
    write_to_slice_unaligned(slice) {
        const ptr = this.ptr;
        this.ptr = 0;
        const ptr0 = passArrayF32ToWasm(slice);
        const len0 = WASM_VECTOR_LEN;
        try {
            wasm.quat_write_to_slice_unaligned(ptr, ptr0, len0);
        } finally {
            slice.set(getFloat32Memory().subarray(ptr0 / 4, ptr0 / 4 + len0));
            wasm.__wbindgen_free(ptr0, len0 * 4);
        }
    }
    /**
    * Create a new quaterion for a normalized rotation axis and angle
    * (in radians).
    * @param {Vec3} axis
    * @param {number} angle
    * @returns {Quat}
    */
    static from_axis_angle(axis, angle) {
        _assertClass(axis, Vec3);
        const ptr0 = axis.ptr;
        axis.ptr = 0;
        const ret = wasm.quat_from_axis_angle(ptr0, angle);
        return Quat.__wrap(ret);
    }
    /**
    * Creates a new quaternion from the angle (in radians) around the x axis.
    * @param {number} angle
    * @returns {Quat}
    */
    static from_rotation_x(angle) {
        const ret = wasm.quat_from_rotation_x(angle);
        return Quat.__wrap(ret);
    }
    /**
    * Creates a new quaternion from the angle (in radians) around the y axis.
    * @param {number} angle
    * @returns {Quat}
    */
    static from_rotation_y(angle) {
        const ret = wasm.quat_from_rotation_y(angle);
        return Quat.__wrap(ret);
    }
    /**
    * Creates a new quaternion from the angle (in radians) around the z axis.
    * @param {number} angle
    * @returns {Quat}
    */
    static from_rotation_z(angle) {
        const ret = wasm.quat_from_rotation_z(angle);
        return Quat.__wrap(ret);
    }
    /**
    * Create a quaternion from the given yaw (around y), pitch (around x) and roll (around z)
    * in radians.
    * @param {number} yaw
    * @param {number} pitch
    * @param {number} roll
    * @returns {Quat}
    */
    static from_rotation_ypr(yaw, pitch, roll) {
        const ret = wasm.quat_from_rotation_ypr(yaw, pitch, roll);
        return Quat.__wrap(ret);
    }
    /**
    * @param {Mat3} mat
    * @returns {Quat}
    */
    static from_rotation_mat3(mat) {
        _assertClass(mat, Mat3);
        const ret = wasm.quat_from_rotation_mat3(mat.ptr);
        return Quat.__wrap(ret);
    }
    /**
    * @returns {Quat}
    */
    conjugate() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_conjugate(ptr);
        return Quat.__wrap(ret);
    }
    /**
    * @param {Quat} other
    * @returns {number}
    */
    dot(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Quat);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.quat_dot(ptr, ptr0);
        return ret;
    }
    /**
    * @returns {number}
    */
    length() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_length(ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    length_squared() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_length_squared(ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    length_reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_length_reciprocal(ptr);
        return ret;
    }
    /**
    * @returns {Quat}
    */
    normalize() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_normalize(ptr);
        return Quat.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    is_normalized() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_is_normalized(ptr);
        return ret !== 0;
    }
    /**
    * @returns {boolean}
    */
    is_near_identity() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.quat_is_near_identity(ptr);
        return ret !== 0;
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Quat`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Quat} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Quat);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.quat_abs_diff_eq(ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * @param {Quat} end
    * @param {number} t
    * @returns {Quat}
    */
    lerp(end, t) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(end, Quat);
        const ptr0 = end.ptr;
        end.ptr = 0;
        const ret = wasm.quat_lerp(ptr, ptr0, t);
        return Quat.__wrap(ret);
    }
    /**
    * Multiplies a quaternion and a 3D vector, rotating it.
    * @param {Vec3} other
    * @returns {Vec3}
    */
    mul_vec3(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.quat_mul_vec3(ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * Multiplies two quaternions.
    * Note that due to floating point rounding the result may not be perfectly normalized.
    * @param {Quat} other
    * @returns {Quat}
    */
    mul_quat(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Quat);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.quat_mul_quat(ptr, ptr0);
        return Quat.__wrap(ret);
    }
    /**
    * @param {Mat4} mat
    * @returns {Quat}
    */
    static from_rotation_mat4(mat) {
        _assertClass(mat, Mat4);
        const ret = wasm.quat_from_rotation_mat4(mat.ptr);
        return Quat.__wrap(ret);
    }
}
/**
*/
export class Transform {

    static __wrap(ptr) {
        const obj = Object.create(Transform.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_transform_free(ptr);
    }
    /**
    * @param {Vec3} position
    * @param {Quat} rotation
    * @param {Vec3} scale
    * @returns {Transform}
    */
    constructor(position, rotation, scale) {
        _assertClass(position, Vec3);
        const ptr0 = position.ptr;
        position.ptr = 0;
        _assertClass(rotation, Quat);
        const ptr1 = rotation.ptr;
        rotation.ptr = 0;
        _assertClass(scale, Vec3);
        const ptr2 = scale.ptr;
        scale.ptr = 0;
        const ret = wasm.transform_new(ptr0, ptr1, ptr2);
        return Transform.__wrap(ret);
    }
    /**
    * @returns {Transform}
    */
    static identity() {
        const ret = wasm.transform_identity();
        return Transform.__wrap(ret);
    }
    /**
    * @param {Vec3} position
    * @returns {Transform}
    */
    static translation(position) {
        _assertClass(position, Vec3);
        const ptr0 = position.ptr;
        position.ptr = 0;
        const ret = wasm.transform_translation(ptr0);
        return Transform.__wrap(ret);
    }
    /**
    * @param {Transform} other
    * @param {number} t
    * @returns {Transform}
    */
    lerp(other, t) {
        _assertClass(other, Transform);
        const ret = wasm.transform_lerp(this.ptr, other.ptr, t);
        return Transform.__wrap(ret);
    }
    /**
    * @returns {Mat4}
    */
    get matrix() {
        const ret = wasm.transform_matrix(this.ptr);
        return Mat4.__wrap(ret);
    }
    /**
    * @param {Mat4} new_matrix
    */
    set matrix(new_matrix) {
        _assertClass(new_matrix, Mat4);
        const ptr0 = new_matrix.ptr;
        new_matrix.ptr = 0;
        wasm.transform_set_matrix(this.ptr, ptr0);
    }
    /**
    * @returns {Vec3}
    */
    get position() {
        const ret = wasm.transform_position(this.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} new_position
    */
    set position(new_position) {
        _assertClass(new_position, Vec3);
        const ptr0 = new_position.ptr;
        new_position.ptr = 0;
        wasm.transform_set_position(this.ptr, ptr0);
    }
    /**
    * @returns {Vec3}
    */
    get scale() {
        const ret = wasm.transform_scale(this.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} new_scale
    */
    set scale(new_scale) {
        _assertClass(new_scale, Vec3);
        const ptr0 = new_scale.ptr;
        new_scale.ptr = 0;
        wasm.transform_set_scale(this.ptr, ptr0);
    }
    /**
    * @returns {Quat}
    */
    get rotation() {
        const ret = wasm.transform_rotation(this.ptr);
        return Quat.__wrap(ret);
    }
    /**
    * @param {Quat} new_rotation
    */
    set rotation(new_rotation) {
        _assertClass(new_rotation, Quat);
        const ptr0 = new_rotation.ptr;
        new_rotation.ptr = 0;
        wasm.transform_set_rotation(this.ptr, ptr0);
    }
}
/**
* A 2-dimensional vector.
*/
export class Vec2 {

    static __wrap(ptr) {
        const obj = Object.create(Vec2.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec2_free(ptr);
    }
    /**
    * Returns a new `Vec4` with elements representing the sign of `self`.
    *
    * - `1.0` if the number is positive, `+0.0` or `INFINITY`
    * - `-1.0` if the number is negative, `-0.0` or `NEG_INFINITY`
    * @returns {Vec2}
    */
    sign() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_sign(ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * Computes the reciprocal `1.0/n` of each element, returning the
    * results in a new `Vec2`.
    * @returns {Vec2}
    */
    reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_reciprocal(ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * Performs a linear interpolation between `self` and `other` based on
    * the value `s`.
    *
    * When `s` is `0.0`, the result will be equal to `self`.  When `s`
    * is `1.0`, the result will be equal to `other`.
    * @param {Vec2} other
    * @param {number} s
    * @returns {Vec2}
    */
    lerp(other, s) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_lerp(ptr, ptr0, s);
        return Vec2.__wrap(ret);
    }
    /**
    * Returns whether `self` is length `1.0` or not.
    *
    * Uses a precision threshold of `std::f32::EPSILON`.
    * @returns {boolean}
    */
    is_normalized() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_is_normalized(ptr);
        return ret !== 0;
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Vec2`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Vec2} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_abs_diff_eq(ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * Creates a new `Vec2` with all elements set to `0.0`.
    * @returns {Vec2}
    */
    static zero() {
        const ret = wasm.vec2_zero();
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new `Vec2` with all elements set to `1.0`.
    * @returns {Vec2}
    */
    static one() {
        const ret = wasm.vec2_one();
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new `Vec2` with values `[x: 1.0, y: 0.0]`.
    * @returns {Vec2}
    */
    static unit_x() {
        const ret = wasm.vec2_unit_x();
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new `Vec2` with values `[x: 0.0, y: 1.0]`.
    * @returns {Vec2}
    */
    static unit_y() {
        const ret = wasm.vec2_unit_y();
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new `Vec2` with all elements set to `v`.
    * @param {number} v
    * @returns {Vec2}
    */
    static splat(v) {
        const ret = wasm.vec2_splat(v);
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new `Vec3` from `self` and the given `z` value.
    * @param {number} z
    * @returns {Vec3}
    */
    extend(z) {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_extend(ptr, z);
        return Vec3.__wrap(ret);
    }
    /**
    * Returns element `x`.
    * @returns {number}
    */
    x() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_x(ptr);
        return ret;
    }
    /**
    * Returns element `y`.
    * @returns {number}
    */
    y() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_y(ptr);
        return ret;
    }
    /**
    * Sets element `x`.
    * @param {number} x
    */
    set_x(x) {
        wasm.vec2_set_x(this.ptr, x);
    }
    /**
    * Sets element `y`.
    * @param {number} y
    */
    set_y(y) {
        wasm.vec2_set_y(this.ptr, y);
    }
    /**
    * Computes the dot product of `self` and `other`.
    * @param {Vec2} other
    * @returns {number}
    */
    dot(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_dot(ptr, ptr0);
        return ret;
    }
    /**
    * Computes the length of `self`.
    * @returns {number}
    */
    length() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_length(ptr);
        return ret;
    }
    /**
    * Computes the squared length of `self`.
    *
    * This is generally faster than `Vec2::length()` as it avoids a square
    * root operation.
    * @returns {number}
    */
    length_squared() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_length_squared(ptr);
        return ret;
    }
    /**
    * Computes `1.0 / Vec2::length()`.
    *
    * For valid results, `self` must _not_ be of length zero.
    * @returns {number}
    */
    length_reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_length_reciprocal(ptr);
        return ret;
    }
    /**
    * Returns `self` normalized to length 1.0.
    *
    * For valid results, `self` must _not_ be of length zero.
    * @returns {Vec2}
    */
    normalize() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_normalize(ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * Returns the vertical minimum of `self` and `other`.
    *
    * In other words, this computes
    * `[x: min(x1, x2), y: min(y1, y2)]`,
    * taking the minimum of each element individually.
    * @param {Vec2} other
    * @returns {Vec2}
    */
    min(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_min(ptr, ptr0);
        return Vec2.__wrap(ret);
    }
    /**
    * Returns the vertical maximum of `self` and `other`.
    *
    * In other words, this computes
    * `[x: max(x1, x2), y: max(y1, y2)]`,
    * taking the maximum of each element individually.
    * @param {Vec2} other
    * @returns {Vec2}
    */
    max(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_max(ptr, ptr0);
        return Vec2.__wrap(ret);
    }
    /**
    * Returns the horizontal minimum of `self`\'s elements.
    *
    * In other words, this computes `min(x, y)`.
    * @returns {number}
    */
    min_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_min_element(ptr);
        return ret;
    }
    /**
    * Returns the horizontal maximum of `self`\'s elements.
    *
    * In other words, this computes `max(x, y)`.
    * @returns {number}
    */
    max_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_max_element(ptr);
        return ret;
    }
    /**
    * Performs a vertical `==` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 == x2, y1 == y2, z1 == z2, w1 == w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmpeq(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmpeq(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `!=` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 != x2, y1 != y2, z1 != z2, w1 != w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmpne(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmpne(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `>=` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 >= x2, y1 >= y2, z1 >= z2, w1 >= w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmpge(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmpge(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `>` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 > x2, y1 > y2, z1 > z2, w1 > w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmpgt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmpgt(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `<=` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 <= x2, y1 <= y2, z1 <= z2, w1 <= w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmple(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmple(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `<` comparison between `self` and `other`,
    * returning a `Vec2Mask` of the results.
    *
    * In other words, this computes `[x1 < x2, y1 < y2, z1 < z2, w1 < w2]`.
    * @param {Vec2} other
    * @returns {Vec2Mask}
    */
    cmplt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec2);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec2_cmplt(ptr, ptr0);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Creates a new `Vec2` from the first two values in `slice`.
    *
    * # Panics
    *
    * Panics if `slice` is less than two elements long.
    * @param {Float32Array} slice
    * @returns {Vec2}
    */
    static from_slice_unaligned(slice) {
        const ret = wasm.vec2_from_slice_unaligned(passArrayF32ToWasm(slice), WASM_VECTOR_LEN);
        return Vec2.__wrap(ret);
    }
    /**
    * Writes the elements of `self` to the first two elements in `slice`.
    *
    * # Panics
    *
    * Panics if `slice` is less than two elements long.
    * @param {Float32Array} slice
    */
    write_to_slice_unaligned(slice) {
        const ptr = this.ptr;
        this.ptr = 0;
        const ptr0 = passArrayF32ToWasm(slice);
        const len0 = WASM_VECTOR_LEN;
        try {
            wasm.vec2_write_to_slice_unaligned(ptr, ptr0, len0);
        } finally {
            slice.set(getFloat32Memory().subarray(ptr0 / 4, ptr0 / 4 + len0));
            wasm.__wbindgen_free(ptr0, len0 * 4);
        }
    }
    /**
    * Returns a new `Vec2` containing the absolute value of each element of the original
    * `Vec2`.
    * @returns {Vec2}
    */
    abs() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2_abs(ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    add(other) {
        _assertClass(other, Vec2);
        const ret = wasm.vec2_add(this.ptr, other.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    sub(other) {
        _assertClass(other, Vec2);
        const ret = wasm.vec2_sub(this.ptr, other.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Vec2}
    */
    mul(other) {
        const ret = wasm.vec2_mul(this.ptr, other);
        return Vec2.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.vec2_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
    /**
    * Creates a new `Vec2`.
    * @param {number} x
    * @param {number} y
    * @returns {Vec2}
    */
    constructor(x, y) {
        const ret = wasm.vec2_new(x, y);
        return Vec2.__wrap(ret);
    }
}
/**
* A 2-dimensional vector mask.
*
* This type is typically created by comparison methods on `Vec2`.
*/
export class Vec2Mask {

    static __wrap(ptr) {
        const obj = Object.create(Vec2Mask.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec2mask_free(ptr);
    }
    /**
    * Creates a new `Vec2Mask`.
    * @param {boolean} x
    * @param {boolean} y
    * @returns {Vec2Mask}
    */
    static new(x, y) {
        const ret = wasm.vec2mask_new(x, y);
        return Vec2Mask.__wrap(ret);
    }
    /**
    * Returns a bitmask with the lowest two bits set from the elements of
    * the `Vec2Mask`.
    *
    * A true element results in a `1` bit and a false element in a `0` bit.
    * Element `x` goes into the first lowest bit, element `y` into the
    * second, etc.
    * @returns {number}
    */
    bitmask() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2mask_bitmask(ptr);
        return ret >>> 0;
    }
    /**
    * Returns true if any of the elements are true, false otherwise.
    *
    * In other words: `x || y`.
    * @returns {boolean}
    */
    any() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2mask_any(ptr);
        return ret !== 0;
    }
    /**
    * Returns true if all the elements are true, false otherwise.
    *
    * In other words: `x && y`.
    * @returns {boolean}
    */
    all() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec2mask_all(ptr);
        return ret !== 0;
    }
    /**
    * Creates a new `Vec2` from the elements in `if_true` and `if_false`,
    * selecting which to use for each element based on the `Vec2Mask`.
    *
    * A true element in the mask uses the corresponding element from
    * `if_true`, and false uses the element from `if_false`.
    * @param {Vec2} if_true
    * @param {Vec2} if_false
    * @returns {Vec2}
    */
    select(if_true, if_false) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(if_true, Vec2);
        const ptr0 = if_true.ptr;
        if_true.ptr = 0;
        _assertClass(if_false, Vec2);
        const ptr1 = if_false.ptr;
        if_false.ptr = 0;
        const ret = wasm.vec2mask_select(ptr, ptr0, ptr1);
        return Vec2.__wrap(ret);
    }
}
/**
*/
export class Vec3 {

    static __wrap(ptr) {
        const obj = Object.create(Vec3.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec3_free(ptr);
    }
    /**
    * Returns a new `Vec4` with elements representing the sign of `self`.
    *
    * - `1.0` if the number is positive, `+0.0` or `INFINITY`
    * - `-1.0` if the number is negative, `-0.0` or `NEG_INFINITY`
    * @returns {Vec3}
    */
    sign() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_sign(ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * Computes the reciprocal `1.0/n` of each element, returning the
    * results in a new `Vec3`.
    * @returns {Vec3}
    */
    reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_reciprocal(ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * Performs a linear interpolation between `self` and `other` based on
    * the value `s`.
    *
    * When `s` is `0.0`, the result will be equal to `self`.  When `s`
    * is `1.0`, the result will be equal to `other`.
    * @param {Vec3} other
    * @param {number} s
    * @returns {Vec3}
    */
    lerp(other, s) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_lerp(ptr, ptr0, s);
        return Vec3.__wrap(ret);
    }
    /**
    * Returns whether `self` of length `1.0` or not.
    *
    * Uses a precision threshold of `std::f32::EPSILON`.
    * @returns {boolean}
    */
    is_normalized() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_is_normalized(ptr);
        return ret !== 0;
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Vec3`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Vec3} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_abs_diff_eq(ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
    /**
    * @returns {Vec3}
    */
    static zero() {
        const ret = wasm.vec3_zero();
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    static one() {
        const ret = wasm.vec3_one();
        return Vec3.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Vec3}
    */
    constructor(x, y, z) {
        const ret = wasm.vec3_new(x, y, z);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    static unit_x() {
        const ret = wasm.vec3_unit_x();
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    static unit_y() {
        const ret = wasm.vec3_unit_y();
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    static unit_z() {
        const ret = wasm.vec3_unit_z();
        return Vec3.__wrap(ret);
    }
    /**
    * @param {number} v
    * @returns {Vec3}
    */
    static splat(v) {
        const ret = wasm.vec3_splat(v);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {number} w
    * @returns {Vec4}
    */
    extend(w) {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_extend(ptr, w);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {Vec2}
    */
    truncate() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_truncate(ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    x() {
        const ret = wasm.vec3_x(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    y() {
        const ret = wasm.vec3_y(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    z() {
        const ret = wasm.vec3_z(this.ptr);
        return ret;
    }
    /**
    * @param {number} x
    */
    set_x(x) {
        wasm.vec3_set_x(this.ptr, x);
    }
    /**
    * @param {number} y
    */
    set_y(y) {
        wasm.vec3_set_y(this.ptr, y);
    }
    /**
    * @param {number} z
    */
    set_z(z) {
        wasm.vec3_set_z(this.ptr, z);
    }
    /**
    * @param {Vec3} other
    * @returns {number}
    */
    dot(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_dot(ptr, ptr0);
        return ret;
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    cross(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cross(ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    length() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_length(ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    length_squared() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_length_squared(ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    length_reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_length_reciprocal(ptr);
        return ret;
    }
    /**
    * @returns {Vec3}
    */
    normalize() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_normalize(ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    min(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_min(ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    max(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_max(ptr, ptr0);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    min_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_min_element(ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    max_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_max_element(ptr);
        return ret;
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmpeq(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmpeq(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmpne(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmpne(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmpge(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmpge(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmpgt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmpgt(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmple(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmple(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3Mask}
    */
    cmplt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec3);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec3_cmplt(ptr, ptr0);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @returns {Vec3}
    */
    abs() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec3_abs(ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    add(other) {
        _assertClass(other, Vec3);
        const ret = wasm.vec3_add(this.ptr, other.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {Vec3} other
    * @returns {Vec3}
    */
    sub(other) {
        _assertClass(other, Vec3);
        const ret = wasm.vec3_sub(this.ptr, other.ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Vec3}
    */
    mul(other) {
        const ret = wasm.vec3_mul(this.ptr, other);
        return Vec3.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.vec3_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
}
/**
*/
export class Vec3Mask {

    static __wrap(ptr) {
        const obj = Object.create(Vec3Mask.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec3mask_free(ptr);
    }
    /**
    * @param {boolean} x
    * @param {boolean} y
    * @param {boolean} z
    * @returns {Vec3Mask}
    */
    static new(x, y, z) {
        const ret = wasm.vec3mask_new(x, y, z);
        return Vec3Mask.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    bitmask() {
        const ret = wasm.vec3mask_bitmask(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {boolean}
    */
    any() {
        const ret = wasm.vec3mask_any(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {boolean}
    */
    all() {
        const ret = wasm.vec3mask_all(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {Vec3} if_true
    * @param {Vec3} if_false
    * @returns {Vec3}
    */
    select(if_true, if_false) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(if_true, Vec3);
        const ptr0 = if_true.ptr;
        if_true.ptr = 0;
        _assertClass(if_false, Vec3);
        const ptr1 = if_false.ptr;
        if_false.ptr = 0;
        const ret = wasm.vec3mask_select(ptr, ptr0, ptr1);
        return Vec3.__wrap(ret);
    }
}
/**
*/
export class Vec4 {

    static __wrap(ptr) {
        const obj = Object.create(Vec4.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec4_free(ptr);
    }
    /**
    * Creates a new `Vec4` with all elements set to `0.0`.
    * @returns {Vec4}
    */
    static zero() {
        const ret = wasm.vec4_zero();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with all elements set to `1.0`.
    * @returns {Vec4}
    */
    static one() {
        const ret = wasm.vec4_one();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4`.
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} w
    * @returns {Vec4}
    */
    constructor(x, y, z, w) {
        const ret = wasm.vec4_new(x, y, z, w);
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with values `[x: 1.0, y: 0.0, z: 0.0, w: 0.0]`.
    * @returns {Vec4}
    */
    static unit_x() {
        const ret = wasm.vec4_unit_x();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with values `[x: 0.0, y: 1.0, z: 0.0, w: 0.0]`.
    * @returns {Vec4}
    */
    static unit_y() {
        const ret = wasm.vec4_unit_y();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with values `[x: 0.0, y: 0.0, z: 1.0, w: 0.0]`.
    * @returns {Vec4}
    */
    static unit_z() {
        const ret = wasm.vec4_unit_z();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with values `[x: 0.0, y: 0.0, z: 0.0, w: 1.0]`.
    * @returns {Vec4}
    */
    static unit_w() {
        const ret = wasm.vec4_unit_w();
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` with all elements set to `v`.
    * @param {number} v
    * @returns {Vec4}
    */
    static splat(v) {
        const ret = wasm.vec4_splat(v);
        return Vec4.__wrap(ret);
    }
    /**
    * Creates a `Vec3` from the first three elements of `self`,
    * removing `w`.
    * @returns {Vec3}
    */
    truncate() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_truncate(ptr);
        return Vec3.__wrap(ret);
    }
    /**
    * Returns element `x`.
    * @returns {number}
    */
    x() {
        const ret = wasm.vec4_x(this.ptr);
        return ret;
    }
    /**
    * Returns element `y`.
    * @returns {number}
    */
    y() {
        const ret = wasm.vec4_y(this.ptr);
        return ret;
    }
    /**
    * Returns element `z`.
    * @returns {number}
    */
    z() {
        const ret = wasm.vec4_z(this.ptr);
        return ret;
    }
    /**
    * Returns element `w`.
    * @returns {number}
    */
    w() {
        const ret = wasm.vec4_w(this.ptr);
        return ret;
    }
    /**
    * Sets element `x`.
    * @param {number} x
    */
    set_x(x) {
        wasm.vec4_set_x(this.ptr, x);
    }
    /**
    * Sets element `y`.
    * @param {number} y
    */
    set_y(y) {
        wasm.vec4_set_y(this.ptr, y);
    }
    /**
    * Sets element `z`.
    * @param {number} z
    */
    set_z(z) {
        wasm.vec4_set_z(this.ptr, z);
    }
    /**
    * Sets element `w`.
    * @param {number} w
    */
    set_w(w) {
        wasm.vec4_set_w(this.ptr, w);
    }
    /**
    * Computes the 4D dot product of `self` and `other`.
    * @param {Vec4} other
    * @returns {number}
    */
    dot(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_dot(ptr, ptr0);
        return ret;
    }
    /**
    * Computes the 4D length of `self`.
    * @returns {number}
    */
    length() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_length(ptr);
        return ret;
    }
    /**
    * Computes the squared 4D length of `self`.
    *
    * This is generally faster than `Vec4::length()` as it avoids a square
    * root operation.
    * @returns {number}
    */
    length_squared() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_length_squared(ptr);
        return ret;
    }
    /**
    * Computes `1.0 / Vec4::length()`.
    *
    * For valid results, `self` must _not_ be of length zero.
    * @returns {number}
    */
    length_reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_length_reciprocal(ptr);
        return ret;
    }
    /**
    * Returns `self` normalized to length 1.0.
    *
    * For valid results, `self` must _not_ be of length zero.
    * @returns {Vec4}
    */
    normalize() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_normalize(ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * Returns the vertical minimum of `self` and `other`.
    *
    * In other words, this computes
    * `[x: min(x1, x2), y: min(y1, y2), z: min(z1, z2), w: min(w1, w2)]`,
    * taking the minimum of each element individually.
    * @param {Vec4} other
    * @returns {Vec4}
    */
    min(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_min(ptr, ptr0);
        return Vec4.__wrap(ret);
    }
    /**
    * Returns the vertical maximum of `self` and `other`.
    *
    * In other words, this computes
    * `[x: max(x1, x2), y: max(y1, y2), z: max(z1, z2), w: max(w1, w2)]`,
    * taking the maximum of each element individually.
    * @param {Vec4} other
    * @returns {Vec4}
    */
    max(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_max(ptr, ptr0);
        return Vec4.__wrap(ret);
    }
    /**
    * Returns the minimum of all four elements in `self`.
    *
    * In other words, this computes `min(x, y, z, w)`.
    * @returns {number}
    */
    min_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_min_element(ptr);
        return ret;
    }
    /**
    * Returns the maximum of all four elements in `self`.
    *
    * In other words, this computes `max(x, y, z, w)`.
    * @returns {number}
    */
    max_element() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_max_element(ptr);
        return ret;
    }
    /**
    * Performs a vertical `==` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 == x2, y1 == y2, z1 == z2, w1 == w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmpeq(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmpeq(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `!=` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 != x2, y1 != y2, z1 != z2, w1 != w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmpne(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmpne(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `>=` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 >= x2, y1 >= y2, z1 >= z2, w1 >= w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmpge(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmpge(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `>` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 > x2, y1 > y2, z1 > z2, w1 > w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmpgt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmpgt(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `<=` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 <= x2, y1 <= y2, z1 <= z2, w1 <= w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmple(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmple(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Performs a vertical `<` comparison between `self` and `other`,
    * returning a `Vec4Mask` of the results.
    *
    * In other words, this computes `[x1 < x2, y1 < y2, z1 < z2, w1 < w2]`.
    * @param {Vec4} other
    * @returns {Vec4Mask}
    */
    cmplt(other) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_cmplt(ptr, ptr0);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Creates a new `Vec4` from the first four values in `slice`.
    *
    * # Panics
    *
    * Panics if `slice` is less than four elements long.
    * @param {Float32Array} slice
    * @returns {Vec4}
    */
    static from_slice_unaligned(slice) {
        const ret = wasm.vec4_from_slice_unaligned(passArrayF32ToWasm(slice), WASM_VECTOR_LEN);
        return Vec4.__wrap(ret);
    }
    /**
    * Writes the elements of `self` to the first four elements in `slice`.
    *
    * # Panics
    *
    * Panics if `slice` is less than four elements long.
    * @param {Float32Array} slice
    */
    write_to_slice_unaligned(slice) {
        const ptr = this.ptr;
        this.ptr = 0;
        const ptr0 = passArrayF32ToWasm(slice);
        const len0 = WASM_VECTOR_LEN;
        try {
            wasm.vec4_write_to_slice_unaligned(ptr, ptr0, len0);
        } finally {
            slice.set(getFloat32Memory().subarray(ptr0 / 4, ptr0 / 4 + len0));
            wasm.__wbindgen_free(ptr0, len0 * 4);
        }
    }
    /**
    * @returns {Vec4}
    */
    abs() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_abs(ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @param {Vec4} other
    * @returns {Vec4}
    */
    add(other) {
        _assertClass(other, Vec4);
        const ret = wasm.vec4_add(this.ptr, other.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @param {Vec4} other
    * @returns {Vec4}
    */
    sub(other) {
        _assertClass(other, Vec4);
        const ret = wasm.vec4_sub(this.ptr, other.ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Vec4}
    */
    mul(other) {
        const ret = wasm.vec4_mul(this.ptr, other);
        return Vec4.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        const retptr = 8;
        const ret = wasm.vec4_to_string(retptr, this.ptr);
        const memi32 = getInt32Memory();
        const v0 = getStringFromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    }
    /**
    * Returns a new `Vec4` with elements representing the sign of `self`.
    *
    * - `1.0` if the number is positive, `+0.0` or `INFINITY`
    * - `-1.0` if the number is negative, `-0.0` or `NEG_INFINITY`
    * @returns {Vec4}
    */
    sign() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_sign(ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * Computes the reciprocal `1.0/n` of each element, returning the
    * results in a new `Vec4`.
    * @returns {Vec4}
    */
    reciprocal() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_reciprocal(ptr);
        return Vec4.__wrap(ret);
    }
    /**
    * Performs a linear interpolation between `self` and `other` based on
    * the value `s`.
    *
    * When `s` is `0.0`, the result will be equal to `self`.  When `s`
    * is `1.0`, the result will be equal to `other`.
    * @param {Vec4} other
    * @param {number} s
    * @returns {Vec4}
    */
    lerp(other, s) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_lerp(ptr, ptr0, s);
        return Vec4.__wrap(ret);
    }
    /**
    * Returns whether `self` is length `1.0` or not.
    *
    * Uses a precision threshold of `std::f32::EPSILON`.
    * @returns {boolean}
    */
    is_normalized() {
        const ptr = this.ptr;
        this.ptr = 0;
        const ret = wasm.vec4_is_normalized(ptr);
        return ret !== 0;
    }
    /**
    * Returns true if the absolute difference of all elements between `self`
    * and `other` is less than or equal to `max_abs_diff`.
    *
    * This can be used to compare if two `Vec4`\'s contain similar elements. It
    * works best when comparing with a known value. The `max_abs_diff` that
    * should be used used depends on the values being compared against.
    *
    * For more on floating point comparisons see
    * https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/
    * @param {Vec4} other
    * @param {number} max_abs_diff
    * @returns {boolean}
    */
    abs_diff_eq(other, max_abs_diff) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(other, Vec4);
        const ptr0 = other.ptr;
        other.ptr = 0;
        const ret = wasm.vec4_abs_diff_eq(ptr, ptr0, max_abs_diff);
        return ret !== 0;
    }
}
/**
* A 4-dimensional vector mask.
*
* This type is typically created by comparison methods on `Vec4`.  It is
* essentially a vector of four boolean values.
*/
export class Vec4Mask {

    static __wrap(ptr) {
        const obj = Object.create(Vec4Mask.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec4mask_free(ptr);
    }
    /**
    * Creates a new `Vec4Mask`.
    * @param {boolean} x
    * @param {boolean} y
    * @param {boolean} z
    * @param {boolean} w
    * @returns {Vec4Mask}
    */
    static new(x, y, z, w) {
        const ret = wasm.vec4mask_new(x, y, z, w);
        return Vec4Mask.__wrap(ret);
    }
    /**
    * Returns a bitmask with the lowest four bits set from the elements of
    * the `Vec4Mask`.
    *
    * A true element results in a `1` bit and a false element in a `0` bit.
    * Element `x` goes into the first lowest bit, element `y` into the
    * second, etc.
    * @returns {number}
    */
    bitmask() {
        const ret = wasm.vec4mask_bitmask(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns true if any of the elements are true, false otherwise.
    *
    * In other words: `x || y || z || w`.
    * @returns {boolean}
    */
    any() {
        const ret = wasm.vec4mask_any(this.ptr);
        return ret !== 0;
    }
    /**
    * Returns true if all the elements are true, false otherwise.
    *
    * In other words: `x && y && z && w`.
    * @returns {boolean}
    */
    all() {
        const ret = wasm.vec4mask_all(this.ptr);
        return ret !== 0;
    }
    /**
    * Creates a new `Vec4` from the elements in `if_true` and `if_false`,
    * selecting which to use for each element based on the `Vec4Mask`.
    *
    * A true element in the mask uses the corresponding element from
    * `if_true`, and false uses the element from `if_false`.
    * @param {Vec4} if_true
    * @param {Vec4} if_false
    * @returns {Vec4}
    */
    select(if_true, if_false) {
        const ptr = this.ptr;
        this.ptr = 0;
        _assertClass(if_true, Vec4);
        const ptr0 = if_true.ptr;
        if_true.ptr = 0;
        _assertClass(if_false, Vec4);
        const ptr1 = if_false.ptr;
        if_false.ptr = 0;
        const ret = wasm.vec4mask_select(ptr, ptr0, ptr1);
        return Vec4.__wrap(ret);
    }
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_updateWrapper_580cfe9e04d01cef = function(arg0) {
        getObject(arg0).updateWrapper();
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_cb_forget = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__widl_instanceof_Window = function(arg0) {
        const ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__widl_f_get_element_by_id_Document = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getElementById(getStringFromWasm(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_set_title_Document = function(arg0, arg1, arg2) {
        getObject(arg0).title = getStringFromWasm(arg1, arg2);
    };
    imports.wbg.__widl_instanceof_HTMLCanvasElement = function(arg0) {
        const ret = getObject(arg0) instanceof HTMLCanvasElement;
        return ret;
    };
    imports.wbg.__widl_f_get_context_HTMLCanvasElement = function(arg0, arg1, arg2) {
        try {
            const ret = getObject(arg0).getContext(getStringFromWasm(arg1, arg2));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__widl_f_now_Performance = function(arg0) {
        const ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__widl_instanceof_WebGL2RenderingContext = function(arg0) {
        const ret = getObject(arg0) instanceof WebGL2RenderingContext;
        return ret;
    };
    imports.wbg.__widl_f_bind_vertex_array_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).bindVertexArray(getObject(arg1));
    };
    imports.wbg.__widl_f_buffer_data_with_array_buffer_view_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
    };
    imports.wbg.__widl_f_create_vertex_array_WebGL2RenderingContext = function(arg0) {
        const ret = getObject(arg0).createVertexArray();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        try {
            getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm(arg9, arg10));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__widl_f_uniform4fv_with_f32_array_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm(arg2, arg3));
    };
    imports.wbg.__widl_f_uniform_matrix4fv_with_f32_array_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm(arg3, arg4));
    };
    imports.wbg.__widl_f_active_texture_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).activeTexture(arg1 >>> 0);
    };
    imports.wbg.__widl_f_attach_shader_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
    };
    imports.wbg.__widl_f_bind_buffer_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
    };
    imports.wbg.__widl_f_bind_texture_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
    };
    imports.wbg.__widl_f_clear_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).clear(arg1 >>> 0);
    };
    imports.wbg.__widl_f_clear_color_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__widl_f_compile_shader_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).compileShader(getObject(arg1));
    };
    imports.wbg.__widl_f_create_buffer_WebGL2RenderingContext = function(arg0) {
        const ret = getObject(arg0).createBuffer();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_create_program_WebGL2RenderingContext = function(arg0) {
        const ret = getObject(arg0).createProgram();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_create_shader_WebGL2RenderingContext = function(arg0, arg1) {
        const ret = getObject(arg0).createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_create_texture_WebGL2RenderingContext = function(arg0) {
        const ret = getObject(arg0).createTexture();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_delete_texture_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).deleteTexture(getObject(arg1));
    };
    imports.wbg.__widl_f_draw_arrays_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__widl_f_enable_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).enable(arg1 >>> 0);
    };
    imports.wbg.__widl_f_enable_vertex_attrib_array_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__widl_f_get_program_info_log_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
        const ptr0 = isLikeNone(ret) ? 0 : passStringToWasm(ret);
        const len0 = WASM_VECTOR_LEN;
        const ret0 = ptr0;
        const ret1 = len0;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__widl_f_get_program_parameter_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__widl_f_get_shader_info_log_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
        const ptr0 = isLikeNone(ret) ? 0 : passStringToWasm(ret);
        const len0 = WASM_VECTOR_LEN;
        const ret0 = ptr0;
        const ret1 = len0;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__widl_f_get_shader_parameter_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__widl_f_get_uniform_location_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm(arg2, arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_link_program_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).linkProgram(getObject(arg1));
    };
    imports.wbg.__widl_f_shader_source_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm(arg2, arg3));
    };
    imports.wbg.__widl_f_tex_parameteri_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__widl_f_uniform1i_WebGL2RenderingContext = function(arg0, arg1, arg2) {
        getObject(arg0).uniform1i(getObject(arg1), arg2);
    };
    imports.wbg.__widl_f_use_program_WebGL2RenderingContext = function(arg0, arg1) {
        getObject(arg0).useProgram(getObject(arg1));
    };
    imports.wbg.__widl_f_vertex_attrib_pointer_with_i32_WebGL2RenderingContext = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__widl_f_document_Window = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_performance_Window = function(arg0) {
        const ret = getObject(arg0).performance;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__widl_f_set_interval_with_callback_and_timeout_and_arguments_0_Window = function(arg0, arg1, arg2) {
        try {
            const ret = getObject(arg0).setInterval(getObject(arg1), arg2);
            return ret;
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_call_11f5c018dea16986 = function(arg0, arg1) {
        try {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_newnoargs_8effd2c0e33a9e83 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_globalThis_b8da724777cacbb6 = function() {
        try {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_self_78670bf6333531d2 = function() {
        try {
            const ret = self.self;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_window_b19864ecbde8d123 = function() {
        try {
            const ret = window.window;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_global_c6db5ff079ba98ed = function() {
        try {
            const ret = global.global;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_buffer_cdcb54e9871fd20a = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_cc334f8597c0fca9 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_b3e84ac4a3e12603 = function(arg0, arg1) {
        console.log(getStringFromWasm(arg0, arg1));
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ret0 = passStringToWasm(ret);
        const ret1 = WASM_VECTOR_LEN;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper246 = function(arg0, arg1, arg2) {
        const state = { a: arg0, b: arg1, cnt: 1 };
        const real = () => {
            state.cnt++;
            try {
                return __wbg_elem_binding0(state.a, state.b, );
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbg_function_table.get(52)(state.a, state.b);
                    state.a = 0;
                }
            }
        }
        ;
        real.original = state;
        const ret = real;
        return addHeapObject(ret);
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
        wasm.__wbindgen_start();
        return wasm;
    });
}

export default init;

