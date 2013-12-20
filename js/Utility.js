/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/engine/world/Geometry.js" />
/// <reference path="/js/engine/world/BoundingBox.js" />

var Utility = {
    getRandomNumber: function (min, max) {
        return Math.floor((Math.random() * (max - min)) + min);
    },

    getRandomBool: function () {
        return Utility.getRandomNumber(0, 1) != 0;
    },

    isBetween: function (value, min, max) {
        return !(value < min || value >= max)
    },

    clamp: function (min, max, value) {

        if (min > value)
            value = min;
        else if (value > max)
            value = max;

        return value;
    },

    towardsZero: function (value, distance) {
        if (value == 0)
            return value;

        var temp = Math.abs(value) - distance;
        if (value < 0)
            temp = -temp;
        else if (temp < 0)
            temp = 0;

        return temp;
    },

    awayFromZero: function (value, distance) {
        if (value < 0)
            value -= distance;
        else
            value += distance;

        return value;
    }
};

var CanvasUtility = (function () {

    var BYTES_PER_PIXEL = 4;

    return {
        getImageData: function (imageTag) {
            var tempContext = $("<canvas></canvas>")[0].getContext("2d");
            tempContext.drawImage(imageTag, 0, 0);
            return tempContext.getImageData(0, 0, imageTag.width, imageTag.height);
        },

        createImageFromCanvas: function (imageWidth, imageHeight, createImageCallback) {
            var tempCanvas = $("<canvas></canvas>")[0];
            tempCanvas.width = imageWidth;
            tempCanvas.height = imageHeight;

            createImageCallback(tempCanvas);

            return $("<img />").attr("src", tempCanvas.toDataURL())[0];
        },

        getPixelDataRect: function (pixelData, x, y, width, height) {
            var result = [];
            currentByteIndex = 0,
            rowEndIndex = 0,
            pixelByteIndex = 0;

            currentByteIndex = (y * pixelData.width + x) * BYTES_PER_PIXEL;
            rowEndIndex = currentByteIndex + (width * BYTES_PER_PIXEL);

            // Height defines the number of rows of pixels we're interested in, that's why we use it for a max row count
            for (var rowIndex = 0; rowIndex < height; rowIndex++) {
                while (currentByteIndex < rowEndIndex) {
                    result.push(pixelData.data[currentByteIndex]);
                    currentByteIndex += BYTES_PER_PIXEL;
                }

                rowEndIndex += pixelData.width * BYTES_PER_PIXEL;
                currentByteIndex += pixelData.width - (width * BYTES_PER_PIXEL);
            }

            return result;
        },

        createCanvasFromImage: function (img) {
            var canvas = $("<canvas></canvas>")
                            .attr("width", img.width)
                            .attr("height", img.height)[0];

            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);

            return canvas;
        },

        renderLine: function (context, line) {
            context.fillStyle = "#000";
            context.beginPath();
            context.moveTo(line.startPoint.x, line.startPoint.y);
            context.lineTo(line.endPoint.x, line.endPoint.y);
            context.stroke();

            CanvasUtility.renderPoint(context, line.startPoint);
            CanvasUtility.renderPoint(context, line.endPoint);
        },

        renderPoint: function (context, point, fillColor) {
            var fillStyle = "#F00";

            if (typeof fillColor != "undefined")
                fillStyle = fillColor;

            context.fillStyle = fillStyle;
            context.beginPath();
            context.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
        }
    };
})();

var ClassUtility = (function () {

    var invokeBaseMethodFunction = function invokeBaseMethod() {
        return this.prototype._baseClass[invokeBaseMethod.caller.name].apply(this, arguments);
    };
    var inheritPrototypeFunction = function (parentClassFunction, childClassFunction) {
        $.extend(childClassFunction.prototype, parentClassFunction.prototype);
        childClassFunction.prototype._baseClass = parentClassFunction;
        childClassFunction.prototype.base = invokeBaseMethodFunction;
    };

    return {
        inheritPrototype: inheritPrototypeFunction
    };

})();

