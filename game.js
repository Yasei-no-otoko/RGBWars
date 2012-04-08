enchant();
/**
    game.js
    @version zero
    @require enchant.js v0.4.3+
    @require canvas.enchant.js v0.1+
    @author  Haruto Watanabe
    @description    RGBウォーズ本体
*/

/**
    定数
*/
var TILE_SIZE = 32;
var MAP_WIDTH   = 16;
var MAP_HEIGHT  = 16;

/**
    操作可能回数
*/
var readyTouch = 1;

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
    タイルを格納する配列
    @type Array
*/
var tiles = new Array(MAP_WIDTH);
for ( var i=0; i < MAP_WIDTH; i++ ) {
    tiles[i] = new Array(MAP_HEIGHT);
}

/**
    進攻時のタイルを格納する配列
    @type Array
*/
var cacheTiles = new Array(MAP_WIDTH);
for ( var i=0; i < MAP_WIDTH; i++ ) {
    cacheTiles[i] = new Array(MAP_HEIGHT);
}

/**
    タイルの初期化
    @function
*/
function initTiles() {
    var math = Math;
    
    for (var i=MAP_WIDTH; i--; ) {
        for (var j=MAP_HEIGHT; j--; ) {
            tiles[i][j] = new Tile(0,0,0,i*TILE_SIZE,j*TILE_SIZE);
        }
    }

    var rX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
    var rY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
    tiles[rX][rY]._r = 255;
    
    var gX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
    var gY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
    for (;;) {
        if ( gX == rX && gY == rY ) {
            gX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
            gY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
        }
        else if ( math.abs(gX-rX) < math.floor(MAP_WIDTH/4) 
        || math.abs(gY-rY) < math.floor(MAP_HEIGHT/4)){
            gX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
            gY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
        }
        else {
            break;
        }
    }
    tiles[gX][gY]._g = 255;
    
    
    var bX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
    var bY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
    for (;;) {
        if ( (bX == rX && bY == rY) || (bX == gX && bY == gY) ) {
            bX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
            bY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
        }
        else if (
            (       math.abs(bX-rX) < math.floor(MAP_WIDTH/4)
                ||  math.abs(bY-rY) < math.floor(MAP_HEIGHT/4)
            )
            ||
            (       math.abs(bX-gX) < math.floor(MAP_WIDTH/4)
                ||  math.abs(bY-gY) < math.floor(MAP_HEIGHT/4)
            )
        ) {
            bX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
            bY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
        }
        else {
            break;
        }
    }
    tiles[bX][bY]._b = 255;
}

/**
    タイル内での戦争
    @function
    @param  x,y タイルの座標
*/
function tileWars (x,y) {
    var red   = cacheTiles[x][y]._r;
    var green = cacheTiles[x][y]._g;
    var blue  = cacheTiles[x][y]._b;
    var dR = 0;
    var dG = 0;
    var dB = 0;
    var math = Math;
    
    if ( red > 0) {
        if ( green > 0 ) {
            //赤は緑に強い
            dR += math.floor(green/10);
        }
        if ( blue > 0 ) {
            //赤は青に弱い
            dR -= math.floor(blue/2);
        }
    }
    if ( green > 0) {
        if ( blue > 0 ) {
            //緑は青に強い
            dG += math.floor(blue/10);
        }
        if ( red > 0 ) {
            //緑は赤に弱い
            dG -= math.floor(red/2);
        }
    }

    if ( blue > 0) {
        if ( red > 0 ) {
            //青は赤に強い
            dB += math.floor(red/10);
        }
        if ( green > 0 ) {
            //青は緑に弱い
            dB -= math.floor(green/2);
        }
    }
    
    tiles[x][y]._r += dR;
    tiles[x][y]._g += dG;
    tiles[x][y]._b += dB;
    
    rgb_clamp(x,y);
    //tiles[x][y].changeColor();
}

