// _x - screen x
// _y - screen y
// z - iso z (axis running from the screens top to its bottom)
//this.swapDepths(this._x+this.z*500+this._y*1000);

//depth=x+y*width

Isometric = function (maxx, maxz) {
    this.maxx = maxx;
    this.maxz = maxz;
    this.theta = 30;
    this.alpha = 45;
    this.theta *= Math.PI/180;
    this.alpha *= Math.PI/180;
    this.sinTheta = Math.sin(this.theta);
    this.cosTheta = Math.cos(this.theta);
    this.sinAlpha = Math.sin(this.alpha);
    this.cosAlpha = Math.cos(this.alpha);
    this.leeway = 5;
};

Isometric.side2dir = function(id){
    if(id == 0)
        return "SE";
    else if(id == 1)
        return "SW";
    else if(id == 2)
        return "NW";
    else if(id == 3 )
        return "NE";
    return "SE";
};

Isometric.tileSize = {"w": 64, "h": 32};

Isometric.prototype.mapToScreen = function(xpp, ypp, zpp) {
    return [xpp*this.cosAlpha+zpp*this.sinAlpha, ypp*this.cosTheta-(zpp*this.cosAlpha-xpp*this.sinAlpha)*this.sinTheta];
};

Isometric.prototype.mapToIsoWorld = function(screenX, screenY) {
    var z = (screenX/this.cosAlpha-screenY/(this.sinAlpha*this.sinTheta))*(1/(this.cosAlpha/this.sinAlpha+this.sinAlpha/this.cosAlpha));
    var x = (1/this.cosAlpha)*(screenX-z*this.sinAlpha);
    return [x, z];
};

Isometric.prototype.setLeeWay = function(value) {
    this.leeway = value;
};

Isometric.prototype.calculateDepth = function(x, y, z) {
    x = Math.abs(x)*this.leeway;
    y = Math.abs(y);
    z = Math.abs(z)*this.leeway;
    var a = this.maxx;
    var b = this.maxz;
    var floor = a*(b-1)+x;
    return a * (z - 1) + x + floor * y;
};

Isometric.default = new Isometric(GAME_WIDTH, GAME_HEIGHT);
Isometric.defaultSize = {"w": 64, "h": 39};
Isometric.size = Isometric.default.mapToIsoWorld(Isometric.defaultSize.w,0);

Isometric.fromScreen = function(x, y, offset_ref, floor){
    var vec = Isometric.default.mapToIsoWorld(x+offset_ref[0]+Isometric.defaultSize.w,y+offset_ref[1]);
    return [Math.ceil(vec[0]/Isometric.size[0]-22), Math.ceil((-vec[1]/Isometric.size[1])+6)];
};

Isometric.toScreen = function(x,y){
    return Isometric.default.mapToScreen(x*Isometric.size[0],0,-y*Isometric.size[0]);
};