var GeometryUtility = (function () {

    return {

        origin: new Vector2D(0, 0),

        rotate: function (pivot, point, degrees) {
            var radians = degrees * Math.PI / 180;
            var destPoint = new Vector2D(0, 0);
            destPoint.x = Math.cos(radians) * (point.x - pivot.x) - Math.sin(radians) * (point.y - pivot.y) + pivot.x;
            destPoint.y = Math.sin(radians) * (point.x - pivot.x) + Math.cos(radians) * (point.y - pivot.y) + pivot.y;
            return destPoint;
        },

        checkLineLineCollision: function (lineA, lineB, velocityLineA) {
            /// <param name="lineA" type="LineClass" />
            /// <param name="lineB" type="LineClass" />
            /// <param name="velocityLineA" type="Vector2D" />
            /// <returns type="CollisionInfoClass" />

            var lineSlope = lineB.calculateSlope();
            var velocitySlope = velocityLineA.calculateSlope();
            var velocityVector = velocityLineA;

            var testA1 = GeometryUtility.checkPointLineCollision(lineA.startPoint, velocitySlope, velocityVector, lineB, lineSlope);
            var testA2 = GeometryUtility.checkPointLineCollision(lineA.endPoint, velocitySlope, velocityVector, lineB, lineSlope);

            lineSlope = lineA.calculateSlope();
            velocitySlope = velocityLineA.getInverse().calculateSlope();
            velocityVector = velocityVector.getInverse();

            var testB1 = GeometryUtility.checkPointLineCollision(lineB.startPoint, velocitySlope, velocityVector, lineA, lineSlope);
            var testB2 = GeometryUtility.checkPointLineCollision(lineB.endPoint, velocitySlope, velocityVector, lineA, lineSlope);

            var closestCollision = null;
            if (testA1 != null)
                closestCollision = testA1;

            if (closestCollision == null || (testA2 && testA2.distance < closestCollision.distance))
                closestCollision = testA2;

            if (closestCollision == null || (testB1 && testB1.distance < closestCollision.distance))
                closestCollision = testB1;

            if (closestCollision == null || (testB2 && testB2.distance < closestCollision.distance))
                closestCollision = testB2;

            return closestCollision;
        },
        checkCircleLineCollision: function (circle, line, circleVelocity) {
            /// <param name="circle" type="BoundingCircleClass" />
            /// <param name="line" type="LineClass" />
            /// <param name="circleVelocity" type="Vector2D" />

            return GeometryUtility.checkPointLineCollision(circle.owningActor.pos, circleVelocity.calculateSlope(), circleVelocity, line, line.calculateSlope(), circle.radius);
        },
        checkPointLineCollision: function (pointA, slopePointA, velocityVectorA, lineB, lineSlopeB, radiusPointA) {
            /// <param name="pointA" type="Vector2D" />
            /// <param name="slopePointA" type="number" />
            /// <param name="velocityVectorA" type="Vector2D" />
            /// <param name="lineB" type="LineClass" />
            /// <param name="slopeLineB" type="number" />
            /// <param name="radiusPointA" type="number" />
            /// <returns type="CollisionInfoClass" />

            var collisionPoint = GeometryUtility.getIntersection(pointA, slopePointA, lineB.startPoint, lineSlopeB);
            if (collisionPoint == null || !lineB.isPointOnLine(collisionPoint))
                return null; // no collision!

            var distance = GeometryUtility.measureDistance(pointA, collisionPoint);
            if (typeof radiusPointA != "undefined")
                distance += radiusPointA;

            var t = distance / velocityVectorA.calculateLength();
            if (t > 1 || t < 0)
                return null;

            return new CollisionInfoClass(collisionPoint, distance);
        },

        getIntersection: function (pointA, slopeA, pointB, slopeB) {
            /// <param name="pointA" type="Vector2D" />
            /// <param name="slopeA" type="number" />
            /// <param name="pointB" type="Vector2D" />
            /// <param name="slopeB" type="number" />
            /// <returns type="Vector2D" />

            if (slopeA == null)
                return GeometryUtility.getIntersectionWithVerticalLine(pointA, pointB, slopeB);
            else if (slopeB == null)
                return GeometryUtility.getIntersectionWithVerticalLine(pointB, pointA, slopeA);

            var slopeDifference = slopeB - slopeA;
            if (slopeDifference == 0)
                return null; // lines are parallel, no collision

            var yOffsetLineA = GeometryUtility.getYOffset(pointA, slopeA);
            var yOffsetLineB = GeometryUtility.getYOffset(pointB, slopeB);
            var offsetDifference = Math.abs(yOffsetLineB - yOffsetLineA);

            var collisionX = offsetDifference * (1 / slopeDifference);
            var collisionY = slopeB * collisionX + yOffsetLineB;

            return new Vector2D(collisionX, collisionY);
        },
        getIntersectionWithVerticalLine: function (pointA, pointB, slopeB) {
            /// <param name="pointA" type="Vector2D" />
            /// <param name="pointB" type="Vector2D" />
            /// <param name="slopeB" type="number" />

            if (slopeB == null)
                return null; // lines are both vertical, therefore parallel

            var xDifference = pointA.x - pointB.x;
            var collisionY = pointB.y + (xDifference * slopeB);
            return new Vector2D(pointA.x, collisionY);
        },        

        calculateSlope: function (startPoint, endPoint) {
            var run = endPoint.x - startPoint.x;
            var rise = endPoint.y - startPoint.y;

            if (run == 0)
                if (rise == 0)
                    return 0; // just a point, not really a line
                else
                    return null; // divide by zero, undefined slope!

            return rise / run;
        },
        measureDistance: function (startPoint, endPoint) {
            var slope = GeometryUtility.calculateSlope(startPoint, endPoint);

            if (slope == 0)
                return Math.abs(endPoint.x - startPoint.x);
            else if (slope == null)
                return Math.abs(endPoint.y - startPoint.y);

            var length = Math.abs(endPoint.x - startPoint.x);
            var height = Math.abs(endPoint.y - startPoint.y);

            return Math.sqrt(Math.pow(length, 2) + Math.pow(height, 2));
        },
        getYOffset: function (point, slope) {
            /// <param name="point" type="Vector2D" />
            /// <param name="slope" type="number" />

            return point.y - (point.x * slope);
        }
    };

})();


Array.prototype.random = function () {
    return this[Utility.getRandomNumber(0, this.length - 1)];
};

Array.prototype.generateUniquePairs = function (array) {
    var pairs = [];

    for (var i = 0; i < array.length; i++)
        for (var j = 0; j < this.length; j++)
            pairs.push(array[i], this[j]);

    return pairs;
};