function clearSelectRect() {
    let cvs = document.getElementById('baseImgOverlayer');
    let ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
}

function clickSelectRange() {
    clearPixelColor();
    adjustmentGradationCombobox();
}

function clearPixelColor() {
    document.getElementById("imageLocation").innerHTML = "";
    document.getElementById("pixelColor").innerHTML = "";
}

function clearSelectRange() {
    selectRangeState = SELECT_RANGE_STATE.NONE;
    clearSelectRect();
}

function readImg() {

    const reader = new FileReader();
    const fileSelect = document.getElementById("fileSelect");
    const cvs = document.getElementById("baseImg");
    let ctx = cvs.getContext("2d");
    let img = new Image();

    if (fileSelect.files.length == 0) {
        return;
    }
    reader.onloadend = () => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, cvs.clientWidth, cvs.clientHeight);
            imageData = ctx.getImageData(0, 0, IMAGE_WIDHT, IMAGE_HEIGHT);

        }
        img.src = reader.result;
    }
    reader.readAsDataURL(fileSelect.files[0]);

    document.getElementById("colorFormat").disabled = "";
    document.getElementById("binNumberId").disabled = "";
    document.getElementById("colorPix").disabled = "";
    document.getElementById("analysisImg").disabled = "";
    document.getElementById("selectRect").disabled = "";
}

function clickBaseImg(event) {
    if (isOperationTypeColorPix()) {
        const cvs = document.getElementById("baseImg");
        let ctx = cvs.getContext("2d");
        let pixelData = ctx.getImageData(event.offsetX, event.offsetY, 1, 1);
        let colorFormat = document.getElementById("colorFormat").value;
        let colorFormat1 = colorFormat.substr(0, 1);
        let colorFormat2 = colorFormat.substr(1, 1);
        let colorFormat3 = colorFormat.substr(2, 1);
        let formatedData = [0, 0, 0];

        switch (colorFormat) {
            case "RGB":
                formatedData = pixelData.data;
                break;
            case "HSV":
                RGB2HSV(formatedData, pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                break;
            case "YUV":
                RGB2YUV(formatedData, pixelData.data[0], pixelData.data[1], pixelData.data[2]);
                break;
            default:
        }
        document.getElementById("imageLocation").innerHTML = "X:" + event.offsetX + ","
            + "Y:" + event.offsetY;
        document.getElementById("pixelColor").innerHTML = colorFormat1 + ":" + formatedData[0] + ", "
            + colorFormat2 + ":" + formatedData[1] + ", "
            + colorFormat3 + ":" + formatedData[2];
    } else {
        if (selectRangeState == SELECT_RANGE_STATE.SELECTING) {
            selectRangeState = SELECT_RANGE_STATE.SELECTED;
        }
        else {
            firstPosX = event.offsetX;
            firstPosY = event.offsetY;
            selectRangeState = SELECT_RANGE_STATE.SELECTING;
        }
    }
}

function drawRectOnBaseImg(event) {
    if (selectRangeState == SELECT_RANGE_STATE.SELECTING) {
        let cvs = document.getElementById('baseImgOverlayer');
        let ctx = cvs.getContext('2d');

        ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
        secondPosX = event.offsetX;
        secondPosY = event.offsetY;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 255)";
        ctx.strokeRect(
            Math.min(firstPosX, secondPosX),
            Math.min(firstPosY, secondPosY),
            Math.abs(secondPosX - firstPosX),
            Math.abs(secondPosY - firstPosY));
    }
}

function drawHistgram() {
    let cvs = document.getElementById("histgramImgId");
    let binNumber = document.getElementById("binNumberId").value;
    let colorFormatSelectedIdx = document.getElementById("colorFormat").selectedIndex;

    for (histgramIndex = 0; histgramIndex < cvs.children.length; histgramIndex++) {
        let ctx = cvs.children[histgramIndex].getContext('2d');

        ctx.clearRect(0, 0, cvs.children[histgramIndex].clientWidth,
            cvs.children[histgramIndex].clientHeight);

        if (document.getElementById("binNumberId").value == COLOR_RANGE) {
            clearSelectRange();
            continue;
        }

        ctx.fillStyle = HISTGRAM_COLOR[colorFormatSelectedIdx * 3 + histgramIndex];

        let binArr = new Array();
        makeBinCount(binArr, histgramIndex, binNumber);

        drawCompHistgram(ctx, binArr, binNumber);

    }
}

function drawCompHistgram(ctx, binArr, binNumber) {
    let binHeight;
    let binWidth = IMAGE_WIDHT / binNumber;
    let pixelTotalRect;
    let operationType = document.getElementById("operationTypeId").operationType.value;

    if (operationType == "selectRect") {
        if (selectRangeState == SELECT_RANGE_STATE.SELECTED) {
            pixelTotalRect = Math.abs(secondPosX - firstPosX) * Math.abs(secondPosY - firstPosY);
        }
        else {
            pixelTotalRect = PIXEL_TOTAL;
            clearSelectRange();
        }
    }
    else {
        pixelTotalRect = PIXEL_TOTAL;
    }

    for (i = 0; i <= binNumber; i++) {
        binHeight = Math.floor((binArr[i] / pixelTotalRect) * IMAGE_HEIGHT);
        ctx.fillRect(
            i * binWidth,
            (IMAGE_HEIGHT - binHeight),
            binWidth,
            binHeight);
    }
}

function selectBinNumber() {
    adjustmentGradationCombobox();
}

function adjustmentGradationCombobox() {
    var element = document.getElementById("operationTypeId");
    var radioNodeList = element.operationType;
    var value = radioNodeList.value;

    if (value === "colorPix") {
        return;
    }

    if (document.formComboboxes.binNumberId.selectedIndex === 0) {
        document.formComboboxes.binNumberId.selectedIndex = 1;
    }
}
