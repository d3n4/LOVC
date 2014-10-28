var NetworkSocket = window.WebSocket || window.MozWebSocket;

function Network(channel){
    var $this = this;
    if(typeof Network.connections[channel] !== "undefined")
        return Network.connections[channel];
    this.connections = {};
    this.functions = {};
    this.socket = null;
    this.connected = false;
    this.reconnect = true;
    this.timeout = 5000;

    if(DEBUG)
        console.log("[net] Connecting to channel " + channel);

    this.connect = function(){
        $this.socket = new NetworkSocket("ws://"+HOST_SOCKET+"/"+channel+"?"+window.location.search.substring(1));
        $this.socket.onmessage = function (e) {
            if(DEBUG)
                console.log("[net]["+channel+"] Message: " + e.data);
            var packet = JSON.parse(e.data);
            $this.trigger(packet["function"], packet["args"]);
        };

        $this.socket.onopen = function (e) {
            $this.connected = true;
            if(DEBUG)
                console.log("[net]["+channel+"] Connected ", e);
            $this.trigger("connect", e);
        };

        $this.socket.onclose = function (e) {
            $this.connected = false;
            if(DEBUG)
                console.log("[net]["+channel+"] Disconnect ", e);
            if($this.reconnect && !e.wasClean)
                setTimeout($this.connect, $this.timeout);
            $this.trigger("disconnect", e);
        };
        return this;
    };

    this.bind = function(func, callback, self){
        if(typeof this.functions[func] !== "object")
            this.functions[func] = [];
        this.functions[func].push([typeof self === "object" ? self : $this, callback]);
    };

    this.trigger = function(func, args){
        if(DEBUG)
            console.log("[net]["+channel+"] Trigger: "+func+"( ",args," )");
        if(typeof $this.functions[func] === "object")
            if(typeof $this.functions[func] === "object")
                for(var i = 0; i < $this.functions[func].length; i++)
                    $this.functions[func][i][1].apply($this.functions[func][i][0], args);
    };

    this.invoke = function(func){
        if(typeof $this.socket !== "object" || !$this.connected) return false;
        var args = [];
        for(var i = 1; i < arguments.length; i++)
            args.push(JSON.stringify(arguments[i]));
        $this.socket.send(JSON.stringify({"function": func, "args": args}));
        return true;
    };

    Network.connections[channel] = this;
}

Network.get = function(channel){
    var connection = Network.connections[channel];
    if(typeof connection !== "undefined")
        return connection;
    return null;
};

Network.views = 0;

Network.type = {
    "none": 0
};

Network.connections = {};