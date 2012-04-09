﻿enchant();
/**
    game.js
    @require enchant.js v0.4.3+
    @require tile.js
    @require .js
    @author  Haruto Watanabe
    @description    RGBウォーズ本体
*/

/**
    定数
*/
var TILE_SIZE = 32;
var MAP_WIDTH   = 16;
var MAP_HEIGHT  = 16;
var GAME_LENGTH  = 100;

window.onload = function () {
    var game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE);
    game.fps = 1;
    
    game.onload = function () {
        var tileMap = new TileMap();
        game.rootScene.addChild(tileMap);

        game.addEventListener( 'enterframe', function() {
            if ( game.frame == GAME_LENGTH ) {
                var totalR=0;
                var totalG=0;
                var totalB=0;
                for ( var i=MAP_WIDTH; i--; ) {
                    for ( var j=MAP_HEIGHT; j-- ; ) {
                        totalR += tileMap.tiles[i][j]._r;
                        totalG += tileMap.tiles[i][j]._g;
                        totalB += tileMap.tiles[i][j]._b;
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
            document.title='残りフレーム:'+(GAME_LENGTH-game.frame)+' 残りタイル数:'+tileMap.readyTouch;
        });
    };
    game.start();
}