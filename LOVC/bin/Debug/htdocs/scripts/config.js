var DEBUG = true, ORIGIN_DEBUG = false;

var RENDER_CANVAS = "Canvas", RENDER_DOM = "DOM";
var RENDER = RENDER_CANVAS;

var ASTAR_DIAGONAL = false;

var VERSION = 0;

var GAME_WIDTH = $(window).width(), GAME_HEIGHT = $(window).height(),
    HOST_ADDR = "127.0.0.1";
    HOST_URI = 'http://' + HOST_ADDR + ':7172',
    HOST_PORT = 7172;
    HOST_SOCKET = HOST_ADDR + ':' + HOST_PORT;

var GAMEDATA = HOST_URI + '/gamedata',
    CHARACTER_MODELS =  GAMEDATA + '/character/model',
    ZBUFFER = 64000;

var ACTOR_WIDTH = 320, ACTOR_HEIGHT = 640;
// 78x128

var WALL_SIZE = 123;

var CHARACTER_URL = HOST_URI+"/gamedata/character/model/{0}.png",
    CHARACTER_HEAD_URL = HOST_URI+"/head.php?u={0}&/head.png";

var MAX_CHAT_LENGTH = 120;
var CHAT_INPUT_OFFSET = 50;

var GUI_Z = 1000000;