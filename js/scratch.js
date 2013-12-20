/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/Utility.js" />
/// <reference path="/js/engine/game.js" />
/// <reference path="/js/engine/world/boundingbox.js" />


// Core
function renderLine(context, line) {
    context.fillStyle = "#000";
    context.beginPath();
    context.moveTo(line.startPoint.x, line.startPoint.y);
    context.lineTo(line.endPoint.x, line.endPoint.y);
    context.stroke();

    renderPoint(context, line.startPoint);
    renderPoint(context, line.endPoint);
}

function renderPoint(context, point, fillColor) {

    var fillStyle = "#F00";

    if (typeof fillColor != "undefined")
        fillStyle = fillColor;

    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();

}

// Usage
var canvas = $("#bufferOne")[0];
var context = canvas.getContext("2d");
var game = new GameClass(canvas);

var wall = new WallClass(game, 20, 20, 0);
wall.moveTo(300, 300);

game.addActor(wall);

// Initialization
$("#go").click(function () {

    game.start();

});
