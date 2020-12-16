"use strict";
// exports.__esModule = true;
// screenの属性を受け取る
var screenCanvas = document.getElementById('screen');
// 2dコンテキスト
var ctx = screenCanvas.getContext('2d');
// currentColorの属性を受け取る
var currentColor = document.getElementById("currentColor");
// currentBoldの属性を受け取る
var currentBold = document.getElementById("currentBold");
// clearの属性を受け取る
var clear = document.getElementById("clear");
// kabenuriの属性を受け取る
var kabenuri = document.getElementById("kabenuri");
// radiobuttonの属性を受け取る
var radioButton = document.getElementById("radioButton");
var name = document.getElementsByName("name");
// sliderの属性を受け取る
var slider = [
    document.getElementById("sliderR"),
    document.getElementById("sliderG"),
    document.getElementById("sliderB"),
    document.getElementById("sliderA"),
    document.getElementById("sliderBold")
];
// sliderの表示値の属性を受け取る
var indicatedValue = [
    document.getElementById("valueR"),
    document.getElementById("valueG"),
    document.getElementById("valueB"),
    document.getElementById("valueA"),
    document.getElementById("valueBold")
];
// キャンバスのサイズ
var canvasWidth = 500;
var canvasHeight = 500;
// RGBAとboldの値
var strokeValue = [0, 0, 0, 1, 5];
// ドラッグ中
var isDrawing = false;
// ドラッグ中の位置
var startPointX = 0;
var startPointY = 0;
// 初期設定
window.onload = function () {
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    setInfoColor();
    currentBold.style.transform = "scale(0.25,0.25)";
};
////////////////////////
//--- screenCanvas ---//
////////////////////////
// mousedown
screenCanvas.addEventListener('mousedown', function (e) {
    startPointX = e.offsetX;
    startPointY = e.offsetY;
    isDrawing = true;
});
// mousemove
screenCanvas.addEventListener('mousemove', function (e) {
    if (isDrawing === true) {
        drawLine(e.offsetX, e.offsetY);
        startPointX = e.offsetX;
        startPointY = e.offsetY;
    }
});
// mouseup
window.addEventListener('mouseup', function (e) {
    if (isDrawing === true) {
        drawLine(e.offsetX, e.offsetY);
        startPointX = 0;
        startPointY = 0;
        isDrawing = false;
    }
});
// 線を描く
var drawLine = function (endPointX, endPointY) {
    ctx.beginPath();
    ctx.moveTo(startPointX, startPointY);
    ctx.lineTo(endPointX, endPointY);
    ctx.stroke();
    ctx.closePath();
};
var _loop_1 = function (i) {
    slider[i].addEventListener('input', function (e) {
        strokeValue[i] = slider[i].value;
        indicatedValue[i].innerText = slider[i].value;
        setInfoColor();
        ctx.strokeStyle = "rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", " + strokeValue[2] + ", " + strokeValue[3] + ")";
    });
};
/////////////////////
//--- スライダー ---//
/////////////////////
// スライダーのイベントを追加する
for (var i = 0; i < 4; i++) {
    _loop_1(i);
}
slider[4].addEventListener('input', function (e) {
    strokeValue[4] = slider[4].value;
    indicatedValue[4].innerText = slider[4].value;
    currentBold.style.transform = "scale(" + strokeValue[4] * 0.05 + ", " + strokeValue[4] * 0.05 + ")";
    ctx.lineWidth = strokeValue[4];
});
// スライダーの背景と現在の色を示す四角（■）の色を設定する
var setInfoColor = function () {
    slider[0].style.backgroundImage = "linear-gradient(90deg, rgba(0, " + strokeValue[1] + ", " + strokeValue[2] + ", " + strokeValue[3] + "), rgba(255, " + strokeValue[1] + ", " + strokeValue[2] + ", " + strokeValue[3] + "))";
    slider[1].style.backgroundImage = "linear-gradient(90deg, rgba(" + strokeValue[0] + ", 0, " + strokeValue[2] + ", " + strokeValue[3] + "), rgba(" + strokeValue[0] + ", 255, " + strokeValue[2] + ", " + strokeValue[3] + "))";
    slider[2].style.backgroundImage = "linear-gradient(90deg, rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", 0, " + strokeValue[3] + "), rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", 255, " + strokeValue[3] + "))";
    slider[3].style.backgroundImage = "linear-gradient(90deg, rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", " + strokeValue[2] + ", 0), rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", " + strokeValue[2] + ", 255))";
    currentColor.style.color = "rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", " + strokeValue[2] + ", " + strokeValue[3] + ")";
};
/////////////////
//--- その他 ---//
/////////////////
// clear
clear.addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
});
// kabenuri
kabenuri.addEventListener('click', function (e) {
    ctx.fillStyle = "rgba(" + strokeValue[0] + ", " + strokeValue[1] + ", " + strokeValue[2] + ", " + strokeValue[3] + ")";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
});
// radiobutton
radioButton.addEventListener('input', function (e) {
    if (name[0].checked)
        ctx.lineCap = "round";
    if (name[1].checked)
        ctx.lineCap = "butt";
});
