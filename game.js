enchant();
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
var TILE_SIZE   = 32;
var MAP_WIDTH   = (debug) ? 32 : 16;
var MAP_HEIGHT  = (debug) ? 32 : 16;
var GAME_FPS    = (debug) ? 30 : 1;
var GAME_LENGTH = (debug) ? 500 : 100;

window.onload = function () {
    var game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE);
    game.fps = GAME_FPS;

    if ( debug ) {
        alert('これはテスト用の大規模・高速モードです。スペック試しにどうぞ');
    } else {
        alert('このゲームは、赤・緑・青の3色が争うリアルタイムシミュレーションゲームです。');
        alert('このゲームでは1秒当たり'+game.fps+'ターンの処理が行われます。');
        alert(game.fps*10+'ターンごとにマップ上に自陣営の色を配置することが可能になります。');
        alert('あなたは赤色で、緑に強いですが青には負けてしまいます。');
        alert('100ターンの間に上手くタイルを配置して勝利してください。');
    }

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
                    alert('勝者は赤です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else if (totalG >= totalB)  {
                    alert('勝者は緑です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }   else    {
                    alert('勝者は青です。全体のRGB値は'+totalR+','+totalG+','+totalB+'でした。');
                }
                game.stop();
            } else if ( game.frame > 0 && game.frame%10 == 0 ) {
                if ( !debug ) {
                    alert('タイルに色を配置可能になりました（あと'+tileMap.readyTouch+'回）');
                }
            }
            document.title='残りフレーム:'+(GAME_LENGTH-game.frame);
        });
    };
    game.start();
}