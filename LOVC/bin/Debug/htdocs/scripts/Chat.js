var CHAT = {
    STACK: 0,
    NORMAL: 0,
    SHOUT: 1,
    WHISPER: 2
};

/*Crafty.c("ChatBox", {
    init: function(){
        if(!this.has("HTML"))
            this.addComponent("HTML");
        this.replace('<div id="chatbox"><message><name>Мечислав</name>HELLO WORLD! :DD</message></div>');
        this.x = 180;
        this.h = 70;
        this.y = GAME_HEIGHT - (this.h + 35);
        this.w = GAME_WIDTH - (this.x + 5);
        this.$dom = $("#chatbox");
    },
    println: function(name, text){
        this.$dom.append('<message><name>'+name+'</name>'+text+'</message>\r\n');
        ScrollDown("chatbox");
    }
});*/

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
        this.Head = Crafty.e("2D, " + RENDER + ", @ActorModel::Character").attr({"x": 28, "z":GUI_Z,"w":64,"h":128,"y": GAME_HEIGHT - offset - 36}).crop(0, 0, 64, 72);
        this.replace('<div class="MessageInput" id="'+this.domId+'"><label></label><input type="text" maxlength="'+MAX_CHAT_LENGTH+'" placeholder="'+l("Chat...")+'" /></div>').attr({"x": offset + 32, "y": GAME_HEIGHT - offset});
        this.$dom = $("#"+this.domId+" > input[type=text]");
        this.$dom.css("max-width", GAME_WIDTH - this.x - offset / 2);
        this.$dom.focus(input.pause);
        this.$dom.blur(input.resume);
        this.$dom.bind("change paste keydown keyup", function(){
            var $self = this;
            //setTimeout(function(){
                var Label = $(".MessageInput > label");
                Label.html("["+escapeHtml($self.value).split(' ').join('&nbsp;')+"]");
                $self.style.width = (Label.width()+5) + "px";
            //}, 25);
        });
        this.$dom.keydown(function(e){
            if(e.keyCode == 13){
                var val = this.value.trim();
                this.value = "";
                if(val.length <= 0) return;
                var mode = 0;
                if(e.altKey)
                    mode = 2;
                else if(e.shiftKey)
                    mode = 1;

                network.invoke("PlayerSay", val, mode);

                if(val[0] == "/" || val[0] == "!"){
                    var proceed = false;
                    if(val.length > 1){
                        var args = val.substring(1).split(' ');
                        var cmd = args[0].toLowerCase();
                        if(cmd == "me" && args.length > 1){
                            val = args[1];
                            mode = 3;
                            proceed = true;
                        }
                        else if(cmd == "goto" && args.length > 1){
                            goto(args[1]);
                        }
                    }
                    if(!proceed) return;
                }

                player.say(val, mode);
                //chatbox.println("Мечислав", val);
            }
        });
    }
});

Crafty.c("ChatBubble", {
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
        //this.stack_id = this.stack.length;
        CHAT.STACK += 1;
        this.id = CHAT.STACK;
        this.domId = "ChatMessage_" + CHAT.STACK;
        this.message = "";
        this.css("visibility", "hidden");
        this.replace('<ChatBubble><ChatBubbleLeft><!--<img src="'+format(CHARACTER_HEAD_URL,"Character")+'" />--></ChatBubbleLeft><ChatBubbleMessage id="'+this.domId+'"></ChatBubbleMessage></ChatBubble>');
        this.$dom = $("#" + this.domId);
        //this.stack.push(this);
    },

    text: function(text, mode){
        if(arguments.length === 0)
            return this.message;
        if(!mode) mode = "Normal";
        else if(mode == 1) mode = "Shout";
        else if(mode == 2) mode = "Whisper";
        else if(mode == 3) mode = "Action";
        this.message = replaceLinks(escapeHtml(text));
        this.$dom.html(this.message);
        if(mode == 3){
            this.$dom.append("*");
            this.$dom.prepend("*");
        }
        this.$dom.addClass("ChatMessage-" + mode);
        return this;
    },

    center: function(){
        this.x = this.x - (this.$dom.width()-28)/2;
        return this;
    },

    float: function(){
        var $this = this;
        this.tween({"y": this.h}, this.y+this.h+(this.message.length*3));
        this.bind("TweenEnd", function(e){
             if(e == "y")
                $this.tween({"y": -$this.h,"alpha": 0}, $this.h*2);
             else if(e == "alpha"){
                 this.$dom.remove();
                 this.destroy();
                 $this = null;
                 if(DEBUG)
                 console.log("[chat] Destroyed bubble " + this.id);
             }
         });
        //this.alpha = 1;
        //this.alpha_down = false;
        //for(var i = 0; i < this.stack.length; i++)
        //    if(typeof this.stack[i] == "object")
        //        this.stack[i].y -= $this.h;
        /*this.timer = setInterval(function(){
         $this.y -= $this.h;
         if($this.y < -$this.h){
         clearInterval($this.timer);
         $this.$dom.remove();
         $this.destroy();
         //delete $this.stack[$this.stack_id];
         }
         if($this.y < $this.h && !$this.alpha_down){
         //$this.alpha_down = true;
         //$this.tween({"alpha":0}, 40);
         }
         }, 1000);*/
    }
});