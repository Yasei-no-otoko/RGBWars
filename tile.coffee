class Tile extends enchant.Entity
  constructor: (r, g, b, x, y) ->
    super this, TILE_SIZE, TILE_SIZE
    @_r = r
    @_g = g
    @_b = b
    @_x = x
    @_y = y

    @width = TILE_SIZE
    @height = TILE_SIZE

    @backgroundColor = "rgb(#{@_r}, #{@_g}, #{@_b})"
    @className = "tile"
    return

  addColor: (r, g, b) ->
    math = Math
    @_r += r
    @_g += g
    @_b += b
    @rgbClamp math.floor(@_x / TILE_SIZE), math.floor(@_y / TILE_SIZE)
    @backgroundColor = "rgb(#{@_r}, #{@_g}, #{@_b})"
    return

  updateView: ->
    @backgroundColor = "rgb(#{@_r}, #{@_g}, #{@_b})"
    return

  rgbClamp: ->
    math = Math
    @_r = math.max(0, math.min(255, @_r))
    @_g = math.max(0, math.min(255, @_g))
    @_b = math.max(0, math.min(255, @_b))
    return

class TileMap extends enchant.Group
  constructor: ->
    super this, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE
    @readyTouch = 1

    do @initTiles

    for i in [MAP_WIDTH..0]
      for j in [MAP_HEIGHT..0]
        @addChild @tiles[i][j]

    @addEventListener 'touchstart', @onTouch
    @addEventListener 'enterframe', @onEnterframe

    return

  initTiles: ->
    math = Math

    #タイル領域の確保
    @tiles = new Array(MAP_WIDTH)
    for i in [0..MAP_WIDTH]
      @tiles[i] = new Array(MAP_HEIGHT)

    #タイルの初期化
    for i in [MAP_WIDTH..0]
      for j in [MAP_HEIGHT..0]
        @tiles[i][j] = new Tile 0, 0, 0, i * TILE_SIZE, j * TILE_SIZE

    #赤を配置する
    rX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
    rY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
    @tiles[rX][rY]._r = 255

    #赤と近すぎない位置に緑を配置する
    gX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
    gY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
    for i in [0..Number.MAX_VALUE]
      if gX is rX and gY is rY
        gX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
        gY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
      else if (math.abs(gX - rX) < math.floor(MAP_WIDTH / 4) or math.abs(gY - rY) < math.floor( MAP_HEIGHT / 4) )
        gX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
        gY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
      else
        break
    @tiles[gX][gY]._g = 255

    #赤と緑に近すぎない位置に緑を配置する
    bX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
    bY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
    for i in [0..Number.MAX_VALUE]
      if (bX is rX and bY is rY) or (bX is gX and bY is gY)
        bX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
        bY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
      else if (math.abs(bX - rX) < math.floor(MAP_WIDTH / 4) or math.abs(bY - rY) < math.floor( MAP_HEIGHT / 4) ) || (math.abs(bX - gX) < math.floor(MAP_WIDTH / 4) or math.abs(bY - gY) < math.floor( MAP_HEIGHT / 4) )
        bX = math.floor(do math.random * (MAP_WIDTH - 2) + 1)
        bY = math.floor(do math.random * (MAP_HEIGHT - 2) + 1)
      else
        break
    @tiles[bX][bY]._b = 255
    return

  onTouch: (e) ->
    if (@readyTouch)
      @readyTouch--

      math = Math
      X = math.floor(e.localX / TILE_SIZE)
      Y = math.floor(e.localY / TILE_SIZE)
      @tiles[X][Y].addColor 128, 0, 0
      return

  onEnterframe: ->
    cacheTiles = @tiles

    for i in [0..MAP_WIDTH]
      for j in [0..MAP_HEIGHT]
        @tileAdvance i, j, cacheTiles[i][j]

    for i in [MAP_WIDTH..0]
      for j in [MAP_HEIGHT..0]
        @tileWars i, j
        do @tiles[i][j].updateView

    if @age > 0 and @age % 10 is 0
      math = Math
      @readyTouch++

      gX = math.floor(do math.random * (MAP_WIDTH - 1))
      gY = math.floor(do math.random * (MAP_HEIGHT - 1))
      @tiles[gX][gY].addColor 0, 128, 0

      bX = math.floor(do math.random * (MAP_WIDTH - 1))
      bY = math.floor(do math.random * (MAP_HEIGHT - 1))
      @tiles[bX][bY].addColor 0, 0, 128

    return

  tileAdvance: (x, y, cacheTile) ->
    red = cacheTile._r
    blue = cacheTile._b
    green = cacheTile._g

    math = Math

    if x > 0
      @tiles[x-1][y]._r += math.floor(red / 10)
      @tiles[x-1][y]._g += math.floor(green / 10)
      @tiles[x-1][y]._b += math.floor(blue / 10)
      do @tiles[x-1][y].rgbClamp
    if x < MAP_WIDTH - 1
      @tiles[x+1][y]._r += math.floor(red / 10)
      @tiles[x+1][y]._g += math.floor(green / 10)
      @tiles[x+1][y]._b += math.floor(blue / 10)
      do @tiles[x+1][y].rgbClamp
    if y > 0
      @tiles[x][y-1]._r += math.floor(red / 10)
      @tiles[x][y-1]._g += math.floor(green / 10)
      @tiles[x][y-1]._b += math.floor(blue / 10)
      do @tiles[x][y-1].rgbClamp
    if y < MAP_HEIGHT - 1
      @tiles[x][y+1]._r += math.floor(red / 10)
      @tiles[x][y+1]._g += math.floor(green / 10)
      @tiles[x][y+1]._b += math.floor(blue / 10)
      do @tiles[x][y+1].rgbClamp

    return

  tileWars: (x, y) ->
    red = @tiles[x][y]._r
    blue = @tiles[x][y]._b
    green = @tiles[x][y]._g
    dR = 0
    dG = 0
    dB = 0
    math = Math

    if red > 0
      if green > 0
        dR += math.floor(green / 10)
      if blue > 0
        dR -= math.floor(blue / 2)

    if green > 0
      if blue > 0
        dG += math.floor(blue / 10)
      if red > 0
        dG -= math.floor(red / 2)

    if blue > 0
      if red > 0
        dB += math.floor(red / 10)
      if green > 0
        dB -= math.floor(green / 2)

    @tiles[x][y]._r += dR
    @tiles[x][y]._g += dG
    @tiles[x][y]._b += dB
    do @tiles[x][y].rgbClamp
    return