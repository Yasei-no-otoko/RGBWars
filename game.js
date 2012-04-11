﻿enchant();
/**
    @fileOverview　RGBウォーズのメインループと定数を記述
    @author  <a href="mailto:dailioh@gmail.com">Haruto Watanabe</a>
    @require enchant.js
    @require tile.js
 */

/** 
    @constant
    @desc   タイルのサイズ
 */
var TILE_SIZE   = 32;
/**
    @constant
    @desc   マップの幅
 */
var MAP_WIDTH   = (debug) ? 32 : 16;
/**
    @constant
    @desc   マップの高さ
 */
var MAP_HEIGHT  = (debug) ? 32 : 16;
/**
    @constant
    @desc   ゲームのfps
 */
var GAME_FPS    = (debug) ? 30 : 1;
/**
    @constant
    @desc   ゲームの長さ
 */
var GAME_LENGTH = (debug) ? 500 : 100;


/** ウィンドウが読み込まれた時に実行 */
window.onload = function () {
    /**
        @name　game
        @desc enchant.Gameを継承したゲームオブジェクト
        @property {Number} fps ゲームのfps
        @property {Number} frame ゲーム開始から現在までのフレーム数
    */
    var game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE);
    game.fps = GAME_FPS;

    //簡易チュートリアル
    if ( debug ) {
        alert('これはテスト用の大規模・高速モードです。スペック試しにどうぞ');
    } else {
        alert('このゲームは、赤・緑・青の3色が争うリアルタイムシミュレーションゲームです。');
        alert('このゲームでは1秒当たり'+game.fps+'ターンの処理が行われます。');
        alert(game.fps*10+'ターンごとにマップ上に自陣営の色を配置することが可能になります。');
        alert('あなたは赤色で、緑に強いですが青には負けてしまいます。');
        alert('100ターンの間に上手くタイルを配置して勝利してください。');
    }

    /**
        ゲームの初期化処理
        @function
     */
    game.onload = function () {
        this.tileMap = new TileMap();
        game.rootScene.addChild(this.tileMap);

        //フレームごとに実行される処理
        game.addEventListener( 'enterframe', function() {
            if ( game.frame == GAME_LENGTH ) {
                //ゲームの終了処理
                var totalR=0;
                var totalG=0;
                var totalB=0;
                for ( var i=MAP_WIDTH; i--; ) {
                    for ( var j=MAP_HEIGHT; j-- ; ) {
                        totalR += this.tileMap.tiles[i][j]._r;
                        totalG += this.tileMap.tiles[i][j]._g;
                        totalB += this.tileMap.tiles[i][j]._b;
                    }
                }
                if ( totalR >= totalG && totalR >= totalB ) {
                    alert('勝者は赤です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else if (totalG >= totalB)  {
                    alert('勝者は緑です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else    {
                    alert('勝者は青です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }
                game.stop();
            } else if ( game.frame > 0 && game.frame%10 == 0 ) {
                //操作可能回数が増えたことをプレイヤーに伝える
                if ( !debug ) {
                    alert('色を配置可能になりました（あと'+this.tileMap.readyTouch+'回）');
                }
            }
            document.title='残りフレーム:'+(GAME_LENGTH-game.frame);
        });
    };
    game.start();
}