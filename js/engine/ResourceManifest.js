// Constructor
function ResourceManifest(owningGame) {

    // Technical Properties
    this.game = owningGame;
    this.imageElements = $("#image-bank");
    this._loadCounter = 0;
    this._loadCompleteCallbacks = [];

    // Resource Data Properties
    this.images = {};


    // Initialization
    if (this.imageElements.length == 0) {
        this.imageElements = $("<div id='image-bank'></div>");
        $(document.body).append(this.imageElements);
    }
}

// Public Methods
ResourceManifest.prototype.loadImage = function (url) {

    var deferred = $.Deferred();
    if (this.isImageLoaded(url))
        return;

    var self = this;
    var errorCount = 0;
    var imgLoadErrorClosure = function () {
        errorCount++;
        $(this).remove();
        if (errorCount < 2)
            self.loadImage(url);
        else
            deferred.reject(url);
    };
    var imgLoadCompleteClosure = function () {
        self.images[url] = true;
        deferred.resolve(this);
    }

    var imgElement = $("<img />")
                        .load(imgLoadCompleteClosure)
                        .error(imgLoadErrorClosure)
                        .attr("src", url);

    this.imageElements.append(imgElement);
    return this._loadCounterPromiseWrapper(deferred.promise());

};
ResourceManifest.prototype.loadImageElement = function (imgElm) {
    this.imageElements.append(imgElm);
};
ResourceManifest.prototype.isImageLoaded = function (url) {
    return url in this.images;
};
ResourceManifest.prototype.isLoadingContent = function () {
    return this._loadCounter > 0;
};
ResourceManifest.prototype.onContentLoaded = function(callback) {
    this._loadCompleteCallbacks.push(callback);
    if (!this.isLoadingContent)
        this._fireContentLoadedCallbacks();
};


// Private Methods
ResourceManifest.prototype._fireContentLoadedCallbacks = function() {
    for (var i = 0; i < this._loadCompleteCallbacks.length; i++)
        this._loadCompleteCallbacks[i]();
};
ResourceManifest.prototype._loadCounterPromiseWrapper = function (promise) {

    this._loadCounter++;
    var self = this;
    var deferred = $.Deferred();

    promise.always(function () {
        self._loadCounter--;
    }).done(function () {
        deferred.resolve.apply(deferred, arguments);
        if (!self.isLoadingContent())
            self._fireContentLoadedCallbacks();
    }).fail(function () {
        deferred.reject.apply(deferred, arguments);
        if (!self.isLoadingContent())
            self._fireContentLoadedCallbacks();
    });

    return deferred.promise();
};