/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/Utility.js" />

// Vector2D Constructor
function Vector2D(xValue, yValue) {
    this.x = xValue || 0;
    this.y = yValue || 0;
}



Vector2D.prototype.equals = function (val) {
    return val.x == this.x && val.y == this.y;
};
Vector2D.prototype.distance = function (val) {
    if (this.x != val.x && this.y != val.y) {
        var pivotPos = new Vector2D(this.x, val.y);
    }
};
Vector2D.prototype.calculateSlope = function () {

    if (this.y == 0)
        return 0; // no slope at all

    if (this.x == 0)
        return null; // undefined slope

    return this.y / this.x;
};
Vector2D.prototype.getInverse = function () {
    return new Vector2D(-this.x, -this.y);
}
Vector2D.prototype.add = function (vector) {
    /// <params name="vector" type="Vector2D" />

    this.x += vector.x;
    this.y += vector.y;
}
Vector2D.prototype.calculateLength = function () {
    return GeometryUtility.measureDistance(GeometryUtility.origin, this);
};


// Line Constructor
function LineClass(startPoint, endPoint) {
    /// <param name="startPoint" type="Vector2D" />
    /// <param name="endPoint" type="Vector2D" />
    
    this.startPoint = startPoint;
    this.endPoint = endPoint;
}
LineClass.prototype.calculateSlope = function () {
    return GeometryUtility.calculateSlope(this.startPoint, this.endPoint);
};
LineClass.prototype.getLeftMostPoint = function () {
    /// <returns type="Vector2D" />

    if (this.startPoint.x < this.endPoint.x)
        return this.startPoint;
    else if (this.endPoint.x > this.startPoint.x)
        return this.endPoint;
    else
        return null; // vertical line

};
LineClass.prototype.getRightMostPoint = function () {
    /// <returns type="Vector2D" />

    if (this.startPoint.x < this.endPoint.x)
        return this.endPoint;
    else if (this.endPoint.x > this.startPoint.x)
        return this.startPoint;
    else
        return null; // vertical line
};
LineClass.prototype.calculateLength = function () {
    return GeometryUtility.measureDistance(this.startPoint, this.endPoint);
};
LineClass.prototype.isPointOnLine = function (point) {
    /// <param name="point" type="Vector2D" />

    var slope = this.calculateSlope();
    var yOffset = GeometryUtility.getYOffset(this.startPoint, slope);

    // Taking the slope and y-offset of the line and calculating for the given point's
    // X, we can determine what the point's y value must be if it is on the line.  If
    // the value we calculate doesn't match the given point's Y, then the point cannot
    // fall on the line.
    var isOnSlope = (point.x * slope + yOffset) == point.y;
    var isInRange = (point.x >= this.startPoint.x || point.x >= this.endPoint.x)
                 && (point.x <= this.startPoint.x || point.x <= this.endPoint.x);

    return isOnSlope && isInRange;
};
LineClass.prototype.translate = function (x, y) {
    this.startPoint.x += x;
    this.startPoint.y += y;

    this.endPoint.x += x;
    this.endPoint.y += y;
};


// CollisionInfo constructor
function CollisionInfoClass(point, distance) {
    /// <params name="point" type="Vector2D" />
    /// <params name="distance" type="number" />

    this.point = point;
    this.distance = distance;
}