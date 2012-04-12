/*

 Copyright (c) 2012 Haruto Watanabe
 Copyright (c) Ubiquitous Entertainment Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
Tile=enchant.Class.create(enchant.Entity,{initialize:function(a,b,c,e,f){enchant.Entity.call(this,TILE_SIZE,TILE_SIZE);this._r=a;this._g=b;this._b=c;this._x=e;this._y=f;this.width=this.height=TILE_SIZE;this.backgroundColor="rgb("+this._r+","+this._g+","+this._b+")";this.className="tile"},b:function(a,b,c){var e=Math;this._r+=a;this._g+=b;this._b+=c;this.a(e.floor(this._x/TILE_SIZE),e.floor(this._y/TILE_SIZE));this.backgroundColor="rgb("+this._r+","+this._g+","+this._b+")"},h:function(){this.backgroundColor=
"rgb("+this._r+","+this._g+","+this._b+")"},a:function(){var a=Math;this._r=a.max(0,a.min(255,this._r));this._g=a.max(0,a.min(255,this._g));this._b=a.max(0,a.min(255,this._b))}});
TileMap=enchant.Class.create(enchant.Group,{initialize:function(){enchant.Group.call(this,MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);this.c();this.readyTouch=1;for(var a=MAP_WIDTH;a--;)for(var b=MAP_HEIGHT;b--;)this.addChild(this.tiles[a][b]);this.addEventListener("touchstart",this.e);this.addEventListener("enterframe",this.d)},c:function(){var a=Math;this.tiles=Array(MAP_WIDTH);for(var b=0;b<MAP_WIDTH;b++)this.tiles[b]=Array(MAP_HEIGHT);for(b=MAP_WIDTH;b--;)for(var c=MAP_HEIGHT;c--;)this.tiles[b][c]=
new Tile(0,0,0,b*TILE_SIZE,c*TILE_SIZE);b=a.floor(a.random()*(MAP_WIDTH-2)+1);c=a.floor(a.random()*(MAP_HEIGHT-2)+1);this.tiles[b][c]._r=255;for(var e=a.floor(a.random()*(MAP_WIDTH-2)+1),f=a.floor(a.random()*(MAP_HEIGHT-2)+1);;)if(e==b&&f==c)e=a.floor(a.random()*(MAP_WIDTH-2)+1),f=a.floor(a.random()*(MAP_HEIGHT-2)+1);else if(a.abs(e-b)<a.floor(MAP_WIDTH/4)||a.abs(f-c)<a.floor(MAP_HEIGHT/4))e=a.floor(a.random()*(MAP_WIDTH-2)+1),f=a.floor(a.random()*(MAP_HEIGHT-2)+1);else break;this.tiles[e][f]._g=
255;for(var d=a.floor(a.random()*(MAP_WIDTH-2)+1),g=a.floor(a.random()*(MAP_HEIGHT-2)+1);;)if(d==b&&g==c||d==e&&g==f)d=a.floor(a.random()*(MAP_WIDTH-2)+1),g=a.floor(a.random()*(MAP_HEIGHT-2)+1);else if(a.abs(d-b)<a.floor(MAP_WIDTH/4)||a.abs(g-c)<a.floor(MAP_HEIGHT/4)||a.abs(d-e)<a.floor(MAP_WIDTH/4)||a.abs(g-f)<a.floor(MAP_HEIGHT/4))d=a.floor(a.random()*(MAP_WIDTH-2)+1),g=a.floor(a.random()*(MAP_HEIGHT-2)+1);else break;this.tiles[d][g]._b=255},e:function(a){if(0<this.readyTouch){this.readyTouch--;
var b=Math;this.tiles[b.floor(a.localX/TILE_SIZE)][b.floor(a.localY/TILE_SIZE)].b(128,0,0)}},d:function(){for(var a=this.tiles,b=0;b<MAP_WIDTH;b++)for(var c=0;c<MAP_HEIGHT;c++)this.f(b,c,a[b][c]);for(b=MAP_WIDTH;b--;)for(c=MAP_HEIGHT;c--;)this.g(b,c),this.tiles[b][c].h();0<this.age&&0==this.age%10&&(a=Math,this.readyTouch++,this.tiles[a.floor(a.random()*(MAP_WIDTH-1))][a.floor(a.random()*(MAP_HEIGHT-1))].b(0,128,0),this.tiles[a.floor(a.random()*(MAP_WIDTH-1))][a.floor(a.random()*(MAP_HEIGHT-1))].b(0,
0,128))},f:function(a,b,c){var e=c._r,f=c._g,c=c._b,d=Math;0<a&&(this.tiles[a-1][b]._r+=d.floor(e/10),this.tiles[a-1][b]._g+=d.floor(f/10),this.tiles[a-1][b]._b+=d.floor(c/10),this.tiles[a-1][b].a());a<MAP_WIDTH-1&&(this.tiles[a+1][b]._r+=d.floor(e/10),this.tiles[a+1][b]._g+=d.floor(f/10),this.tiles[a+1][b]._b+=d.floor(c/10),this.tiles[a+1][b].a());0<b&&(this.tiles[a][b-1]._r+=d.floor(e/10),this.tiles[a][b-1]._g+=d.floor(f/10),this.tiles[a][b-1]._b+=d.floor(c/10),this.tiles[a][b-1].a());b<MAP_HEIGHT-
1&&(this.tiles[a][b+1]._r+=d.floor(e/10),this.tiles[a][b+1]._g+=d.floor(f/10),this.tiles[a][b+1]._b+=d.floor(c/10),this.tiles[a][b+1].a())},g:function(a,b){var c=this.tiles[a][b]._r,e=this.tiles[a][b]._g,f=this.tiles[a][b]._b,d=0,g=0,i=0,h=Math;0<c&&(0<e&&(d+=h.floor(e/10)),0<f&&(d-=h.floor(f/2)));0<e&&(0<f&&(g+=h.floor(f/10)),0<c&&(g-=h.floor(c/2)));0<f&&(0<c&&(i+=h.floor(c/10)),0<e&&(i-=h.floor(e/2)));this.tiles[a][b]._r+=d;this.tiles[a][b]._g+=g;this.tiles[a][b]._b+=i;this.tiles[a][b].a()}});
