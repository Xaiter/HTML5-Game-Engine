function Network() {

}

Network.prototype.ajaxGet = function (url) {
    return $.ajax(url);
};
Network.prototype.getJSON = function (url) {
    return $.ajax({
        url: url,
        dataType: 'json',
    });
};
