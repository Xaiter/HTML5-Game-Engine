/// <reference path="/js/engine/ActorBase.js" />
/// <reference path="/js/engine/WorldObject.js" />
/// <reference path="/js/engine/Network.js" />
/// <reference path="/js/actors/SpriteAnimation.js" />
/// <reference path="/js/engine/Map.js" />
/// <reference path="/js/engine/MapGenerator.js" />
/// <reference path="/js/engine/TileManager.js" />
/// <reference path="/js/engine/wall.js" />
/// <reference path="/js/engine/world/geometry.js" />


function HitBoxBaseClass(owningActor) {
    /// <param name="owningActor" type="ActorBaseClass" />

    this.owningActor = owningActor;
}
HitBoxBaseClass.prototype.translate = function (x, y) {
    throw "HitBoxBaseClass.translate is not implemented.";
};
HitBoxBaseClass.prototype.moveTo = function (x, y) {
    throw "HitBoxBaseClass.moveTo is not implemented.";
}



function BoundingBoxClass(owningActor, width, height, rotation) {
    /// <param name="owningActor" type="ActorBaseClass" />
    /// <param name="width" type="number" />
    /// <param name="height" type="number" />
    /// <param name="rotation" type="number" />

    // Base "Constructor"
    HitBoxBaseClass.call(this, owningActor);

    this.width = width;
    this.height = height;
    this.rotation = rotation;

    this.lines = [];
    this._generateMembers();
}
ClassUtility.inheritPrototype(HitBoxBaseClass, BoundingBoxClass);

BoundingBoxClass.prototype.translate = function (x, y) {
    this._translateMembers(x, y);
};
BoundingBoxClass.prototype.moveTo = function (x, y) {
    /// <param name="destPos" type="Vector2D" />
    
    this._translateMembers(x - this.owningActor.pos.x, y - this.owningActor.pos.y);
};
BoundingBoxClass.prototype._translateMembers = function (x, y) {
    for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].translate(x, y);
    }
};
BoundingBoxClass.prototype._generateMembers = function () {
    var leftX = this.owningActor.pos.x - this.width / 2;
    var rightX = this.owningActor.pos.x + this.width / 2;
    var topY = this.owningActor.pos.y - this.height / 2;
    var bottomY = this.owningActor.pos.y + this.height / 2;

    var topLine = new LineClass(new Vector2D(leftX, topY), new Vector2D(rightX, topY));
    var bottomLine = new LineClass(new Vector2D(leftX, bottomY), new Vector2D(rightX, bottomY));
    var leftLine = new LineClass(new Vector2D(leftX, bottomY), new Vector2D(leftX, topY));
    var rightLine = new LineClass(new Vector2D(rightX, bottomY), new Vector2D(rightX, topY));

    this.lines.push(topLine, bottomLine, leftLine, rightLine);
};



function BoundingCircleClass(owningActor, radius) {
    /// <param name="owningActor" type="ActorBaseClass" />
    /// <param name="radius" type="number" />

    // Base "Constructor"
    HitBoxBaseClass.call(this, owningActor);

    this.radius = radius;
}
ClassUtility.inheritPrototype(HitBoxBaseClass, BoundingCircleClass);

BoundingCircleClass.prototype.translate = function (x, y) {
    // Nothing - we have no children!
};
BoundingCircleClass.prototype.moveTo = function (x, y) {
    // Nothing - we have no children!
};
