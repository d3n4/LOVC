function Actor(id, w, h){
    if(DEBUG)
        console.log("Create actor " + id);
    var $this = this;
    this.name = "";
    this.id = id;
    this.w = w ? w : ACTOR_WIDTH  / 5;
    this.h = h ? h : ACTOR_HEIGHT / 5;
    this.actorModel = "@ActorModel::"+id;
    this.animationSpeed = 12;
    this.side = "SE";
    this.step = null;
    this.position = [0,0,0];
    if(typeof Actor._models !== "object") Actor._models = {};
    if(typeof Actor._models[this.actorModel] === "undefined"){
        var model_map = {};
        model_map[this.actorModel] = [0,0];
        Actor._models[id] = Crafty.sprite(this.w,this.h,format(CHARACTER_URL, id)+"?v="+VERSION,model_map);
    }
    this.entity = Crafty.e("2D, " + RENDER + ", " + this.actorModel + ", Keyboard, Tween, Isometric, SpriteAnimation")
        .animate("Watch_SE", 0, 0, 0)
        .animate("Watch_SW", 0, 1, 0)
        .animate("Watch_NE", 0, 2, 0)
        .animate("Watch_NW", 0, 3, 0)

        .animate("Walk_SE", 1, 0, 4)
        .animate("Walk_SW", 1, 1, 4)
        .animate("Walk_NE", 1, 2, 4)
        .animate("Walk_NW", 1, 3, 4)

        .animate("Sit_SE", 0, 4, 0)
        .animate("Sit_SW", 1, 4, 1)
        .animate("Sit_NE", 2, 4, 2)
        .animate("Sit_NW", 3, 4, 3)

        .bind("MoveStep", function(e){
            $this.side = e.direction;
            $this.step = e;
            var animationDirection = "Walk_" + e.direction;
            if(!this.isPlaying(animationDirection)){
                this.reset();
                this.animate(animationDirection, $this.animationSpeed, -1);
            }
            $this.position = e.to;
        })

        .bind("MoveDone", function(){
            $this.setWatchAnimation($this.side);
            var obj = GameObject.objects[$this.position[0]+"x"+$this.position[1]+"x"+$this.position[2]];
            if(typeof obj === "object"){
                if(typeof obj.onInteract === "function")
                    obj.onInteract($this);
                this.trigger("ObjectInteraction", obj);
            }
        })

        .bind("MoveChange", function(){
            $this.setWatchAnimation($this.side);
        })

        .isometric()
        .iso.set({
            "h": 80,
            "origin": [0,120],
            "objOffset": [0,86]
        });

    this.getReverseDirection = function(side){
        if(typeof side !== "string")
            side = this.side;
        if(side == "SE")
            return "NW";
        if(side == "NW")
            return "SE";
        if(side == "NE")
            return "SW";
        if(side == "SW")
            return "NE";
        return "SE";
    };

    this.destroy = function(){
        this.entity.destroy();
    };

    this.setName = function(name){
        this.name = name;
        return this;
    };

    this.say = function(message, mode){
        if(DEBUG)
            console.log("[chat] Actor " + id + " "+(function(){ if(mode == 1) return "Shout"; else if(mode == 2) return "Whisper"; return "Say" })()+": " + message);
        // chatbox.println(id, message);
        Crafty.e("ChatBubble").text(message, mode).attr({"x": $this.entity.x, "y": $this.entity.y}).center().float();
    };

    this.attr = function(e){
        this.entity.attr(e);
        return this;
    };

    this.move = function(x, y, path){
        return $this.entity.move(x,y,path);
    };

    this.setStaticAnimation = function(name){
        if(DEBUG)
            console.log("Set actor "+ id +" animation to " + name);
        this.entity.animate(name, $this.animationSpeed, 0);
        return this;
    };

    this.setSitAnimation = function(direction){
        this.setStaticAnimation('Sit_'+direction.trim().toUpperCase());
    };

    this.setWalkAnimation = function(direction){
        this.setStaticAnimation('Walk_'+direction.trim().toUpperCase());
    };

    this.setWatchAnimation = function(direction){
        this.setStaticAnimation('Watch_'+direction.trim().toUpperCase());
    };

    this.setWatchAnimation(this.side);
}