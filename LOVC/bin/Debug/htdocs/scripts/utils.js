function format(input){
    if(arguments.length > 1)
    for(var i = 1; i < arguments.length; i++)
        input = input.replace("{"+(i-1)+"}", arguments[i]);
    return input;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function replaceLinks(text){
    var exp = /(\b(http|https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,'<a href="$1" target="_blank">$1</a>');
}


var modal = new (function(){
    this._main = $("#modal");
    this._title = this._main.find(".modal-header > h3");
    this._body = this._main.find(".modal-body");
    this._footer = this._main.find(".modal-footer");
    this.show = function(title, content, footer){
        this._title.html(title);
        this._body.html(content);
        this._footer.html(footer);
        this._main.modal("show");
    };
    this.hide = function(){
        this._main.modal("hide");
        this._title.html("");
        this._body.html("");
        this._footer.html("");
    };
    this.close = this.hide;
});

function getQueryArgs() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&");
    for(var i=0; i<__GET.length; i++) {
        var getVar = __GET[i].split("=");
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
    }
    return $_GET;
}

function ScrollDown(id){
    var doc = document.getElementById(id);
    doc.scrollTop = doc.scrollHeight;
}

function ScrollDownDom(dom){
    dom.scrollTop = dom.scrollHeight;
}