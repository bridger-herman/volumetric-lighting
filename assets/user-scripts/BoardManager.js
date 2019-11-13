/* BoardManager.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Creates a board from a list of locations, then manages clicks on the board
 */

import * as wre from '../pkg/wre_wasm.js';
import { WreScript, loadTextResource, DEFAULT_SHADER_ID} from '../wre.js';
import { Ray } from '../ray.js';
import { PlaceToken } from './placeToken.js';
import { oneFromWin, nearlySolved, easy, challenging } from './boards.js'

export class BoardManager extends WreScript {
    // Arrow function to preserve `this` context
    mouseHandler = (evt) => {
        let xOffset = this._camRight.mul(this._pixelWidth * evt.offsetX);
        let yOffset = this._camUp.mul(-this._pixelHeight * evt.offsetY);

        let upLeftPlusYOffset = this._upperLeft.add(yOffset);
        let imagePlaneLocation = upLeftPlusYOffset.add(xOffset);
        let rayDir = imagePlaneLocation.sub(this._camPos).normalize();

        let mouseRay = new Ray(this._camPos, rayDir);

        let t = 0.0;
        let deltaT = 0.01;
        let underSurface = false;
        let coord = wre.Vec3.zero();
        while (t < 10.0 && !underSurface) {
            coord = mouseRay.eval(t);
            if (coord.y() <= 0.0) {
                underSurface = true;
            }
            t += deltaT;
        }

        // Gives int in range [-4, 4]
        let coordX2D = Math.round(coord.x() * 10.0);
        let coordY2D = Math.round(coord.z() * 10.0);

        // Gives int in range [0, 8]
        let boardCoords = [coordY2D + 4, coordX2D + 4];

        let checkBounds = (c) => {return c >= 0 && c < 9};

        if (checkBounds(boardCoords[0]) && checkBounds(boardCoords[1])) {
            // if the user clicks within the bounds, spawn new entity
            let valid = this.checkSpace(...boardCoords, this._currentColor);

            let eid = wre.create_entity();
            let entity = wre.get_entity(eid);
            wre.add_mesh(eid, this._objText);
            let script = new PlaceToken(eid);

            let startTransform = wre.Transform.identity();
            startTransform.position = new wre.Vec3(0.0, 0.5, -0.5);
            startTransform.scale = new wre.Vec3(1.0, 1.0, 8.0);

            let midTransform = wre.Transform.identity();
            midTransform.position = new wre.Vec3(coordX2D * 0.1, 0.0, coordY2D * 0.1);
            midTransform.scale = new wre.Vec3(1.0, 2.0, 1.0);

            let endTransform = wre.Transform.identity();
            endTransform.position = new wre.Vec3(coordX2D * 0.1, 0.0, coordY2D * 0.1);
            endTransform.scale = new wre.Vec3(1.0, 1.0, 1.0);

            entity.material = new wre.Material(DEFAULT_SHADER_ID, new wre.Vec4(
                this._colors[this._currentColor][0],
                this._colors[this._currentColor][1],
                this._colors[this._currentColor][2],
                this._colors[this._currentColor][3],
            ));

            if (valid) {
                script.setKeyframe(startTransform, 0.0);
                script.setKeyframe(midTransform, 0.5);
                script.setKeyframe(endTransform, 1.0);

                wre.add_script(eid, script);

                // add this entity to the board and collection of eids
                this._board[this._currentColor].push(boardCoords);
                this._color_eids[this._currentColor].push(eid);

                let win = Object.values(this._board).every((v) => v.length == 9);
                if (win) {
                    document.getElementById('win-container').innerHTML = '<h1 id="win-text">WINNER!</h1>';
                }
            } else {
                let lastTf = wre.Transform.identity();
                lastTf.position = new wre.Vec3(0.0, 1.0, 0.0);
                lastTf.scale = new wre.Vec3(1.0, 6.0, 1.0);

                script.setKeyframe(startTransform, 0.0);
                script.setKeyframe(midTransform, 0.2);
                midTransform.position = midTransform.position.add(new wre.Vec3(0, 0.1, 0));
                script.setKeyframe(endTransform, 0.5);
                endTransform.position = midTransform.position.add(new wre.Vec3(0, 0.1, 0));
                script.setKeyframe(lastTf, 1.0);

                wre.add_script(eid, script);
            }

            wre.set_entity(eid, entity);
        }
    }

