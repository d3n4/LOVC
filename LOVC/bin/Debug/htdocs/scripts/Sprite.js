function Sprite(){}
Sprite.list = {};
Sprite.cache = {};
Sprite.id = 0;

Sprite.get = function(width, height, uri, map){
    if(typeof Sprite.list[uri] !== "undefined" && typeof map !== "object")
        return Sprite.list[uri];
    var id = "SPRITE:"+Sprite.id;
    Sprite.id++;
    var _map = {};
    if(typeof map === "object")
        _map = map;
    else
        _map[id] = [0,0];
    if(typeof Sprite.cache[uri] === "undefined")
        Sprite.cache[uri] = Crafty.sprite(width,height,GAMEDATA+uri+"?v="+VERSION,_map);
    Sprite.list[uri] = id;
    if(typeof map === "object"){
        var elems = [];
        for(var spr in map)
            if(map.hasOwnProperty(spr))
                elems.push(spr);
        return elems;
    }
    return id;
}