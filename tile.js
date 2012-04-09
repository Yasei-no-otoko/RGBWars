/**
    tile.js
    @require enchant.js v0.4.3+
    @author  Haruto Watanabe
    @description    タイル部分の実装
*/

/**
    @extends    enchant.Entity
    @description    タイル情報
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
    addColor: function(r,g,b) {
        var math = Math;
        this._r += r;
        this._g += g;
        this._b += b;
        this.rgbClamp( math.floor(this._x/TILE_SIZE),math.floor(this._y/TILE_SIZE) );

        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    },
    updateView: function() {
        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    },
    /**
        RGB値を255に抑える
        @function
    */
    rgbClamp : function (){
        var math = Math;
        this._r = math.max(0, math.min(255, this._r));
        this._g = math.max(0, math.min(255, this._g));
        this._b = math.max(0, math.min(255, this._b));
    }
});

/**
    @extends enchant.Group
    @description    タイルマップを管理する
*/
TileMap =   enchant.Class.create(enchant.Group,{
    initialize: function(){
        enchant.Group.call(this,MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);

        /* タイルを初期化する */
        this.initTiles();
        
        /* 一つのCanvasオブジェクトに全てのタイルを描画する */
        for ( var i=MAP_WIDTH; i--; ) {
            for ( var j=MAP_HEIGHT; j-- ; ) {
                this.addChild(this.tiles[i][j]);
            }
        }
        
        this.addEventListener( 'touchstart', this.onTouch );
        
        this.addEventListener( 'enterframe', this.onEnterframe );
    },

    /**
        タイルの初期化
        @function
    */
    initTiles : function () {
        var math = Math;

        /**
            タイルを格納する配列
            @type Array
        */
        this.tiles = new Array(MAP_WIDTH);
        for ( var i=0; i < MAP_WIDTH; i++ ) {
            this.tiles[i] = new Array(MAP_HEIGHT);
        }
        
        for (var i=MAP_WIDTH; i--; ) {
            for (var j=MAP_HEIGHT; j--; ) {
                this.tiles[i][j] = new Tile(0,0,0,i*TILE_SIZE,j*TILE_SIZE);
            }
        }

        /* 赤255を配置する */
        var rX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
        var rY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
        this.tiles[rX][rY]._r = 255;
        
        /* 緑255を赤と近すぎない位置に配置する */
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
        this.tiles[gX][gY]._g = 255;
        
        /* 青255を赤、緑と近すぎない位置に配置する */
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
        this.tiles[bX][bY]._b = 255;
    },

    onTouch: function(e){
        if ( readyTouch > 0 ) {
            readyTouch--;
            
            var math = Math;
            var X = math.floor(e.localX/TILE_SIZE);
            var Y = math.floor(e.localY/TILE_SIZE);
            this.tiles[X][Y].addColor(128,0,0);
        }
    },

    onEnterframe: function(){
        var cacheTiles = this.tiles;
        /* 各タイルの */
        for ( var i=MAP_WIDTH; i--;  ) {
            for ( var j=MAP_WIDTH; j--;  ) {
                if (cacheTiles[i][j]._r > 0
                ||  cacheTiles[i][j]._g > 0
                ||  cacheTiles[i][j]._b > 0) {
                    this.tileAdvance(i,j,cacheTiles[i][j]);
                    this.tileWars(i,j);
                }
            }
        }
        for ( var i=MAP_WIDTH; i--;  ) {
            for ( var j=MAP_WIDTH; j--;  ) {
                this.tiles[i][j].updateView();
            }
        }
    },
    
    /**
        周囲タイルへの進攻
        @function
        @param  x,y         現タイルの座標
    */
    tileAdvance : function (x,y,cacheTile) {
        var red     =   cacheTile._r;
        var green   =   cacheTile._g;
        var blue    =   cacheTile._b;
        var math    =   Math;

        if ( x > 0 ) {
            //左タイルへの進攻
            this.tiles[x-1][y]._r += math.floor(red/10);
            this.tiles[x-1][y]._g += math.floor(green/10);
            this.tiles[x-1][y]._b += math.floor(blue/10);
            this.tiles[x-1][y].rgbClamp();
        }
        if ( x < MAP_WIDTH-1 ) {
            //右タイルへの進攻
            this.tiles[x+1][y]._r += math.floor(red/10);
            this.tiles[x+1][y]._g += math.floor(green/10);
            this.tiles[x+1][y]._b += math.floor(blue/10);
            this.tiles[x+1][y].rgbClamp();
        }
        if ( y > 0 ) {
            //上タイルへの進攻
            this.tiles[x][y-1]._r += math.floor(red/10);
            this.tiles[x][y-1]._g += math.floor(green/10);
            this.tiles[x][y-1]._b += math.floor(blue/10);
            this.tiles[x][y-1].rgbClamp();
        }
        if ( y < MAP_HEIGHT-1 ) {
            //下タイルへの進攻
            this.tiles[x][y+1]._r += math.floor(red/10);
            this.tiles[x][y+1]._g += math.floor(green/10);
            this.tiles[x][y+1]._b += math.floor(blue/10);
            this.tiles[x][y+1].rgbClamp();
        }
    },
    /**
        タイル内での戦争
        @function
        @param  x,y タイルの座標
    */
    tileWars : function (x,y) {
        var red   = this.tiles[x][y]._r;
        var green = this.tiles[x][y]._g;
        var blue  = this.tiles[x][y]._b;
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
        
        this.tiles[x][y]._r += dR;
        this.tiles[x][y]._g += dG;
        this.tiles[x][y]._b += dB;
        this.tiles[x][y].rgbClamp();
    },
});