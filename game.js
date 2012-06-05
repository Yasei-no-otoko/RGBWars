// Generated by CoffeeScript 1.3.3
(function() {
  ﻿;

  var GAME_FPS, GAME_LENGTH, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, Tile, TileMap,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (debug === true) {
    GAME_FPS = 100;
  } else {
    GAME_FPS = 1;
  }

  if (debug === true) {
    MAP_WIDTH = 32;
  } else {
    MAP_WIDTH = 16;
  }

  if (debug === true) {
    MAP_HEIGHT = 32;
  } else {
    MAP_HEIGHT = 16;
  }

  if (debug === true) {
    GAME_LENGTH = 500;
  } else {
    GAME_LENGTH = 100;
  }

  TILE_SIZE = 16;

  window.onload = function() {
    var game;
    game = new Game(MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    game.fps = GAME_FPS;
    alert("RGBウォーズ\nこのゲームはenchant.jsを使用しています Copyright (c) Ubiquitous Entertainment Inc.");
    if (debug === true) {
      alert("これはテスト用の大規模・高速モードです。スペック試しにどうぞ");
    } else {
      alert("このゲームは、赤・緑・青の3色が争うリアルタイムシミュレーションゲームです。");
      alert("このゲームでは1秒当たり" + game.fps + "ターンの処理が行われます。");
      alert("ゲーム中は" + (game.fps * 10) + "ターンごとにマップ上に自陣営の色を配置することが可能になります。");
      alert("あなたは赤色で、緑に強いですが青には負けてしまいます。");
      alert("100ターンの間に上手くタイルを配置して勝利してください。");
    }
    /*
        ゲームの初期化処理
        @function
    */

    game.onload = function() {
      var _this = this;
      this.tileMap = new TileMap(function() {});
      game.rootScene.addChild(this.tileMap);
      game.addEventListener('enterframe', function() {
        var i, j, totalB, totalG, totalR, _i, _j;
        document.title = "残りフレーム:" + (GAME_LENGTH - game.frame);
        if (game.frame === GAME_LENGTH) {
          totalR = 0;
          totalG = 0;
          totalB = 0;
          for (i = _i = MAP_WIDTH; MAP_WIDTH <= 0 ? _i <= 0 : _i >= 0; i = MAP_WIDTH <= 0 ? ++_i : --_i) {
            for (j = _j = MAP_HEIGHT; MAP_HEIGHT <= 0 ? _j <= 0 : _j >= 0; j = MAP_HEIGHT <= 0 ? ++_j : --_j) {
              totalR += _this.tileMap.tiles[i][j]._r;
              totalG += _this.tileMap.tiles[i][j]._g;
              totalB += _this.tileMap.tiles[i][j]._b;
            }
          }
          if (totalR >= totalG && totalR >= totalB) {
            alert("勝者は赤です。全体のRGB値は" + totalR + "," + totalG + "," + totalB + "でした。");
          } else if (totalG >= totalB) {
            alert("勝者は緑です。全体のRGB値は" + totalR + "," + totalG + "," + totalB + "でした。");
          } else {
            alert("勝者は青です。全体のRGB値は" + totalR + "," + totalG + "," + totalB + "でした。");
          }
          game.stop();
        } else if (game.frame > 0 && game.frame % 10 === 0) {
          if (debug !== true) {
            alert("色を配置可能になりました（残り" + _this.tileMap.readyTouch + "回）");
          }
        }
      });
    };
    game.start();
  };

  Tile = (function(_super) {

    __extends(Tile, _super);

    function Tile(r, g, b, x, y) {
      Tile.__super__.constructor.call(this, this, TILE_SIZE, TILE_SIZE);
      this._r = r;
      this._g = g;
      this._b = b;
      this._x = x;
      this._y = y;
      this.width = TILE_SIZE;
      this.height = TILE_SIZE;
      this.backgroundColor = "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
      this.className = "tile";
      return;
    }

    Tile.prototype.addColor = function(r, g, b) {
      var math;
      math = Math;
      this._r += r;
      this._g += g;
      this._b += b;
      this.rgbClamp(math.floor(this._x / TILE_SIZE), math.floor(this._y / TILE_SIZE));
      this.backgroundColor = "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
    };

    Tile.prototype.updateView = function() {
      this.backgroundColor = "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
    };

    Tile.prototype.rgbClamp = function() {
      var math;
      math = Math;
      this._r = math.max(0, math.min(255, this._r));
      this._g = math.max(0, math.min(255, this._g));
      this._b = math.max(0, math.min(255, this._b));
    };

    return Tile;

  })(enchant.Entity);

  TileMap = (function(_super) {

    __extends(TileMap, _super);

    function TileMap() {
      var i, j, _i, _j;
      TileMap.__super__.constructor.call(this, this, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
      this.readyTouch = 1;
      this.initTiles();
      for (i = _i = MAP_WIDTH; MAP_WIDTH <= 0 ? _i <= 0 : _i >= 0; i = MAP_WIDTH <= 0 ? ++_i : --_i) {
        for (j = _j = MAP_HEIGHT; MAP_HEIGHT <= 0 ? _j <= 0 : _j >= 0; j = MAP_HEIGHT <= 0 ? ++_j : --_j) {
          this.addChild(this.tiles[i][j]);
        }
      }
      this.addEventListener('touchstart', this.onTouch);
      this.addEventListener('enterframe', this.onEnterframe);
      return;
    }

    TileMap.prototype.initTiles = function() {
      var bX, bY, gX, gY, i, j, math, rX, rY, _i, _j, _k, _l, _m, _ref, _ref1;
      math = Math;
      this.tiles = new Array(MAP_WIDTH);
      for (i = _i = 0; 0 <= MAP_WIDTH ? _i <= MAP_WIDTH : _i >= MAP_WIDTH; i = 0 <= MAP_WIDTH ? ++_i : --_i) {
        this.tiles[i] = new Array(MAP_HEIGHT);
      }
      for (i = _j = MAP_WIDTH; MAP_WIDTH <= 0 ? _j <= 0 : _j >= 0; i = MAP_WIDTH <= 0 ? ++_j : --_j) {
        for (j = _k = MAP_HEIGHT; MAP_HEIGHT <= 0 ? _k <= 0 : _k >= 0; j = MAP_HEIGHT <= 0 ? ++_k : --_k) {
          this.tiles[i][j] = new Tile(0, 0, 0, i * TILE_SIZE, j * TILE_SIZE);
        }
      }
      rX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
      rY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
      this.tiles[rX][rY]._r = 255;
      gX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
      gY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
      for (i = _l = 0, _ref = Number.MAX_VALUE; 0 <= _ref ? _l <= _ref : _l >= _ref; i = 0 <= _ref ? ++_l : --_l) {
        if (gX === rX && gY === rY) {
          gX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
          gY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
        } else if (math.abs(gX - rX) < math.floor(MAP_WIDTH / 4) || math.abs(gY - rY) < math.floor(MAP_HEIGHT / 4)) {
          gX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
          gY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
        } else {
          break;
        }
      }
      this.tiles[gX][gY]._g = 255;
      bX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
      bY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
      for (i = _m = 0, _ref1 = Number.MAX_VALUE; 0 <= _ref1 ? _m <= _ref1 : _m >= _ref1; i = 0 <= _ref1 ? ++_m : --_m) {
        if ((bX === rX && bY === rY) || (bX === gX && bY === gY)) {
          bX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
          bY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
        } else if ((math.abs(bX - rX) < math.floor(MAP_WIDTH / 4) || math.abs(bY - rY) < math.floor(MAP_HEIGHT / 4)) || (math.abs(bX - gX) < math.floor(MAP_WIDTH / 4) || math.abs(bY - gY) < math.floor(MAP_HEIGHT / 4))) {
          bX = math.floor(math.random() * (MAP_WIDTH - 2) + 1);
          bY = math.floor(math.random() * (MAP_HEIGHT - 2) + 1);
        } else {
          break;
        }
      }
      this.tiles[bX][bY]._b = 255;
    };

    TileMap.prototype.onTouch = function(e) {
      var X, Y, math;
      if (this.readyTouch) {
        this.readyTouch--;
        math = Math;
        X = math.floor(e.localX / TILE_SIZE);
        Y = math.floor(e.localY / TILE_SIZE);
        this.tiles[X][Y].addColor(128, 0, 0);
      }
    };

    TileMap.prototype.onEnterframe = function() {
      var bX, bY, cacheTiles, gX, gY, i, j, math, _i, _j, _k, _l;
      cacheTiles = this.tiles;
      for (i = _i = 0; 0 <= MAP_WIDTH ? _i <= MAP_WIDTH : _i >= MAP_WIDTH; i = 0 <= MAP_WIDTH ? ++_i : --_i) {
        for (j = _j = 0; 0 <= MAP_HEIGHT ? _j <= MAP_HEIGHT : _j >= MAP_HEIGHT; j = 0 <= MAP_HEIGHT ? ++_j : --_j) {
          this.tileAdvance(i, j, cacheTiles[i][j]);
        }
      }
      for (i = _k = MAP_WIDTH; MAP_WIDTH <= 0 ? _k <= 0 : _k >= 0; i = MAP_WIDTH <= 0 ? ++_k : --_k) {
        for (j = _l = MAP_HEIGHT; MAP_HEIGHT <= 0 ? _l <= 0 : _l >= 0; j = MAP_HEIGHT <= 0 ? ++_l : --_l) {
          this.tileWars(i, j);
          this.tiles[i][j].updateView();
        }
      }
      if (this.age > 0 && this.age % 10 === 0) {
        math = Math;
        this.readyTouch++;
        gX = math.floor(math.random() * (MAP_WIDTH - 1));
        gY = math.floor(math.random() * (MAP_HEIGHT - 1));
        this.tiles[gX][gY].addColor(0, 128, 0);
        bX = math.floor(math.random() * (MAP_WIDTH - 1));
        bY = math.floor(math.random() * (MAP_HEIGHT - 1));
        this.tiles[bX][bY].addColor(0, 0, 128);
      }
    };

    TileMap.prototype.tileAdvance = function(x, y, cacheTile) {
      var blue, green, math, red;
      red = cacheTile._r;
      blue = cacheTile._b;
      green = cacheTile._g;
      math = Math;
      if (x > 0) {
        this.tiles[x - 1][y]._r += math.floor(red / 10);
        this.tiles[x - 1][y]._g += math.floor(green / 10);
        this.tiles[x - 1][y]._b += math.floor(blue / 10);
        this.tiles[x - 1][y].rgbClamp();
      }
      if (x < MAP_WIDTH - 1) {
        this.tiles[x + 1][y]._r += math.floor(red / 10);
        this.tiles[x + 1][y]._g += math.floor(green / 10);
        this.tiles[x + 1][y]._b += math.floor(blue / 10);
        this.tiles[x + 1][y].rgbClamp();
      }
      if (y > 0) {
        this.tiles[x][y - 1]._r += math.floor(red / 10);
        this.tiles[x][y - 1]._g += math.floor(green / 10);
        this.tiles[x][y - 1]._b += math.floor(blue / 10);
        this.tiles[x][y - 1].rgbClamp();
      }
      if (y < MAP_HEIGHT - 1) {
        this.tiles[x][y + 1]._r += math.floor(red / 10);
        this.tiles[x][y + 1]._g += math.floor(green / 10);
        this.tiles[x][y + 1]._b += math.floor(blue / 10);
        this.tiles[x][y + 1].rgbClamp();
      }
    };

    TileMap.prototype.tileWars = function(x, y) {
      var blue, dB, dG, dR, green, math, red;
      red = this.tiles[x][y]._r;
      blue = this.tiles[x][y]._b;
      green = this.tiles[x][y]._g;
      dR = 0;
      dG = 0;
      dB = 0;
      math = Math;
      if (red > 0) {
        if (green > 0) {
          dR += math.floor(green / 10);
        }
        if (blue > 0) {
          dR -= math.floor(blue / 2);
        }
      }
      if (green > 0) {
        if (blue > 0) {
          dG += math.floor(blue / 10);
        }
        if (red > 0) {
          dG -= math.floor(red / 2);
        }
      }
      if (blue > 0) {
        if (red > 0) {
          dB += math.floor(red / 10);
        }
        if (green > 0) {
          dB -= math.floor(green / 2);
        }
      }
      this.tiles[x][y]._r += dR;
      this.tiles[x][y]._g += dG;
      this.tiles[x][y]._b += dB;
      this.tiles[x][y].rgbClamp();
    };

    return TileMap;

  })(enchant.Group);

}).call(this);
