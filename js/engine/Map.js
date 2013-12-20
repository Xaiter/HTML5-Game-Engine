/// <reference path="Game.js" />
/// <reference path="Network.js" />
/// <reference path="SpriteAnimation.js" />
/// <reference path="ResourceManifest.js" />

// Constructor
function Map(game, collisionMaskUri) {

    // Properties
    this.game = game;
    this.collisionMaskUri = collisionMaskUri;
    this.collisionMaskImage = null;
    this.collisionMaskCanvas = null;
    this.collisionMaskCanvasContext = null;
    this._isLoaded = false;


    // Initialization
    var self = this;
    this.game.resourceManifest.loadImage(collisionMaskUri)
    .done(function (img) {
        self.collisionMaskImage = img;
        self.collisionMaskCanvas = CanvasUtility.createCanvasFromImage(img);
        self.collisionMaskCanvasContext = self.collisionMaskCanvas.getContext("2d");
        self.collisionMaskCanvasContext.fillStyle = "#000";
        $(self).trigger("ready");
    });
}

// Public Methods
Map.prototype.render = function (canvas) {
    canvas.fillStyle = "#080";
    canvas.fillRect(0, 0, 1280, 720);
    canvas.drawImage(this.collisionMaskImage, 0, 0);
};
Map.prototype.onContentLoaded = function (callback) {
    if (this._isLoaded)
        callback();
    else
        $(this).one("ready", callback);
};
Map.prototype.checkCollision = function (gameActor) {

    var mapMask = this._collisionMaskData;
    var actorMask = gameActor.collisionMaskData;
    var checkPixelBytes = this.collisionMaskCanvasContext.getImageData(gameActor.getTopLeftX(), gameActor.getTopLeftY(), gameActor.width, gameActor.height);

    this.game.debugCanvasContext.clearRect(0, 0, 150, 150);
    this.game.debugCanvasContext.fillRect(0, 0, 150, 150);
    this.game.debugCanvasContext.putImageData(checkPixelBytes, 50, 50);

    var byteIndex = 3;
    while (byteIndex < checkPixelBytes.data.length) {
        if (checkPixelBytes.data[byteIndex] != 0 && actorMask[byteIndex] != 0)
            return true;
        byteIndex += 4;
    }

    return false;
};