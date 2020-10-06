const IMAGE_WIDHT = 320;
const IMAGE_HEIGHT = 240;
const COLOR_RANGE = 256;
const PIXEL_TOTAL = IMAGE_WIDHT * IMAGE_HEIGHT;
const HISTGRAM_COLOR = [
    "rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", //RGB
    "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(128, 128, 128)",  //HSV
    "rgb(128, 128, 128)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"];  //YUV
const SELECT_RANGE_STATE = { NONE: 0, SELECTING: 1, SELECTED: 2 };

let selectRangeState = SELECT_RANGE_STATE.NONE;
let firstPosX = 0;
let firstPosY = 0;
let secondPosX = IMAGE_WIDHT - 1;
let secondPosY = IMAGE_HEIGHT - 1;

let COLOR = { R: 0, G: 1, B: 2 };

let toneArrR = new Array(COLOR_RANGE);
let toneArrG = new Array(COLOR_RANGE);
let toneArrB = new Array(COLOR_RANGE);

let compArr = new Array(toneArrR, toneArrG, toneArrB);
let imageData;
