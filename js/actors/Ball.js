/// <reference path="/js/jquery.min.js" />
/// <reference path="Utility.js" />
/// <reference path="Game.js" />
/// <reference path="/js/engine/ActorBase.js" />

function Ball(game) {

    // base "constructor"
    ActorBaseClass.call(this, game, 20, 20);

    this.friction = 200;
    this.velocity = new Vector2D(0, 0);
    this.topLeftPos = new Vector2D(0, 0);
    this.color = "#FFF";
    this.size = 10;
    this.hitBox = new BoundingCircleClass(this, this.size / 2);

    this._sprite = null;
    this.collisionMaskData = null;
    this._spriteCenterOffset = new Vector2D(0, 0);

    this._generateSprite();
}
ClassUtility.inheritPrototype(ActorBaseClass, Ball);


// Public Methods
Ball.prototype.getTopLeftX = function () {
    return this.pos.x - this._spriteCenterOffset.x;
};
Ball.prototype.getTopLeftY = function () {
    return this.pos.y - this._spriteCenterOffset.y;
};
Ball.prototype.tick = function () {
    var step = game.timeSinceLastTick / 1000;

    this.pos.x += this.velocity.x * step;
    this.pos.y += this.velocity.y * step;

    this._applyFriction();
};
Ball.prototype.render = function (canvas) {
    canvas.drawImage(this._sprite, this.pos.x - this.size, this.pos.y - this.size)
};


// Private Methods
Ball.prototype._applyFriction = function () {

    var step = game.timeSinceLastTick / 1000;
    var sum = Math.abs(this.velocity.y) + Math.abs(this.velocity.x);
    var xRatio = Math.abs(this.velocity.x) / sum;
    var yRatio = Math.abs(this.velocity.y) / sum;

    this.velocity.y = Utility.towardsZero(this.velocity.y, yRatio * this.friction * step);
    this.velocity.x = Utility.towardsZero(this.velocity.x, xRatio * this.friction * step);
};
Ball.prototype._generateSprite = function () {
    var tempCanvas = $("<canvas width='" + this.size * 2 + "' height='" + this.size * 2 + "'></canvas>")[0]
    var tempContext = tempCanvas.getContext("2d");
    tempContext.clearRect(0, 0, 20, 20);

    tempContext.fillStyle = this.color;
    tempContext.arc(this.size, this.size, this.size, 0, Math.PI * 2, true);
    tempContext.closePath();
    tempContext.fill();

    this._sprite = $("<img />")[0];
    this._sprite.src = tempCanvas.toDataURL();
    this.collisionMaskData = tempContext.getImageData(0, 0, this.size * 2, this.size * 2);

    this._spriteCenterOffset.x = this.size / 2;
    this._spriteCenterOffset.y = this.size / 2;
};
