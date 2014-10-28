function Block(id){ this.init(id); }
Block.list = {};

Block.type = {
    SPAWN: -1,
    AIR: 0,
    SOLID: 1,
    CAMERA: 2
};

Block.prototype.init = function(id){
    this.id = id;
    this.entity = null;
    this.parent = null;
    this.attr = {
        polygon: null,
        height: null,
        sprite: null,
        flip: [],
        props: {},
        components: {},
        events: {},
        collide: {},
        offset: [0,0],
        origin: [0,0],
        clr: [0,0],
        isoOffset: [0,0],
        placeOffset: [0,0]
    };
    Block.list[id] = this;
};

Block.prototype.getEntity = function(){
    return this.entity;
};

Block.prototype.build = function(){
    var entity = Crafty.e("2D, "+(ORIGIN_DEBUG ? "Draggable, " : "")+", "+RENDER+", "+(this.attr.polygon !== null ? "Collision, " : "")+"Isometric, " + (this.attr.components.length > 0 ? ", " + this.attr.components.join(', ') : "")+", "+this.attr.sprite)
        .isometric();
    if(this.attr.polygon !== null)
        entity.collision.apply(entity, JSON.parse(this.attr.polygon));
    for(var i = 0; i < this.attr.flip.length; i++)
        entity.flip(this.attr.flip[i].toUpperCase().trim());
    for(var key in this.attr.props)
        if(this.attr.props.hasOwnProperty(key))
            entity[key] = this.attr.props[key];
    for(var event in this.attr.events)
        if(this.attr.events.hasOwnProperty(event))
            entity.bind(event.trim(), this.attr.events[event]);
    for(var target in this.attr.collide)
        if(this.attr.collide.hasOwnProperty(target))
            if(this.attr.collide[target].length > 1)
                entity.onHit(target.trim(), this.attr.collide[target][0], this.attr.collide[target][1]);
            else
                entity.onHit(target.trim(), this.attr.collide[target][0], this.attr.collide[target][1]);
    entity.iso.set({
        "offset": this.attr.offset,
        "h": this.attr.height,
        "origin": this.attr.origin,
        "clrOffset": this.attr.clr,
        "isoOffset": this.attr.isoOffset,
        "placeOffset": this.attr.placeOffset
    });
    entity.blockId = this.id;
    entity.parent = this;
    if(ORIGIN_DEBUG){
        entity.debug = {};
        entity
            .bind("StartDrag", function(){
                if(typeof this.debug.origin === "undefined")
                    this.debug.origin = [this.x, this.y];
                this.alpha = 0.5;
            })
            .bind("StopDrag", function(){
                console.debug("Origin: ", this.debug.origin[0] - this.x, this.debug.origin[1] - this.y);
                this.alpha = 1;
            });
    }
    this.entity = entity;
    return entity;
};

Block.prototype.set = function(attr){
    for(var attrName in attr)
        if(attr.hasOwnProperty(attrName))
            if(typeof this.attr[attrName] !== "undefined")
                this.attr[attrName] = attr[attrName];
    return this;
};

Block.create = function(id, attr){
    return new Block(id).set(attr);
};

Block.extend = function(id, fid){
    return Block.create(id, Block.get(fid) !== null ? Block.get(fid).attr : {} );
};

Block.get = function(id){
    if(typeof Block.list[id] !== "undefined")
        return Block.list[id];
    return null;
};