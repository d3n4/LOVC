include("lang.ru.js");
include("Isometric.js");
include("utils.js");
include("Sprite.js");
include("Block.js");
include("GameObject.js");
include("Space.js");
include("SpriteColor.js");
include("Actor.js");
include("HUD.js");
include("Chat.js");
include("Navigation.js");

var mod = 0.05;
var player, room;
main(function(){
    Crafty.init(GAME_WIDTH, GAME_HEIGHT);
    Crafty.scene("room", function(){
        Crafty.background("#000");

        var offset = [0,123];

        /*Crafty.sprite(450, 450, GAMEDATA + "/crud/screen.png", { "screen": [0, 0] });
         var screen = Crafty.e("2D, DOM, Mouse, Draggable, screen").attr({"x": GAME_WIDTH / 2 - 246, "y": GAME_HEIGHT / 2 - 243, "z": 1}).bind("Click", function(){
         $("#term").click();
         });

         var terminal = Crafty.e("HTML, screenc").attr({"x": GAME_WIDTH / 2 - 200, "y": GAME_HEIGHT / 2 - 200}).replace('<div id="term"></div>');
         $('#term').terminal(function(command, term) {
         window["os"] = term;
         if (command !== '') {
         try {
         var result = window.eval(command);
         if (result !== undefined) {
         term.echo(result);
         }
         } catch(e) {
         term.error("Unknown command \""+ command +"\"");
         }
         } else {
         term.echo('');
         }
         }, {
         greetings: 'lovcOS 1.0',
         name: 'lovcOS',
         width: 338,
         height: 345,
         prompt: ''});
         input.pause();

         screen.attach(terminal);*/

        // Crafty.sprite(78, 128, format(CHARACTER_URL, "DENFER"), { "player": [0, 0] });

        /*player = Crafty.e("2D, Canvas, Keyboard, Isometric, Mouse, player, Tween, Collision")
         .collision([16,53],[22,22],[23,21],[30,15],[32,14],[44,14],[46,15],[49,18],[51,22],[54,31],[60,56],[60,58],[59,76],[53,103],[52,104],[24,104],[23,103],[18,90],[16,65])
         .isometric()
         .iso.set({
         "offset": offset,
         "h": 91,
         "origin": [0,32]
         })
         .bind('KeyDown', function () {

         if (this.isDown('W')){
         this.iso.y = this.iso.y-mod;
         this.iso.place(this.iso.x, this.iso.y);
         }
         if (this.isDown('S')){
         this.iso.y = this.iso.y+mod;
         this.iso.place(this.iso.x, this.iso.y);
         }
         if (this.isDown('A')){
         this.iso.x = this.iso.x-mod;
         this.iso.place(this.iso.x, this.iso.y);
         }
         if (this.isDown('D')){
         this.iso.x = this.iso.x+mod;
         this.iso.place(this.iso.x, this.iso.y);
         }
         //this.space.findNearbyCam(this.Iso);
         })
         .bind("Click", function(){
         //console.log("player clicked");
         });          */

        player = new Actor("DENFER2");


        var InputMessage = Crafty.e("ChatInput");
        var nav = Crafty.e("Navigation").attr({"x": -89, "y": 5});
        var click = function(){
            alert($(this).find("NavLabel").html());
        };
        nav.addLink("Достижения", "http://46.211.56.229/LOVC/gamedata/gui/star_btn.png",click);
        nav.addLink("Игры", "http://46.211.56.229/LOVC/gamedata/gui/games_btn.png",click);
        nav.addLink("Инвентарь", "http://46.211.56.229/LOVC/gamedata/gui/box_btn.png",click);
        nav.addLink("Уровень", "http://46.211.56.229/LOVC/gamedata/gui/shark_btn.png",click);

        // var bubble = Crafty.e("ChatBubble").attr({"x":200,"y":400});

        Block.create(3, {
            "polygon": "[[0,15],[30,0],[33,0],[63,15],[63,23],[33,38],[30,38],[0,23]]",
            "height": 8,
            "sprite": Sprite.get(64, 39, "/crud/block.png"),
            "offset": offset,
            "components": ["Mouse"],
            "events": {
                "Click": function(){
                    //console.log("Block clicked", this.iso);
                    player.move(this.iso.x, this.iso.y);
                },

                "MouseOver": function(){
                    //this.alpha = 0.5;
                    //console.log(this.iso.x, this.iso.y);
                },

                "MouseOut": function(){
                    //this.alpha = 1;
                }
            }
        });

        var walls = Sprite.get(40, 154, "/crud/wall.png", {
            "wally": [0, 0],
            "wallye": [1, 0],
            "wallyh": [2, 0],

            "wallx": [3, 0],
            "wallxe": [4, 0],
            "wallxh": [5, 0]
        });


        Block.create(4, {
            "height": 123,
            "sprite": walls[0],
            "offset": offset,
            "origin": [0,16],
            "clr": [20,103]
        });

        Block.create(5, {
            "height": 123,
            "sprite": walls[1],
            "offset": offset,
            "origin": [0,16],
            "clr": [20,103]
        });

        Block.create(6, {
            "height": 123,
            "sprite": walls[2],
            "offset": offset,
            "origin": [0,16],
            "clr": [20,103]
        });

        Block.create(7, {
            "height": 123,
            "sprite": walls[3],
            "offset": offset,
            "origin": [0,16],
            "clr": [-20,103]
        });

        Block.create(8, {
            "height": 123,
            "sprite": walls[4],
            "offset": offset,
            "origin": [0,16],
            "clr": [-20,103]
        });

        Block.create(9, {
            "height": 123,
            "sprite": walls[5],
            "offset": offset,
            "origin": [0,16],
            "clr": [-20,103]
        });

        var room_model = (function(){
            var S = Block.type.SPAWN, C = Block.type.CAMERA;

            return [
                [
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [S,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                ],

                [
                    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
                ],

                [
                    [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                ],

                [
                    [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                ]
            ];
        })();


        /*GameObject.load("/furni/area_sofa", offset, function(obj){
         obj.place(3,3);
         rotate = function(){
         obj.rotate(0);
         };
         });*/
        //var sofa = GameObject.create("sofax", "/crud/sofax.png", 70, 82, offset, objectMap);
        //sofa.side = 2;
        //sofa.place(5,5);
        /*for(var x = 0; x < 10; x++)
         for(var y = 0; y < 10; y++){
         Block.get(3).build().iso.place(x, y, 0);
         if(x == 0)
         Block.get(4).build().iso.place(x,y,0);
         }*/

        room = new Space();
        //room.offset = [110,0];
        room.fromModel(room_model);
        room.build();
        room.place(player.entity, room.spawn);
        room.findNearbyCam(player.iso, true);
    });
    Crafty.scene("room");
});