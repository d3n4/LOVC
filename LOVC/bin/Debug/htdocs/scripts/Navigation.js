Crafty.c("Navigation", {
    stack: [],
    init: function(){
        var $this = this;
        if(!this.has("2D"))
            this.addComponent("2D");
        if(!this.has("HTML"))
            this.addComponent("HTML");
        if(!this.has("DOM"))
            this.addComponent("DOM");
        if(!this.has("HUD"))
            this.addComponent("HUD");
        if(!this.has("Tween"))
            this.addComponent("Tween");
        this.autoHide = true;
        this.closed = true;
        this.openX = 0;
        this.fixed = false;
        this.stack_id = this.stack.length;
        this.domId = "TNavBar"+this.stack_id;
        this.replace('<NavBar id="'+this.domId+'"></NavBar>');
        /*
         <NavButton>
             <img src="http://46.211.56.229/LOVC/gamedata/gui/star_btn.png" />
             <NavLabel>Achievements</NavLabel>
         </NavButton>

         <NavButton>
             <img src="http://46.211.56.229/LOVC/gamedata/gui/games_btn.png" />
             <NavLabel>Games</NavLabel>
         </NavButton>

         <NavButton>
             <img src="http://46.211.56.229/LOVC/gamedata/gui/box_btn.png" />
             <NavLabel>Stuffs</NavLabel>
         </NavButton>
        */
        this.$dom = $("#"+this.domId);
        this.$dom.mouseenter(function(){
            if(!$this.fixed)
                $this.open();
        }).mouseleave(function(){
            if(!$this.fixed)
                $this.close();
        });
        this.bind("TweenEnd", function(){
            if(this.x < 0)
                this.closed = true;
        });
        this.stack.push(this);
    },

    addLink: function(label, image, onclick){
        var link = $(
            '<NavButton>'+
                '<img src="'+image+'" />'+
                '<NavLabel>'+label+'</NavLabel>' +
            '</NavButton>'
        );
        if(typeof onclick === "function")
            link.click(onclick);
        this.$dom.append(link);
    },

    open: function(){
        if(this.closed){
            this.closedX = this.x;
            this.closed = false;
            this.tween({"x":this.openX}, 10);
        }
    },

    close: function(){
        if(typeof this.closedX === "number")
            this.tween({"x":this.closedX}, 10);
    }
});