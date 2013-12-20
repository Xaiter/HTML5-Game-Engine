function GridClass(width, height) {

    // Fields
    this._array = [];

    // Properties
    this.height = height;
    this.width = width;

    // Initialization
    var row = null;
    for (var h = 0; h < height; h++) {
        row = [];
        for (var w = 0; w < width; w++)
            row.push(null);
        this._array.push(row);
    }

}
GridClass.prototype.get = function (x, y) {
    return this._array[Math.floor(y)][Math.floor(x)];
};
GridClass.prototype.set = function (x, y, value) {
    this._array[y][x] = value;
};
GridClass.prototype.renderTable = function () {

    var table = $("<table class='grid-table'></table>");

    for (var h = 0; h < this.height; h++) {
        var row = $("<tr></tr>");
        for (var w = 0; w < this.width; w++) {
            var cell = $("<td></td>").text(this.get(w, h));
            row.append(cell);
        }
        table.append(row);
    }

    $(document.body).append(table);
};
GridClass.prototype.createArray = function () {

    var array = [];
    for (var y = 0; y < this.height; y++)
        for (var x = 0; x < this.width; x++)
            array.push(this.get(x, y));

    return array;
};