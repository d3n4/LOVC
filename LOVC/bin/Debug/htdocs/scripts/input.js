var input = {
    listen: true,
    pause: function(){
        if(DEBUG)
            console.log("Pause keyboard listen");
        Crafty.removeEvent(Crafty, "keydown", Crafty.keyboardDispatch);
        Crafty.removeEvent(Crafty, "keyup", Crafty.keyboardDispatch);
        this.listen = false;
    },

    resume: function(){
        if(DEBUG)
            console.log("Resumed keyboard listen");
        Crafty.addEvent(Crafty, "keydown", Crafty.keyboardDispatch);
        Crafty.addEvent(Crafty, "keyup", Crafty.keyboardDispatch);
        this.listen = true;
    }
};