/**
    周囲タイルへの進攻
    @function
    @param  x,y         現タイルの座標
*/
function tileAdvance (x,y) {
    var red     =   cacheTiles[x][y]._r;
    var green   =   cacheTiles[x][y]._g;
    var blue    =   cacheTiles[x][y]._b;
    var math    =   Math;

    if ( x > 0 ) {
        //左タイルへの進攻
        tiles[x-1][y]._r += math.floor(red/10);
        tiles[x-1][y]._g += math.floor(green/10);
        tiles[x-1][y]._b += math.floor(blue/10);
        rgb_clamp(x-1,y);
    }
    if ( x < MAP_WIDTH-1 ) {
        //右タイルへの進攻
        tiles[x+1][y]._r += math.floor(red/10);
        tiles[x+1][y]._g += math.floor(green/10);
        tiles[x+1][y]._b += math.floor(blue/10);
        rgb_clamp(x+1,y);
    }
    if ( y > 0 ) {
        //上タイルへの進攻
        tiles[x][y-1]._r += math.floor(red/10);
        tiles[x][y-1]._g += math.floor(green/10);
        tiles[x][y-1]._b += math.floor(blue/10);
        rgb_clamp(x,y-1);
    }
    if ( y < MAP_HEIGHT-1 ) {
        //下タイルへの進攻
        tiles[x][y+1]._r += math.floor(red/10);
        tiles[x][y+1]._g += math.floor(green/10);
        tiles[x][y+1]._b += math.floor(blue/10);
        rgb_clamp(x,y+1);
    }
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
        if ( readyTouch > 0 ) {
            readyTouch--;
            
            var math = Math;
            var X = math.floor(e.localX/TILE_SIZE);
            var Y = math.floor(e.localY/TILE_SIZE);
            tiles[X][Y].AddColor(128,0,0);
        }
    },

    onEnterframe: function(){
        cacheTiles = tiles;
        /* 各タイルの */
        for ( var i=MAP_WIDTH; i--;  ) {
            for ( var j=MAP_WIDTH; j--;  ) {
                if (cacheTiles[i][j]._r > 0
                ||  cacheTiles[i][j]._g > 0
                ||  cacheTiles[i][j]._b > 0) {
                    tileAdvance(i,j);
                    tileWars(i,j);
                }
            }
        }
        for ( var i=MAP_WIDTH; i--;  ) {
            for ( var j=MAP_WIDTH; j--;  ) {
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
Tile = enchant.Class.create(enchant.Entity,{
    initialize: function(r,g,b,x,y) {
        enchant.Entity.call(this,TILE_SIZE,TILE_SIZE);

        this._r = r;
        this._g = g;
        this._b = b;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this._x = x;
        this._y = y;
        
        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
        this.className = "tile";
    },
    AddColor: function(r,g,b) {
        var math = Math;
        this._r += r;
        this._g += g;
        this._b += b;
        rgb_clamp( math.floor(this._x/TILE_SIZE),math.floor(this._y/TILE_SIZE) );

        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    },
    changeColor: function() {
        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    }
});

window.onload = function () {
    var game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE);
    game.fps = 1;
    game.onload = function () {

        initTiles();
        var rgbwars = RGBWars();
        game.rootScene.addChild(rgbwars);
        game.addEventListener( 'enterframe', function() {
            
            if ( game.frame == 100 ) {
                var totalR=0;
                var totalG=0;
                var totalB=0;
                for ( var i=MAP_WIDTH; i--; ) {
                    for ( var j=MAP_HEIGHT; j-- ; ) {
                        totalR += tiles[i][j]._r;
                        totalG += tiles[i][j]._g;
                        totalB += tiles[i][j]._b;
                    }
                }
                if ( totalR >= totalG && totalR >= totalB ) {
                    alert('トップは赤です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else if (totalG >= totalB)  {
                    alert('トップは緑です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else    {
                    alert('トップは青です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }
                game.stop();
            }
            if ( game.frame > 0 && game.frame%10 == 0 ) {
                var math = Math;
                readyTouch++;
                
                var gX = math.floor( math.random()*(MAP_WIDTH-1) );
                var gY = math.floor( math.random()*(MAP_HEIGHT-1) );
                tiles[gX][gY].AddColor(0,128,0);
                var bX = math.floor( math.random()*(MAP_WIDTH-1) );
                var bY = math.floor( math.random()*(MAP_HEIGHT-1) );
                tiles[bX][bY].AddColor(0,0,128);
            }
            document.title='フレーム:'+game.frame+' 配置可能タイル数:'+readyTouch;
        });
    };
    game.start();
}