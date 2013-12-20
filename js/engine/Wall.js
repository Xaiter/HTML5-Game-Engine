/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/engine/Game.js" />
/// <reference path="/js/engine/world/boundingbox.js" />
/// <reference path="/js/engine/ActorBase.js" />
/// <reference path="/js/engine/WorldObject.js" />
/// <reference path="/js/Utility.js" />

function WallClass(game, width, height, rotation) {

    // base "constructor"
    WorldObjectClass.call(this, game, width, height);
 
    this.color = "#F00";
    this.isSolid = true;
    this.isWorldObject = true;
    this.rotation = rotation ? rotation : 0;
    this.hitBox = new BoundingBoxClass(this, width, height, rotation);

    //this._generateSprite();
}
ClassUtility.inheritPrototype(WorldObjectClass, WallClass);

WallClass.prototype.render = function (renderContext) {
    for (var i = 0; i < this.hitBox._lines.length; i++)
        CanvasUtility.renderLine(renderContext, this.hitBox._lines[i]);
};

WallClass.prototype._generateSprite = function () {

    var self = this;
    var callback = function (tempCanvas) {
        var tempContext = tempCanvas.getContext("2d");

        tempContext.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempContext.rotate(self.rotation);
        tempContext.fillStyle = self.color;
        tempContext.fillRect(tempCanvas.width / -2, tempCanvas.height / -2, self.width, self.height);
    };

    this.sprite = CanvasUtility.createImageFromCanvas(this.width, this.height, callback);
    game.resourceManifest.loadImageElement(this.sprite);
};