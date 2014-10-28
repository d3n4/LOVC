function GameObject(name){
    this.id = GameObject.stack;
    GameObject.stack += 1;
    this.name = name;
    this.sprites = [];
    this.origin = [0,0];
    this.sides = [];
    this.side = 0;
    this.isoSize = 1;
    this.type = "NONE";
    this.iso = {
        "x": 0,
        "y": 0,
        "z": 0
    };
    this.interacts = [];
    this.onInteract = function($actor){
        var trigger = GameObject.type[this.type];
        if(typeof trigger === "function")
            trigger.call(this, $actor);
    };
}

GameObject.stack = 0;

GameObject.type = {
    "NONE": null,
    "SEAT": function($actor){
        $actor.setSitAnimation(Isometric.side2dir(this.side));
    }
};

GameObject.cache = {};
GameObject.objects = {};

GameObject.prototype.sideTransform = function(offset){
    if(this.side == 0)
        return offset;
    else if(this.side == 1)
        return offset;
    else if(this.side == 2)
        return offset;
    else if(this.side == 3 )
        return offset;
    return offset;
};

GameObject.prototype.place = function(x, y, z){
    if(typeof GameObject.objects[this.iso.x+"x"+this.iso.y+"x"+this.iso.z] !== "undefined")
        delete GameObject.objects[this.iso.x+"x"+this.iso.y+"x"+this.iso.z];
    this.iso.x = x;
    this.iso.y = y;
    if(z) this.iso.z = z;
    if(typeof z !== "number") z = 0;
    var objs = this.sides[this.side];
    for(var i = 0; i < objs.length; i++){
        var obj = objs[i];
        obj.visible = true;
        obj.iso.place(x,y,z);
        var ox = x + this.sideTransform(obj.iso.placeOffset[0]);
        var oy = y + this.sideTransform(obj.iso.placeOffset[1]);
        GameObject.objects[ox+"x"+oy+"x"+z] = this;
        this.interacts.push([ox,oy,z]);
    }
    return this;
};

GameObject.prototype._hideSide = function(side){
    if(typeof this.sides[side] !== "undefined")
        for(var i = 0; i < this.sides[side].length; i++)
            this.sides[side][i].visible = false;
};

GameObject.prototype.clearInteracts = function(){
    for(var i = 0; i < this.interacts.length; i++){
        var location = this.interacts[i];
        delete GameObject.objects[location[0]+"x"+location[1]+"x"+location[2]];
    }
    this.interacts = [];
    return this;
};

GameObject.prototype.rotate = function(side){
    this.clearInteracts();
    this._hideSide(this.side);
    if(typeof side === "undefined")
        side = this.side+1;
    if(typeof this.sides[side] === "undefined")
        side = 0;
    this.side = side;
    this.place(this.iso.x, this.iso.y, this.iso.z);
    return this;
};

GameObject.load = function(file, offset, callback){
    $.getJSON(GAMEDATA+file+".json", function(obj) {
        var prototype = GameObject.create(obj.id, obj.sprite, obj.size[0], obj.size[1], offset, obj.map, obj.isoSize, obj.type);
        if(typeof callback === "function") callback(prototype);
    });
};

GameObject.get = function(objectID){
    return typeof GameObject.cache[objectID] !== "undefined" ?
        GameObject.create(
            objectID.substr(1),
            GameObject.cache[objectID][0],
            GameObject.cache[objectID][1],
            GameObject.cache[objectID][2],
            GameObject.cache[objectID][3],
            GameObject.cache[objectID][4],
            GameObject.cache[objectID][5],
            GameObject.cache[objectID][6]
        ) : null;
};

GameObject.create = function(objectID, uri, w, h, offset, subMap, size, type){
    objectID = "@" + objectID;
    var gameObject = new GameObject(objectID);
    gameObject.subMap = subMap;
    gameObject.origin = subMap.origin;
    var raw_spriteMap = {};
    var raw_sides = {};
    for(var sideId = 0; sideId < subMap.sides.length; sideId++){
        var raw_side = subMap.sides[sideId];
        for(var iso_offset in raw_side)
            if(raw_side.hasOwnProperty(iso_offset)){
                var side = raw_side[iso_offset];
                for(var side_dataId = 0; side_dataId < side.length; side_dataId++){
                    var iso_offsets = iso_offset.toLowerCase().split('x');
                    var side_data = side[side_dataId];
                    var spriteID = objectID+":"+sideId+":"+side_dataId+":"+iso_offset;
                    raw_spriteMap[spriteID] = side_data.frame;
                    if(typeof raw_sides[sideId] !== "object") raw_sides[sideId] = [];
                    var block = Block.get(spriteID);
                    if(block === null)
                        block = Block.create(spriteID, {
                            "polygon": typeof side_data.polygon !== "undefined" ? side_data.polygon : null,
                            "height": subMap.height,
                            "sprite": spriteID,
                            "offset": offset,
                            "origin": typeof side_data.origin !== "undefined" ? side_data.origin : subMap.origin,
                            "clr": side_data.offset,
                            "components": [objectID],
                            "placeOffset": [parseFloat(iso_offsets[0]),parseFloat(iso_offsets[1])],
                            "props": {"visible": false},
                            "flip": typeof side_data.flip === "object" ? side_data.flip : []
                        });
                    raw_sides[sideId].push(block);
                }
            }
    }
    gameObject.type = type.trim().toUpperCase();
    gameObject.isoSize = size;
    gameObject.sprites = Sprite.get(w, h, uri, raw_spriteMap);
    for(var sid in raw_sides){
        if(!raw_sides.hasOwnProperty(sid)) continue;
        var side_d = raw_sides[sid];
        for(var entId = 0; entId < side_d.length; entId++){
            if(typeof gameObject.sides[sid] !== "object")
                gameObject.sides[sid] = [];
            gameObject.sides[sid].push(side_d[entId].build());
        }
    }
    if(typeof GameObject.cache[objectID] === "undefined")
        GameObject.cache[objectID] = [uri,w,h,offset,subMap,size,type];
    return gameObject;
};