Crafty.c("Isometric", {
    init: function(){
        if(!this.has("Tween"))
            this.addComponent("Tween");
    },
    moveTo: [0,0],
    _tweenEnd: null,
    iso_x: 0, iso_y: 0, iso_z: 0,
    isometric: function(){
        this.bind("TweenEnd", function(direction){if(typeof this._tweenEnd === "function") this._tweenEnd(direction);});
        var $this = this;
        var sizeDiff = this._w-Isometric.defaultSize.w;
        this.bind("EnterFrame", function(){
            if(this.iso){
                var modified = false;
                if(this.iso.x !== this.iso_x){
                    this.iso.x = this.iso_x;
                    modified = true;
                }
                if(this.iso.y !== this.iso_y){
                    this.iso.y = this.iso_y;
                    modified = true;
                }
                if(this.iso.z !== this.iso_z){
                    this.iso.z = this.iso_z;
                    modified = true;
                }
                if(modified)
                    this.iso.place(this.iso.x, this.iso.y, this.iso.z);
            }
        });
        this.iso = {
            x: 0,
            y: 0,
            z: 0,
            w: 64,
            h: 0,
            depth: 0,
            origin: [0,0],
            offset: [0,0],
            objOffset: [0,0],
            clrOffset: [0,0],
            isoOffset: [0,0],
            margin: 0,
            sizeDiff: sizeDiff,
            placeOffset: [0,0],
            movementDuration: 30,
            fromH: false,

            getZ: function(){
                var vec = Isometric.default.mapToIsoWorld($this.x+$this.iso.origin[0], $this.y+$this.iso.origin[1]+$this.iso.z);
                var depth = Math.ceil(vec[0]+vec[1]*-1);
                $this.iso.depth = depth;
                return depth;
            },

            move: function(x, y, z){
                if(typeof x !== "number") x = $this.iso.x;
                if(typeof y !== "number") y = $this.iso.y;
                if(typeof z !== "number") z = $this.iso.z;
                $this.tween({"iso_x": x, "iso_y": y, "iso_z": z}, $this.iso.movementDuration);
            },

            update: function(){
                $this.x -= $this.iso.objOffset[0];
                $this.y -= $this.iso.objOffset[1];
                $this.z = $this.iso.getZ();
                $this.x -= sizeDiff / 2;
                $this.y -= (sizeDiff !== 0 ? $this._w+sizeDiff-(sizeDiff/2) : 0);
                $this.x -= $this.iso.clrOffset[0];
                $this.y -= $this.iso.clrOffset[1];
                $this.y -= $this.iso.z * $this.iso.h;
                return $this;
            },

            set: function(attr){
                for(var attrName in attr)
                    if(attr.hasOwnProperty(attrName))
                        this[attrName] = attr[attrName];
                return $this;
            },

            getDirectionEx: function(cx, cy, px, py){
                var dif_x = cx-px;
                var dif_y = cy-py;
                var direction = "S";
                if(dif_x == 1 && dif_y == 1)
                    direction = "S";
                if(dif_x == 0 && dif_y == 1)
                    direction = "SW";
                if(dif_x == 1 && dif_y == 0)
                    direction = "SE";
                if(dif_x == 0 && dif_y == -1)
                    direction = "NE";
                if(dif_x == -1 && dif_y == 0)
                    direction = "NW";
                if(dif_x == 1 && dif_y == -1)
                    direction = "E";
                if(dif_x == -1 && dif_y == 1)
                    direction = "W";
                if(dif_x == -1 && dif_y == -1)
                    direction = "N";
                return direction;
            },

            getDirectionFrom: function(from, to){
                return $this.iso.getDirectionEx(to[0],to[1],from[0],from[1]);
            },

            getDirection: function(x, y){
                return this.getDirectionEx(x, y, $this.iso.x, $this.iso.y);
            },

            getScreen: function(x,y,z){
                z = z ? z : 0;
                x += $this.iso.placeOffset[0];
                y += $this.iso.placeOffset[1];
                var pos = Isometric.default.mapToScreen(x*Isometric.size[0]+$this.iso.isoOffset[0],$this.iso.margin,-y*Isometric.size[0]+$this.iso.isoOffset[1]);
                return [
                    pos[0]+$this.iso.offset[0]-(sizeDiff / 2)-$this.iso.objOffset[0]-$this.iso.clrOffset[0],
                    pos[1]+$this.iso.offset[1]-(z*$this.iso.h)-(sizeDiff !== 0 ? $this._w+sizeDiff-(sizeDiff/2) : 0)-$this.iso.objOffset[1]-$this.iso.clrOffset[1] - ($this.iso.fromH ? $this.iso.h : 0)
                ];
            },

            place: function(x, y, z){
                x += $this.iso.placeOffset[0];
                y += $this.iso.placeOffset[1];
                $this.iso.x = x;
                $this.iso.y = y;
                if(z) $this.iso.z = z;
                $this.iso_x = $this.iso.x;
                $this.iso_y = $this.iso.y;
                $this.iso_z = $this.iso.z;
                var pos = Isometric.default.mapToScreen(x*Isometric.size[0]+$this.iso.isoOffset[0],$this.iso.margin,-y*Isometric.size[0]+$this.iso.isoOffset[1]);
                $this.x = pos[0]+$this.iso.offset[0];
                $this.y = pos[1]+$this.iso.offset[1];
                $this.iso.update();
                return $this;
            }
        };
        /*var _objs = [];
        var _path = [];
        this.bind("MoveDone", function(){
            for(var j = 0; j < _path.length; j++)
                _path[j].destroy();
        });
        this.bind("MoveStart", function(path){
            for(var j = 0; j < _path.length; j++)
                _path[j].destroy();
            for(var i = 0; i < path.length; i++){
                var node = path[i];
                var obj = Block.get(3).build().addComponent("SpriteColor").spriteColor("#0000FF");
                this.space.place(obj, node.x, node.y);
                _path.push(obj);
            }
        });
        this.bind("MoveStep", function(e){
            var pobj = _objs[_objs.length-1];
            var dobj = _objs[_objs.length-2];
            if(pobj)
                pobj.spriteColor("#FF0000");
            if(dobj)
                dobj.destroy();
            var obj = Block.get(3)
                .build().addComponent("SpriteColor").spriteColor("#00FF00");
            _objs.push(obj);
            this.space.place(obj, e.to[0], e.to[1], 0);
        });*/
        return this;
    },

    _getPath: function(x, y){
        return astar.search(this.space.graph.nodes,
            this.space.graph.nodes[Math.round(this.iso.x)][Math.round(this.iso.y)],
            this.space.graph.nodes[x][y], ASTAR_DIAGONAL);
    },

    _moving: false,
    _path: [],

    move: function(x, y, path){
        if(this.iso_x == x && this.iso_y == y)
            return this;
        var $this = this;
        this._done = false;
        if(typeof this.space !== "object") return this;
        if(this._moving){
            if($this.moveTo[0] === x && $this.moveTo[1] === y)
                return this;
            this.trigger("MoveChanged", {"from":$this._path});
            $this._path = [];
            this._tweenEnd = function(){
                $this.trigger('MoveChangeDone');
                $this._moving = false;
                $this.move(x,y);
            };
            return this;
        }
        if(path)
            this._path = path;
        else
            this._path = this._getPath(x, y)/*.splice(0)*/;
        if(this._path.length > 0)
            this._moving = true;
        else
        {
            this.moveStop();
            return this;
        }
        this.trigger("MoveBegin", [x,y]);

        this.trigger("MoveStart", $this._path);
        this.moveTo = [x,y];

        if(DEBUG)
            console.log("Move actor from ", this.iso_x, this.iso_y, " to ", x, y);

        var node = [Math.round(this.iso.x),Math.round(this.iso.y)];
        var prev_node = null;
        var step = function(){
            if($this._path.length <= 0 && !$this._done)
                $this.moveStop();
            else if($this._moving) {
                prev_node = node;
                node = $this._path.shift();
                node = [node.x,node.y,$this.iso.z];
                $this.trigger('MoveStep', {"from":prev_node,"to":node,"direction":$this.iso.getDirectionFrom(prev_node, node)});
                $this.iso.move(node[0], node[1]);
                $this._tweenEnd = step;
            }
        };
        if($this._path.length > 0)
            step();
        return this;
    },

    moveStop: function(){
        if(this._path.length > 0)
            this._path = [];
        this._done = true;
        this._moving = false;
        this.trigger('MoveDone');
    }
});