Crafty.c("SpriteColor", {
    _color: "rgba(0,0,0,0)",
    spriteColor: function(hexcolor, strength){
        this._color = Crafty.toRGB(hexcolor,strength);
        this.trigger("Change");
        return this;
    },
    _drawSpriteColor: function(){
        var co = this.__coord,
            ctx = this._spriteColorCanvas.getContext('2d');
        ctx.drawImage(this.img,
            co[0],
            co[1],
            co[2],
            co[3], 0, 0,
            this._w,
            this._h
        );
        ctx.save();
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = this._color;
        ctx.fillRect(0, 0, this._w, this._h);
        ctx.restore();
        Crafty.canvas.context.drawImage(this._spriteColorCanvas, this._x, this._y);
    },
    init: function(){
        this._spriteColorCanvas = document.getElementById('SpriteColorCanvas');
        if (!this._spriteColorCanvas){
            var c = document.createElement('canvas');
            c.id = 'SpriteColorCanvas';
            c.style.display = 'none';
            c.style.zIndex = '1000';
            Crafty.stage.elem.appendChild(c);
            this._spriteColorCanvas = c;
        }
        this
            .bind("Draw", this._drawSpriteColor)
            .bind("RemoveComponent", function(c) {
                if (c == "SpriteColor") this.unbind("Draw", this._drawSpriteColor);
            });
    }
});