var SpaceManager = new (function(){
    var $this = this;
    this.spaces = {};
    this.currentSpace = null;
    this.set = function(space){
        var oldSpace = $this.spaces[$this.currentSpace];
        if(typeof oldSpace !== "undefined")
            oldSpace.destroy();
        $this.spaces[space.id] = space;
        $this.currentSpace = space.id;
    };
    this.getRoomList = function(){
        modal.show($l("Rooms"), '<center><img src="'+HOST_URI+'/img/load.gif"></center>');
        network.invoke("GetRooms");
    };
    this.displayRooms = function(rooms){
        /*
         capacity: 200
         count: 2
         description: null
         dislikes: 0
         id: "lobby"
         likes: 0
         name: "roomlobby"
         owner: "12075682"
        */
        var clicked = false;
        modal._body.html("");
        for(var roomId = 0; roomId < rooms.length; roomId++){
            var r = rooms[roomId];
            console.log("ROOM: ", r.id, r);
            var roomLink = modal._body.append(
                '<modalLink onclick="goto(\''+ r.id +'\'); return false;">' +
                    '<left>'+ r.name+'</left>' +
                    '<right>'+ r.count + '/' + r.capacity + '</right>' +
                '</modalLink>\r\n'
            );
        }
    };
});

function Space(id) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.offset = [0,123];
    this.model = [];
    this.bounds = [];
    this.graph = {};
    this.objectsModel = {};
    this.cams = [];
    this.spawn = [0,0,0];
    SpaceManager.set(this);
}

Space.prototype.updateGraph = function(){
    /*var _bounds = [];
    for(var x = 0; x < this.bounds.length; x++)
        for(var y = 0; y < this.bounds[y].length; y++){
            if(typeof _bounds[x] === 'undefined')
                _bounds[x] = [];
            if(typeof _bounds[x][y] === 'undefined')
                _bounds[x][y] = [];
            _bounds[x][y] = this.bounds[x][y];
        }*/
    this.graph = new Graph(this.bounds);
};

Space.fromNativeModel = function(id, model){
    return new Space(id).fromModel(JSON.parse(model)).build();
};

Space.prototype.fromModel = function(model){
    this.model = model;
    this.w = model[0].length;
    this.h = model[0][0].length;
    this.x = (this.h * Isometric.tileSize.w / 2 - Isometric.tileSize.w) + this.offset[0];
    this.y = this.offset[1];
    this.bounds = model[0];
    this.updateGraph();
    return this;
};

Space.prototype.switchCam = function(camId){
    if(typeof this.cams[camId] !== "object") return;
    var cam = this.cams[camId];
    Crafty.viewport.x = -(cam[1][0]+this.x-GAME_WIDTH/2);
    Crafty.viewport.y = -(cam[1][1]+this.y-GAME_HEIGHT/2);
};

Space.prototype.findNearbyCam = function(from, autoSwitch){
    autoSwitch = typeof autoSwitch === "undefined" ? false : autoSwitch;
    var lastLength = null, lastCam = null;
    for(var camId = 0; camId < this.cams.length; camId++){
        var camIsoVec = this.cams[camId];
        var deltaX = camIsoVec[0][0] - from.x;
        var deltaY = camIsoVec[0][1] - from.y;
        var length = (deltaX * deltaX) + (deltaY * deltaY);
        if(lastCam !== null && lastLength !== null){
            if(length < lastLength){
                lastCam = camId;
                lastLength = length;
            }
        } else {
            lastCam = camId;
            lastLength = length;
        }
    }
    if(autoSwitch)
        this.switchCam(lastCam);
    return lastCam;
};

Space.prototype.build = function(){
    for(var tl = 0; tl < this.model.length; tl++)
        for(var tx = 0; tx < this.model[tl].length; tx++)
            for(var ty = 0; ty < this.model[tl][tx].length; ty++){
                var blockId = parseInt(this.model[tl][tx][ty]);
                if(typeof this.objectsModel[tl] !== "object")
                    this.objectsModel[tl] = {};
                if(typeof this.objectsModel[tl][tx] !== "object")
                    this.objectsModel[tl][tx] = {};
                if(typeof this.objectsModel[tl][tx][ty] !== "object")
                    this.objectsModel[tl][tx][ty] = {};
                if(blockId === Block.type.CAMERA){
                    this.cams.push([[tx,ty],Isometric.toScreen(tx, ty)]);
                } else if(blockId === Block.type.AIR){
                } else if(blockId === Block.type.SOLID){
                } else if(blockId === Block.type.SPAWN){
                    this.spawn = [tx, ty, 0];
                } else {
                    this.objectsModel[tl][tx][ty] = Block.get(blockId)
                        .build()
                        .attr({"space": this})
                        .iso.set({"offset":[this.x,this.y]})
                        .iso.place(tx,ty,0);
                }
            }
    return this;
};

Space.prototype.destroy = function(){
    for(var l in this.objectsModel)
    if(this.objectsModel.hasOwnProperty(l))
    for(var x in this.objectsModel[l])
    if(this.objectsModel[l].hasOwnProperty(x))
    for(var y in this.objectsModel[l][x])
    if(this.objectsModel[l][x].hasOwnProperty(y))
    {
        var obj = this.objectsModel[l][x][y];
        if(typeof obj.destroy === "function")
            obj.destroy();
    }
};

Space.prototype.place = function(obj, x, y, z){
    if(typeof x === "object"){
        y = x.y;
        z = x.z;
        x = x.x;
    }
    return obj.attr({"space":this}).iso.set({"offset":[this.x,this.y]}).iso.place(x,y,z);
};

Space.prototype.load = function(map){

};