/**
    game.js
    @version zero
    @require enchant.js v0.4.3+
    @require canvas.enchant.js v0.1+
    @author  Haruto Watanabe
    @description    RGBウォーズ本体
*/

/**
    タイルのサイズとマップ上のタイル数を表す定数
*/
TILE_SIZE = 32;
MAP_WIDTH   = 16;
MAP_HEIGHT  = 16;

/**
    タイルを格納する配列
    @type Array
*/
var tiles = new Array(MAP_WIDTH);
for ( var i=0; i < MAP_WIDTH; i++ ) {
    tiles[i] = new Array(MAP_HEIGHT);
}

/**
    タイルの初期化
    @function
*/
function initTiles() {
    var math = Math;
    for (var i=0; i < MAP_WIDTH; i++) {
        for (var j=0; j < MAP_HEIGHT; j++) {
            var r = math.floor( math.random()*255 );
            var g = math.floor( math.random()*255 );
            var b = math.floor( math.random()*255 );
            tiles[i][j] = new Tile(r,g,b);
        }
    }
}

window.onload = function () {
    enchant();
    var game = new Game(512, 512);
    game.fps = 1;
    game.onload = function () {
        initTiles();
        var map = WorldMap();
        game.rootScene.addChild(map);
    };
    game.start();
}

/**
    @scope rgb.map
    @extends enchant.Sprite
    @description    マップを描画する
*/
WorldMap =   enchant.Class.create(enchant.Sprite,{
    initialize: function(){
        enchant.Sprite.call(this,MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);
        this._surface = new Surface(MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);
        this._ctx   = this._surface.context;
        
        /* 一つのCanvasオブジェクトに全てのタイルを描画する */
        for ( var i=0; i < MAP_WIDTH; i++ ) {
            for ( var j=0; j < MAP_HEIGHT; j++ ) {
                /* tiles[i][j]のRGB値を参照して色を決定する*/
                this._ctx.beginPath();
                var grad  = this._ctx.createLinearGradient(0,0, TILE_SIZE,TILE_SIZE);
                grad.addColorStop(0,'rgb('
                    + tiles[i][j]._r + ','
                    + tiles[i][j]._g + ','
                    + tiles[i][j]._b + ')' );
                grad.addColorStop(1,'rgb(0, 0, 0)');  // 黒
                this._ctx.fillStyle = grad;
                this._ctx.fillRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
        
        this.image  = this._surface;
        this.addEventListener( 'touchstart', function(e){
            var X = Math.floor(e.localX/TILE_SIZE);
            var Y = Math.floor(e.localY/TILE_SIZE);
            tiles[X][Y]._r += 255;
            tiles[X][Y]._g -= 255;
            tiles[X][Y]._b -= 255;
        });
        
        this.addEventListener( 'enterframe', function(){
            /* 一つのCanvasオブジェクトに全てのタイルを描画する */
            for ( var i=0; i < MAP_WIDTH; i++ ) {
                for ( var j=0; j < MAP_HEIGHT; j++ ) {
                    /* tiles[i][j]のRGB値を参照して色を決定する*/
                    var r = tiles[i][j]._r;
                    var g = tiles[i][j]._g;
                    var b = tiles[i][j]._b;
                    var posX = i*TILE_SIZE;
                    var posY = j*TILE_SIZE;
                    this._ctx.beginPath();
                    var grad  = this._ctx.createLinearGradient(posX,posY, posX+TILE_SIZE,posY+TILE_SIZE);
                    grad.addColorStop(0,'rgb('+r+','+g+','+b+')');
                    grad.addColorStop(1,'rgb(0, 0, 0)');  // 黒
                    this._ctx.fillStyle = grad;
                    this._ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
                }
            }
        });
    },
});

/**
    @score rgb.tile
    @description
    タイル情報
*/
Tile = enchant.Class.create({
    initialize: function(r,g,b) {
        this._r = r;
        this._g = g;
        this._b = b;
    },
    changeColor: function(r,g,b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }
});