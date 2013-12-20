/// <reference path="/js/engine/ActorBase.js" />
/// <reference path="/js/engine/WorldObject.js" />
/// <reference path="/js/engine/Network.js" />
/// <reference path="/js/actors/SpriteAnimation.js" />
/// <reference path="/js/engine/Map.js" />
/// <reference path="/js/engine/MapGenerator.js" />
/// <reference path="/js/engine/TileManager.js" />
/// <reference path="/js/engine/wall.js" />



// Constructor
function GameClass(canvas) {

    // Private Properties
    this.debugCanvas = $("#debugCanvas")[0];
    this.debugCanvasContext = this.debugCanvas.getContext("2d");
    this._canvas = canvas;
    this._buffer = $(canvas)[0].getContext("2d"); // unwrapping potential jQuery object
    this._lastTickTime = null;
    this._gameTickIntervalId = null;
    this._actors = [];
    this._worldObjects = [];

    // Public Properties
    this.targetFPS = 60;
    this.timescale = 1;
    this.timeSinceLastTick = 1000 / this.targetFPS;
    this.timeStep = this.timeSinceLastTick / 1000; // Time vector allows "per second" standards, instead of per tick.
    this.network = new Network();
    this.resourceManifest = new ResourceManifest(this);
    this.currentMap = null;
    this.mousePos = new Vector2D(0, 0);
    this.player = new Ball(this);


    // Initialization
    var self = this;
    this.attachInputCapture();
    this.addActor(this.player);
}

// Public Methods
GameClass.prototype.start = function () {
    if (this.gameTickIntervalId != null)
        return;

    var self = this;
    var gameTickClosure = function () {
        self.gameTick();
    };

    this._lastTickTime = new Date();
    this._gameTickIntervalId = setInterval(gameTickClosure, 1000 / this.targetFPS);
};
GameClass.prototype.gameTick = function () {
    this._lastTickTime = new Date();

    for (var i = 0; i < this._actors.length; i++)
        this._actors[i].tick();

    this.render();
};
GameClass.prototype.end = function () {
    clearInterval(this._gameTickIntervalId);
    this._gameTickIntervalId = null;
};
GameClass.prototype.isRunning = function () {
    return this._gameTickIntervalId != null;
}
GameClass.prototype.addActor = function (actor) {
    if (actor.isWorldObject)
        this._worldObjects.push(actor);
    else
        this._actors.push(actor);
};
GameClass.prototype.render = function () {
    this._buffer.clearRect(0, 0, 1280, 720);

    for (var i = 0; i < this._worldObjects.length; i++)
        this._worldObjects[i].render(this._buffer);

    for (var i = 0; i < this._actors.length; i++)
        this._actors[i].render(this._buffer);

    this._renderShotLine(this._buffer);
};
GameClass.prototype.loadMap = function (mapData) {
    this.currentMap = new Map(this, mapData);
};
GameClass.prototype.attachInputCapture = function () {

    var self = this,
        rect = this._canvas.getBoundingClientRect();

    $(this._canvas).keydown(function (e) {
        // add input stuff here
    })
    .bind("mousemove", function (eventData) {
        self.mousePos.x = eventData.clientX - rect.left;
        self.mousePos.y = eventData.clientY - rect.top;
    })
    .bind("click", function () {
        self._hitBall();
    });
};

// Private Methods
GameClass.prototype._renderShotLine = function (canvas) {
    canvas.fillStyle = "#FFF";
    canvas.beginPath();
    canvas.moveTo(this.player.pos.x, this.player.pos.y);
    canvas.lineTo(this.mousePos.x, this.mousePos.y);
    canvas.stroke();
    canvas.closePath();
};
GameClass.prototype._hitBall = function () {
    var xDist = this.mousePos.x - this.player.pos.x,
        yDist = this.mousePos.y - this.player.pos.y;

    var sum = Math.abs(xDist) + Math.abs(yDist);
    var xRatio = Math.abs(xDist) / sum;
    var yRatio = Math.abs(yDist) / sum;

    xDist = Utility.awayFromZero(xDist, 100 * xRatio);
    yDist = Utility.awayFromZero(yDist, 100 * yRatio);

    this.player.velocity.x = xDist * 2;
    this.player.velocity.y = yDist * 2;
};
GameClass.prototype._checkCollisions = function (movedActor) {

};