    checkSpace(row, col, testColor) {
        // Check to see if anything's already in the space
        for (let color in this._board) {
            for (let i in this._board[color]) {
                let space = this._board[color][i];
                if (row == space[0] && col == space[1]) {
                    return false;
                }
            }
        }

        // Check to see if anything of this color is already in the column or
        // row
        for (let i in this._board[testColor]) {
            let space = this._board[testColor][i];
            if (row == space[0] || col == space[1]) {
                return false;
            }
        }

        // Check to see if anything of this color is already in the same box
        let rowBox = Math.floor(row / 3);
        let colBox = Math.floor(col / 3);
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                let inBox = this._board[testColor].find((el) => {
                    return el[0] == ((rowBox * 3) + r) && el[1] == ((colBox * 3) + c);
                });

                if (inBox) {
                    return false;
                }
            }
        }
        return true;
    }

    start() {
        let canvas = document.getElementById('canvas');
        canvas.addEventListener('click', (evt) => this.mouseHandler(evt));

        this._nearPlane = 0.1;
        this._aspect = 16.0 / 9.0;
        this._vertHalfAngle = 45.0 * (Math.PI / 360.0);
        this._viewportHeight = 2.0 * Math.tan(this._vertHalfAngle);
        this._viewportWidth = this._viewportHeight * this._aspect;
        this._pixelWidth = this._viewportWidth / canvas.width;
        this._pixelHeight = this._viewportHeight / canvas.height;

        // TODO: Not sure why this is necessary.... pixel sizes are way too
        // big
        this._pixelWidth *= 0.1;
        this._pixelHeight *= 0.1;

        this._camPos = new wre.Vec3(0, 1, 1);
        this._camDir = new wre.Vec3(0, -1, -1).normalize();
        this._camUp = new wre.Vec3(0, 1, -1).normalize();
        this._camRight = new wre.Vec3(1, 0, 0);

        // The upper-left-most pixel
        let imagePlaneCenterOffset = this._camDir.mul(this._nearPlane);
        let imagePlaneCenter = this._camPos.add(imagePlaneCenterOffset);
        let topRow = this._camUp.mul(this._pixelHeight * (canvas.height / 2.0 - 0.5));
        let leftRow = this._camRight.mul(-this._pixelWidth * (canvas.width / 2.0 - 0.5));
        let topLeft = topRow.add(leftRow);

        this._upperLeft = topLeft.add(imagePlaneCenter);

        // defining _colors instance variable
        this._colors = {
            "red": [0.584314, 0.109804, 0.0745098, 1.0],
            "orange": [0.666667, 0.278431, 0.0235294, 1.0],
            "yellow": [0.814724, 0.763804, 0.0152761, 1.0],
            "lightGreen": [0.3, 0.6, 0.00625002, 1.0],
            "darkGreen": [0.06, 0.30, 0.19, 1.0],
            "lightBlue": [0.4, 0.7, 0.99, 1.0],
            "darkBlue": [0.05, 0.01, 0.33, 1.0],
            "lightPurple": [0.58, 0.5275, 0.8725, 1.0],
            "darkPurple": [0.44, 0.181176, 0.698824, 1.0],
        };

        // defining _color_eids instance variable
        this._color_eids = {
            "red": [],
            "orange": [],
            "yellow": [],
            "lightGreen": [],
            "darkGreen": [],
            "lightBlue": [],
            "darkBlue": [],
            "lightPurple": [],
            "darkPurple": []
        };

        for (let colorName in this._colors) {
            let colorInts = this._colors[colorName].map((c) => parseInt(c * 255));
            let colorValue = "#" + ((1 << 24) + (colorInts[0] << 16) + (colorInts[1] << 8) + colorInts[2]).toString(16).slice(1);
            let buttonHtml = `<button id="${colorName}" class="color-button"><div class="color-preview" style="background-color: ${colorValue}"></div></button>`;
            document.getElementById('button-container').innerHTML += buttonHtml;
        }

        this._currentColor = Object.keys(this._colors)[0];
        document.getElementById(this._currentColor).style['background-color'] = '#DDD';

        for (let colorName in this._colors) {
            let button = document.getElementById(colorName);
            button.addEventListener('click', (evt) => {
                let clicked = evt.target;
                if (!this._colors.hasOwnProperty(evt.target.id)) {
                    clicked = clicked.parentElement;
                }

                let buttons = document.getElementsByClassName('color-button');
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].style['background-color'] = '#000';
                }

                // change the background color of the currently clicked button
                this._currentColor = clicked.id;    // id = string(color name)
                clicked.style['background-color'] = '#DDD';
            });
        }

        this._board = nearlySolved;

        loadTextResource('./resources/models/small_sphere.obj').then((objText) => {
            this._objText = objText;
        });

        loadTextResource('./resources/models/small_sphere.obj').then((objText) => {
            for (let color in this._board) {
                for (let pairIndex in this._board[color]) {
                    let sphere = wre.create_entity();
                    let sphereEntity = wre.get_entity(sphere);
                    wre.add_mesh(sphere, objText);
                    let tf = sphereEntity.transform;
                    tf.position =
                        (new wre.Vec3(0.0, 0.0, 0.1))
                                .mul(this._board[color][pairIndex][0])
                        .add((new wre.Vec3(0.1, 0.0, 0.0))
                                .mul(this._board[color][pairIndex][1]))
                        .sub(new wre.Vec3(0.4, 0.0, 0.4));
                    sphereEntity.transform = tf;
                    sphereEntity.material = new wre.Material(DEFAULT_SHADER_ID, new wre.Vec4(
                        this._colors[color][0],
                        this._colors[color][1],
                        this._colors[color][2],
                        this._colors[color][3],
                    ));
                    wre.set_entity(sphere, sphereEntity);

                    // add this eid to our collection
                    this._color_eids[color].push(sphere);
                }
            }
        })
    }

    update() {
        // loop through the pieces and change the alphas of all
        // pieces back to 1.0
        for (let color in this._color_eids) {
            let eids = this._color_eids[color];

            for(let j in eids) {
                let eid = eids[j];
                let entity = wre.get_entity(eid);

                // make alpha 0.5 to indicate that we should blur this
                entity.material = new wre.Material(DEFAULT_SHADER_ID,
                    new wre.Vec4(
                        this._colors[color][0],
                        this._colors[color][1],
                        this._colors[color][2],
                        1.0
                ));
                wre.set_entity(eid, entity);
            }
        }

        // loop through the pieces and change the alphas to 0.5 for all
        // pieces that are the same color as currentColor
        let matching_pieces = this._color_eids[this._currentColor];

        for (let i in matching_pieces) {
            let eid = matching_pieces[i];
            let entity = wre.get_entity(eid);

            // make alpha 0.5 to indicate that we should blur this
            entity.material = new wre.Material(DEFAULT_SHADER_ID,
                new wre.Vec4(
                    this._colors[this._currentColor][0],
                    this._colors[this._currentColor][1],
                    this._colors[this._currentColor][2],
                    0.5
            ));
            wre.set_entity(eid, entity);
        }
    }
}

