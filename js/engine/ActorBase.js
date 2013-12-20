/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/engine/Game.js" />

function ActorBaseClass(game, width, height) {

    this.game = game;
    this.pos = new Vector2D(0, 0);
    this.width = width;
    this.height = height;
    this.isSolid = false;
    this.isWorldObject = false;
    this.sprite = null;
    this.hitBox = null;
    this.velocity = 0;
    
}

ActorBaseClass.prototype.render = function (renderContext) {
    renderContext.drawImage(this.sprite, this.pos.x, this.pos.y);
};
ActorBaseClass.prototype.translate = function (x, y) {
    this.hitBox.translate(x, y);
    this.pos.x = x;
    this.pos.y = y;
};
ActorBaseClass.prototype.moveTo = function (x, y) {
    this.hitBox.moveTo(x, y);
    this.pos.x = x;
    this.pos.y = y;
};
