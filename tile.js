/**
 * @license
 * Copyright (c) 2012 Haruto Watanabe
 * Copyright (c) Ubiquitous Entertainment Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
    @fileOverview RGBウォーズのタイルとタイルマップのクラスを記述
    @require enchant.js v0.4.3+
    @author  <a href="mailto:dailioh@gmail.com">Haruto Watanabe</a>
 */

/**
    @class  各タイルの情報を格納するクラス
    @property {Number} r R値
    @property {Number} g G値
    @property {Number} b B値
    @property {Number} width タイルの幅
    @property {Number} height タイルの高さ
    @property {Number} x タイルのx座標
    @property {Number} y タイルのy座標
    @extends enchant.Entity
    
 */
Tile = enchant.Class.create(enchant.Entity,
/**@scope    Tile.prototype*/
{
    /**
        クラスの初期化
        @function
        @param {Number} r R値の初期値
        @param {Number} g G値の初期値
        @param {Number} b B値の初期値
        @param {Number} x タイルの初期x座標
        @param {Number} y タイルの初期y座標
     */
    initialize: function(r,g,b,x,y) {
        enchant.Entity.call(this,TILE_SIZE,TILE_SIZE);

        this._r = r;
        this._g = g;
        this._b = b;
        this._x = x;
        this._y = y;

        this.height = TILE_SIZE;
        this.width = TILE_SIZE;

        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
        this.className = "tile";
    },

    /**
        色を加算する
        @function
        @param {Number} r 加算するR値
        @param {Number} g 加算するG値
        @param {Number} b 加算するB値
     */
    addColor: function(r,g,b) {
        var math = Math;
        this._r += r;
        this._g += g;
        this._b += b;
        this.rgbClamp( math.floor(this._x/TILE_SIZE),math.floor(this._y/TILE_SIZE) );

        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    },

    /**
        表示を更新する
        @function
     */
    updateView: function() {
        this.backgroundColor = 'rgb('+this._r+','+this._g+','+this._b+')';
    },

    /**
        RGB値を0~255に抑える
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
　   @class  タイルで構成されたマップ全体を表すクラス
    @property {Number} readyTouch タイル追加操作の残り回数
    @extends enchant.Group
 */
TileMap =   enchant.Class.create(enchant.Group,
/** @scope  TileMap.prototype */
{
    /**
        クラスの初期化
        @function
     */
    initialize: function(){
        enchant.Group.call(this,MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);

        /* タイルを初期化する */
        this.initTiles();

        /* タイル追加操作の残り回数 */
        this.readyTouch = 1;

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

        /*　タイルを初期化する */
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
            } else if
                (
                    (       math.abs(bX-rX) < math.floor(MAP_WIDTH/4)
                        ||  math.abs(bY-rY) < math.floor(MAP_HEIGHT/4)
                    )
                    ||
                    (       math.abs(bX-gX) < math.floor(MAP_WIDTH/4)
                        ||  math.abs(bY-gY) < math.floor(MAP_HEIGHT/4)
                    )
                )
            {
                bX = math.floor( math.random()*(MAP_WIDTH-2)+1 );
                bY = math.floor( math.random()*(MAP_HEIGHT-2)+1 );
            } else {
                break;
            }
        }
        this.tiles[bX][bY]._b = 255;
    },

    /**
        タッチ（クリック）したタイルに自分の色を追加する
        @param  {Event} e タッチされた座標を取得するためのイベントオブジェクト
        @event
     */
    onTouch: function(e){
        if ( this.readyTouch > 0 ) {
            this.readyTouch--;
            
            var math = Math;
            var X = math.floor(e.localX/TILE_SIZE);
            var Y = math.floor(e.localY/TILE_SIZE);
            this.tiles[X][Y].addColor(128,0,0);
        }
    },

    /**
        毎フレーム行われる処理
        @event
     */
    onEnterframe: function(){
        var cacheTiles = this.tiles;

        /* 進攻処理 */
        for ( var i=0; i<MAP_WIDTH; i++ ) {
            for ( var j=0; j<MAP_HEIGHT; j++ ) {
                this.tileAdvance(i,j,cacheTiles[i][j]);
            }
        }

        /* 進攻後の交戦処理と表示の更新 */
        for ( var i=MAP_WIDTH; i--; ) {
            for ( var j=MAP_HEIGHT; j--; ) {
                this.tileWars(i,j);
                this.tiles[i][j].updateView();
            }
        }

        /* タッチ可能回数を増やす */
        if ( this.age > 0 && this.age%10 == 0 ) {
            var math = Math;
            this.readyTouch++;
            
            var gX = math.floor( math.random()*(MAP_WIDTH-1) );
            var gY = math.floor( math.random()*(MAP_HEIGHT-1) );
            this.tiles[gX][gY].addColor(0,128,0);
            var bX = math.floor( math.random()*(MAP_WIDTH-1) );
            var bY = math.floor( math.random()*(MAP_HEIGHT-1) );
            this.tiles[bX][bY].addColor(0,0,128);
        }
    },

    /**
        周囲タイルへの進攻
        @function
        @param x タイルの座標
        @param y タイルの座標
        @param cacheTile 他のタイルでの進攻結果が反映されないようにフレーム開始時のタイル情報を用いる
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
        @param x タイルの座標
        @param y タイルの座標
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
    }
});