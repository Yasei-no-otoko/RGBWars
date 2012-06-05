
if debug is true then GAME_FPS = 100 else GAME_FPS = 1
if debug is true then MAP_WIDTH = 32 else MAP_WIDTH = 16
if debug is true then MAP_HEIGHT = 32 else MAP_HEIGHT = 16
if debug is true then GAME_LENGTH = 500 else GAME_LENGTH = 100
TILE_SIZE = 16



# ウィンドウが読み込まれた時に実行
window.onload = -> 
  game = new Game(MAP_WIDTH*TILE_SIZE, MAP_HEIGHT*TILE_SIZE)
  game.fps = GAME_FPS

  #簡易チュートリアル
  alert "RGBウォーズ\nこのゲームはenchant.jsを使用しています Copyright (c) Ubiquitous Entertainment Inc."
    
  if debug is true
    alert "これはテスト用の大規模・高速モードです。スペック試しにどうぞ"
  else
    alert "このゲームは、赤・緑・青の3色が争うリアルタイムシミュレーションゲームです。"
    alert "このゲームでは1秒当たり#{game.fps}ターンの処理が行われます。"
    alert "ゲーム中は#{game.fps*10}ターンごとにマップ上に自陣営の色を配置することが可能になります。"
    alert "あなたは赤色で、緑に強いですが青には負けてしまいます。"
    alert "100ターンの間に上手くタイルを配置して勝利してください。"
  

  ###
    ゲームの初期化処理
    @function
  ###
  game.onload = ->
    @tileMap = new TileMap ->
    game.rootScene.addChild(@tileMap)

    #フレームごとに実行される処理
    game.addEventListener 'enterframe', =>
      document.title = "残りフレーム:#{GAME_LENGTH-game.frame}"
      if game.frame is GAME_LENGTH
        #ゲームの終了処理
        totalR=0
        totalG=0
        totalB=0

        for i in [MAP_WIDTH..0] 
          for j in [MAP_HEIGHT..0]
            totalR += @tileMap.tiles[i][j]._r;
            totalG += @tileMap.tiles[i][j]._g;
            totalB += @tileMap.tiles[i][j]._b;

        if totalR >= totalG and totalR >= totalB
          alert "勝者は赤です。全体のRGB値は#{totalR},#{totalG},#{totalB}でした。"
        else if totalG >= totalB
          alert "勝者は緑です。全体のRGB値は#{totalR},#{totalG},#{totalB}でした。"
        else
          alert "勝者は青です。全体のRGB値は#{totalR},#{totalG},#{totalB}でした。"
        
        do game.stop
        return
      else if game.frame > 0 and game.frame%10 is 0
        #操作可能回数が増えたことをプレイヤーに伝える
        if debug isnt true
          alert "色を配置可能になりました（残り#{@tileMap.readyTouch}回）"
        return
    return
  do game.start
  return