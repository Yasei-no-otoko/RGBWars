/**
    game.js
    @version zero
    @require enchant.js v0.4.3+
    @require canvas.enchant.js v0.1+
    @author  Haruto Watanabe
    @description    RGBウォーズ本体
*/

/**
    RGB値を255に抑える
    @function
*/
function rgb_clamp(x,y){
    var math = Math;
    tiles[x][y]._r = math.max(0, math.min(255, tiles[x][y]._r));
    tiles[x][y]._g = math.max(0, math.min(255, tiles[x][y]._g));
    tiles[x][y]._b = math.max(0, math.min(255, tiles[x][y]._b));
}

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
    for (var i=MAP_WIDTH; i--; ) {
        for (var j=MAP_HEIGHT; j--; ) {
            var r = math.floor( math.random()*255 );
            var g = math.floor( math.random()*255 );
            var b = math.floor( math.random()*255 );
            tiles[i][j] = new Tile(r,g,b,i*TILE_SIZE,j*TILE_SIZE);
        }
    }
}

/**
    タイル内での戦争
    @function
    @param  x,y タイルの座標
*/
function tileWars (x,y) {
    var red   = tiles[x][y]._r;
    var green = tiles[x][y]._g;
    var blue  = tiles[x][y]._b;
    var d_r = 0;
    var d_g = 0;
    var d_b = 0;
    var math = Math;
    
    if ( red > 0) {
        if ( green > 0 ) {
            //赤が緑を吸収する
            d_r += green;
            d_g -= red;
        }
        if ( blue > 0 ) {
            //赤が青に吸収される
            d_r -= blue;
            d_b += red;
        }
    }
    if ( green > 0) {
        if ( blue > 0 ) {
            //緑が青を吸収する
            d_g += blue;
            d_b -= green;
        }
        if ( red > 0 ) {
            //緑が赤に吸収される
            d_g -= red;
            d_r += green;
        }
    }

    if ( blue > 0) {
        if ( red > 0 ) {
            //青が赤を吸収する
            d_b += red;
            d_r -= blue;
        }
        if ( green > 0 ) {
            //青が緑に吸収される
            d_b -= green;
            d_g += blue;
        }
    }
    
    tiles[x][y]._r += d_r;
    tiles[x][y]._g += d_g;
    tiles[x][y]._b += d_b;
    
    rgb_clamp(x,y);
}

/**
    周囲タイルへの進攻
    @function
    @param  x,y         現タイルの座標
*/
function tileAdvance (x,y) {
    var red     =   tiles[x][y]._r;
    var green   =   tiles[x][y]._g;
    var blue    =   tiles[x][y]._b;
    var math    =   Math;
    
    
    if ( tiles[x-1][y]　!= undefined ) {
        //左タイルへの進攻
        tiles[x-1][y]._r += math.floor(red/10);
        tiles[x-1][y]._g += math.floor(green/10);
        tiles[x-1][y]._b += math.floor(blue/10);
        rgb_clamp(x-1,y);
    }
    if ( tiles[x+1][y]　!= undefined ) {
        //右タイルへの進攻
        tiles[x+1][y]._r += math.floor(red/10);
        tiles[x+1][y]._g += math.floor(green/10);
        tiles[x+1][y]._b += math.floor(blue/10);
        rgb_clamp(x+1,y);
    }
    if ( tiles[x][y-1]　!= undefined ) {
        //上タイルへの進攻
        tiles[x][y-1]._r += math.floor(red/10);
        tiles[x][y-1]._g += math.floor(green/10);
        tiles[x][y-1]._b += math.floor(blue/10);
        rgb_clamp(x,y-1);
    }
    if ( tiles[x][y+1]　!= undefined ) {
        //上タイルへの進攻
        tiles[x][y+1]._r += math.floor(red/10);
        tiles[x][y+1]._g += math.floor(green/10);
        tiles[x][y+1]._b += math.floor(blue/10);
        rgb_clamp(x,y+1);
    }
}

window.onload = function () {
    enchant();
    var game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE);
    game.fps = 1;
    game.onload = function () {
        initTiles();
        var rgbwars = RGBWars();
        game.rootScene.addChild(rgbwars);
    };
    game.start();
}

/**
    @scope rgb.map
    @extends enchant.Sprite
    @description    マップを描画する
*/
RGBWars =   enchant.Class.create(enchant.Group,{
    initialize: function(){
        enchant.Group.call(this,MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);

        /* 一つのCanvasオブジェクトに全てのタイルを描画する */
        for ( var i=MAP_WIDTH; i--; ) {
            for ( var j=MAP_HEIGHT; j-- ; ) {
                this.addChild(tiles[i][j]);
            }
        }
        
        this.addEventListener( 'touchstart', this.onTouch );
        
        this.addEventListener( 'enterframe', this.onEnterframe );
    },

    onTouch: function(e){
        var math = Math;
        var X = math.floor(e.localX/TILE_SIZE);
        var Y = math.floor(e.localY/TILE_SIZE);

        tiles[X][Y].AddColor(255,0,0);
    },

    onEnterframe: function(){
        /* 各タイルの */
        for ( var i=MAP_WIDTH-1; i--;  ) {
            for ( var j=MAP_WIDTH-1; j--;  ) {
                tileWars(i,j)
                if (tiles[i][j]._r > 0
                ||  tiles[i][j]._g > 0
                ||  tiles[i][j]._b > 0) {
                    tileAdvance(i,j);
                }
                tiles[i][j].changeColor();
            }
        }
    },
});

/**
    @score rgb.tile
    @description
    タイル情報
*/
Tile = enchant.Class.create(enchant.Sprite,{
    initialize: function(r,g,b,x,y) {
        enchant.Sprite.call(this,TILE_SIZE,TILE_SIZE);

        this._r = r;
        this._g = g;
        this._b = b;
        this._x = x;
        this._y = y;

        this._surface = new Surface(TILE_SIZE,TILE_SIZE);
            this._ctx   = this._surface.context;
            this._ctx.beginPath();
                var grad  = this._ctx.createLinearGradient(0,0, TILE_SIZE,TILE_SIZE);
                grad.addColorStop(0,'rgb('+this._r+','+this._g+','+this._b+')');
                grad.addColorStop(1,'rgb(0, 0, 0)');  // 黒
            this._ctx.fillStyle = grad;
            this._ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.image  = this._surface;
    },
    AddColor: function(r,g,b) {
        this._r = r;
        this._g = g;
        this._b = b;
        
        this._surface = new Surface(TILE_SIZE,TILE_SIZE);
            this._ctx   = this._surface.context;
            this._ctx.beginPath();
                var grad  = this._ctx.createLinearGradient(0,0, TILE_SIZE,TILE_SIZE);
                grad.addColorStop(0,'rgb('+this._r+','+this._g+','+this._b+')');
                grad.addColorStop(1,'rgb(0, 0, 0)');  // 黒
            this._ctx.fillStyle = grad;
            this._ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.image  = this._surface;
    },
    changeColor: function() {
        this._surface = new Surface(TILE_SIZE,TILE_SIZE);
            this._ctx   = this._surface.context;
            this._ctx.beginPath();
                var grad  = this._ctx.createLinearGradient(0,0, TILE_SIZE,TILE_SIZE);
                grad.addColorStop(0,'rgb('+this._r+','+this._g+','+this._b+')');
                grad.addColorStop(1,'rgb(0, 0, 0)');  // 黒
            this._ctx.fillStyle = grad;
            this._ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.image  = this._surface;
    }
});