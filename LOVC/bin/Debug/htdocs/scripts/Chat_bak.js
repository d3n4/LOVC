Crafty.c("ChatInput", {
    id: 0,
    init: function(){
        var $this = this;
        this.id++;
        if(!this.has("2D"))
            this.addComponent("2D");
        if(!this.has("HTML"))
            this.addComponent("HTML");
        if(!this.has("DOM"))
            this.addComponent("DOM");
        if(!this.has("HUD"))
            this.addComponent("HUD");
        this.domId = "MessageInput_"+this.id;
        var offset = CHAT_INPUT_OFFSET;
        this.Head = Crafty.e("2D, " + RENDER + ", @ActorModel::DENFER2:Head").attr({"x": 20, "z":GUI_Z,"w":78,"h":128,"y": GAME_HEIGHT - offset - 25});
        this.replace('<div class="MessageInput" id="'+this.domId+'"><label></label><input type="text" maxlength="'+MAX_CHAT_LENGTH+'" placeholder="Чат..." /></div>').attr({"x": offset + 32, "y": GAME_HEIGHT - offset});
        this.$dom = $("#"+this.domId+" > input[type=text]");
        this.$dom.css("max-width", GAME_WIDTH - this.x - offset);
        this.$dom.focus(input.pause);
        this.$dom.blur(input.resume);
        this.$dom.bind("change paste keydown keyup", function(){
            var Label = $(".MessageInput > label");
            Label.html("["+escapeHtml(this.value).split(' ').join('&nbsp;')+"]");
            this.style.width = (Label.width()+5) + "px";
        });
        this.$dom.keydown(function(e){
            if(e.keyCode == 13){
                var val = this.value;
                this.value = "";
                if(val.trim().length <= 0) return;
                var mode = 0;
                if(e.altKey)
                    mode = 2;
                else if(e.shiftKey)
                    mode = 1;
                $this.trigger("ChatSay", {"mode": mode, "message": val});
            }
        });
        this.bind("ChatSay", function(e){
            Crafty.e("ChatBubble").text(e.message, e.mode).attr({"x": player.entity.x, "y": player.entity.y}).center().float();
        });
    }
});

Crafty.c("ChatBubble", {
    stack: [],
    init: function(){
        if(!this.has("2D"))
            this.addComponent("2D");
        if(!this.has("Tween"))
            this.addComponent("Tween");
        if(!this.has("HTML"))
            this.addComponent("HTML");
        if(!this.has("DOM"))
            this.addComponent("DOM");
        this.h = 20;
        this.stack_id = this.stack.length;
        this.domId = "ChatMessage_" + this.stack.length;
        this.css("visibility", "hidden");
        this.replace('<ChatBubble><ChatBubbleLeft><img src="http://46.211.56.229/LOVC/gamedata/character/model/head.png" /></ChatBubbleLeft><ChatBubbleMessage id="'+this.domId+'"></ChatBubbleMessage></ChatBubble>');
        this.$dom = $("#" + this.domId);
        this.stack.push(this);
    },

    text: function(text, mode){
        if(!mode) mode = "Normal";
        else if(mode == 1) mode = "Shout";
        else if(mode == 2) mode = "Whisper";
        this.$dom.html(replaceLinks(escapeHtml(text)));
        this.$dom.addClass("ChatMessage-" + mode);
        return this;
    },

    center: function(){
        this.x = this.x - (this.$dom.width()/2) + 12;
        return this;
    },

    float: function(){
        var $this = this;
        this.alpha = 1;
        this.alpha_down = false;
        for(var i = 0; i < this.stack.length; i++)
            if(typeof this.stack[i] == "object")
                this.stack[i].y -= $this.h;
        this.timer = setInterval(function(){
            $this.y -= $this.h;
            if($this.y < -$this.h){
                $this.$dom.remove();
                $this.destroy();
                clearInterval($this.timer);
                delete $this.stack[$this.stack_id];
            }
            if($this.y < $this.h && !$this.alpha_down){
                $this.alpha_down = true;
                $this.tween({"alpha":0}, 40);
            }
        }, 3000);
    }
});