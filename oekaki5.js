"use strict";
// exports.__esModule = true;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// HTMLから各要素の属性を受け取る
//
// HTMLElement型の変数のプロパティ（valueなど）を用いて、
// そのときのHTML要素の状態を取得・変更する
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/**canvasのid属性*/
var canvas = document.getElementById('canvas');
/**canvasの2dコンテキスト*/
var ctx = canvas.getContext('2d');
/**現在のペンの色を示す「■」のid属性*/
var currentColor = document.getElementById("currentColor");
/**現在のペンの太さを示す「●」のid属性*/
var currentBold = document.getElementById("currentBold");
/**canvasをクリアするボタンのid属性*/
var clear = document.getElementById("clear");
/**canvasを壁塗りするボタンのid属性*/
var kabenuri = document.getElementById("kabenuri");
/**lineCapの有無を選択するラジオボタンのid属性*/
var lineCap = document.getElementById("lineCap");
/**lineCapの有無を選択するラジオボタンのname属性*/
var lineCapName = document.getElementsByName("lineCapName");
//! 透明度の値は整数ではないので、intではなくfloatで変換する
/**
 * ペンのRGBA・太さを調節するスライダーのid属性を格納したサイズ5の配列
 *
 * 要素番号との対応：0→赤、1→緑、2→青、3→透明度、4→太さ
*/
var slider = [
    document.getElementById("sliderR"),
    document.getElementById("sliderG"),
    document.getElementById("sliderB"),
    document.getElementById("sliderA"),
    document.getElementById("sliderBold")
];
/**
 * 現在のペンのRGBA・太さを表示する文字のid属性を格納したサイズ5の配列
 *
 * 要素番号との対応：0→赤、1→緑、2→青、3→透明度、4→太さ
*/
var indicatedValue = [
    document.getElementById("valueR"),
    document.getElementById("valueG"),
    document.getElementById("valueB"),
    document.getElementById("valueA"),
    document.getElementById("valueBold")
];
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ペンの設定をする関数
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/**RGBAのスライダーの値に合わせて、ペンのRGBAを設定する*/
var setPenStrokeStyle = function () {
    ctx.strokeStyle = "rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + ")";
};
/**太さのスライダーの値に合わせて、ペンの太さを設定する */
var setPenWidth = function () {
    ctx.lineWidth = parseInt(slider[4].value);
};
/**ラジオボタンのチェックに合わせて、ペンのlineCapを設定する */
var setPenLineCap = function () {
    if (lineCapName[0].checked)
        ctx.lineCap = "round";
    if (lineCapName[1].checked)
        ctx.lineCap = "butt";
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// HTML要素のスタイルの設定をする関数
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/**RGBAのスライダーの値に合わせて、ペンの色を示す「■」の色を設定する */
var setSquareColor = function () {
    currentColor.style.color = "rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + ")";
};
/**RGBAのスライダーの値に合わせて、スライダーの背景色を設定する */
var setSliderColor = function () {
    slider[0].style.backgroundImage = "linear-gradient(90deg, rgba(0, " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + "), rgba(255, " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + "))";
    slider[1].style.backgroundImage = "linear-gradient(90deg, rgba(" + parseInt(slider[0].value) + ", 0, " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + "), rgba(" + parseInt(slider[0].value) + ", 255, " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + "))";
    slider[2].style.backgroundImage = "linear-gradient(90deg, rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", 0, " + parseFloat(slider[3].value) + "), rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", 255, " + parseFloat(slider[3].value) + "))";
    slider[3].style.backgroundImage = "linear-gradient(90deg, rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", 0), rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", 255))";
};
/**太さのスライダーの値に合わせて、ペンの太さを示す「●」の大きさを設定する */
// 太さの値と同じ比率で、「●」の大きさを変形させる
// 特に意味はないけどキリのいい数値（0.05）を掛けたら、ペンの太さと大体同じ大きさになった
var setCircleSize = function () {
    currentBold.style.transform = "scale(" + parseInt(slider[4].value) * 0.05 + ", " + parseInt(slider[4].value) * 0.05 + ")";
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// 初期設定
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
window.onload = function () {
    setPenStrokeStyle();
    setPenWidth();
    setPenLineCap();
    setSquareColor();
    setSliderColor();
    setCircleSize();
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// マウスイベント
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/**ドラッグ状態であるか？*/
var isDrawing = false;
/**直線を引くときの始点のx座標 */
var startPointX = 0;
/**直線を引くときの始点のy座標 */
var startPointY = 0;
/**
 * 始点から終点まで、ペンの設定に合わせた直線を引く
 * @param endPointX 終点のx座標
 * @param endPointY 終点のy座標
*/
var drawLine = function (endPointX, endPointY) {
    ctx.beginPath();
    ctx.moveTo(startPointX, startPointY);
    ctx.lineTo(endPointX, endPointY);
    ctx.stroke();
    ctx.closePath();
};
/**canvas上でマウスボタンが押されたとき、現在の座標を始点にし、ドラッグ状態にする */
canvas.addEventListener('mousedown', function (e) {
    startPointX = e.offsetX;
    startPointY = e.offsetY;
    isDrawing = true;
}, false);
/**
 * canvas上でマウスが動いたときドラッグ状態ならば、
 * 始点から現在の座標へ直線を引き、現在の座標を始点にする
 */
canvas.addEventListener('mousemove', function (e) {
    if (isDrawing === true) {
        drawLine(e.offsetX, e.offsetY);
        startPointX = e.offsetX;
        startPointY = e.offsetY;
    }
}, false);
/**
 * マウスボタンが離されたときドラッグ状態ならば、
 * 始点から現在の座標へ直線を引き、ドラック状態を解除する
 */
window.addEventListener('mouseup', function (e) {
    if (isDrawing === true) {
        drawLine(e.offsetX, e.offsetY);
        startPointX = 0;
        startPointY = 0;
        isDrawing = false;
    }
}, false);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// タッチイベント（タブレット用）
//
// マウスイベントと全く同じ仕様
// e.offsetXをe.touches[0].pageX（yも同様）に置き換えた
// タッチによるスクロールを防ぐe.preventDefault()、親要素への伝搬を防ぐe.stopPropagation()を追加
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    e.stopPropagation();
    startPointX = e.touches[0].pageX;
    startPointY = e.touches[0].pageY;
    isDrawing = true;
}, false);
canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (isDrawing === true) {
        drawLine(e.touches[0].pageX, e.touches[0].pageY);
        startPointX = e.touches[0].pageX;
        startPointY = e.touches[0].pageY;
    }
}, false);
window.addEventListener('touchend', function (e) {
    if (isDrawing === true) {
        drawLine(e.touches[0].pageX, e.touches[0].pageY);
        startPointX = 0;
        startPointY = 0;
        isDrawing = false;
    }
}, false);
// canvas外でドラッグしてもスクロールさせない
window.addEventListener('touch', function (e) {
    e.preventDefault();
    e.stopPropagation();
}, false);
var _loop_1 = function (i) {
    /**RGBAのスライダーが操作されたとき、RGBAの値に関連する各設定を変更 */
    slider[i].addEventListener('input', function (e) {
        setPenStrokeStyle();
        setSquareColor();
        setSliderColor();
        // スライダーの右に表示されている値を変更
        indicatedValue[i].innerText = slider[i].value;
    });
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// Input要素のイベント
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
for (var i = 0; i <= 3; i++) {
    _loop_1(i);
}
/**太さのスライダーが操作されたとき、太さの値に関連する各設定を変更 */
slider[4].addEventListener('input', function (e) {
    setPenWidth();
    setCircleSize();
    // スライダーの右に表示されている値を変更
    indicatedValue[4].innerText = slider[4].value;
});
/**clearボタンがクリックされたとき、canvasの全面をクリアする */
clear.addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
/**壁塗りボタンがクリックされたとき、canvasの全面をペンの色で塗りつぶす */
kabenuri.addEventListener('click', function (e) {
    ctx.fillStyle = "rgba(" + parseInt(slider[0].value) + ", " + parseInt(slider[1].value) + ", " + parseInt(slider[2].value) + ", " + parseFloat(slider[3].value) + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
/**ラジオボタンが操作されたとき、ペンのlineCapを変更 */
lineCap.addEventListener('input', function (e) {
    setPenLineCap();
});
