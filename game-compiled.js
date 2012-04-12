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
enchant();var TILE_SIZE=32,MAP_WIDTH=debug?32:16,MAP_HEIGHT=debug?32:16,g=debug?30:1,h=debug?500:100;
window.onload=function(){var a=new Game(MAP_WIDTH*TILE_SIZE,MAP_HEIGHT*TILE_SIZE);a.fps=g;alert("RGB\u30a6\u30a9\u30fc\u30bause enchant.js Copyright (c) Ubiquitous Entertainment Inc.");debug?alert("\u3053\u308c\u306f\u30c6\u30b9\u30c8\u7528\u306e\u5927\u898f\u6a21\u30fb\u9ad8\u901f\u30e2\u30fc\u30c9\u3067\u3059\u3002\u30b9\u30da\u30c3\u30af\u8a66\u3057\u306b\u3069\u3046\u305e"):(alert("\u3053\u306e\u30b2\u30fc\u30e0\u306f\u3001\u8d64\u30fb\u7dd1\u30fb\u9752\u306e3\u8272\u304c\u4e89\u3046\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u30b2\u30fc\u30e0\u3067\u3059\u3002"),alert("\u3053\u306e\u30b2\u30fc\u30e0\u3067\u306f1\u79d2\u5f53\u305f\u308a"+
a.fps+"\u30bf\u30fc\u30f3\u306e\u51e6\u7406\u304c\u884c\u308f\u308c\u307e\u3059\u3002"),alert(10*a.fps+"\u30bf\u30fc\u30f3\u3054\u3068\u306b\u30de\u30c3\u30d7\u4e0a\u306b\u81ea\u9663\u55b6\u306e\u8272\u3092\u914d\u7f6e\u3059\u308b\u3053\u3068\u304c\u53ef\u80fd\u306b\u306a\u308a\u307e\u3059\u3002"),alert("\u3042\u306a\u305f\u306f\u8d64\u8272\u3067\u3001\u7dd1\u306b\u5f37\u3044\u3067\u3059\u304c\u9752\u306b\u306f\u8ca0\u3051\u3066\u3057\u307e\u3044\u307e\u3059\u3002"),alert("100\u30bf\u30fc\u30f3\u306e\u9593\u306b\u4e0a\u624b\u304f\u30bf\u30a4\u30eb\u3092\u914d\u7f6e\u3057\u3066\u52dd\u5229\u3057\u3066\u304f\u3060\u3055\u3044\u3002"));
a.onload=function(){this.a=new TileMap;a.rootScene.addChild(this.a);a.addEventListener("enterframe",function(){if(a.frame==h){for(var b=0,c=0,d=0,e=MAP_WIDTH;e--;)for(var f=MAP_HEIGHT;f--;){b=b+this.a.tiles[e][f]._r;c=c+this.a.tiles[e][f]._g;d=d+this.a.tiles[e][f]._b}b>=c&&b>=d?alert("\u52dd\u8005\u306f\u8d64\u3067\u3059\u3002\u5168\u4f53\u306eRGB\u5024\u306f"+b+","+c+","+d+"\u3067\u3057\u305f\u3002"):c>=d?alert("\u52dd\u8005\u306f\u7dd1\u3067\u3059\u3002\u5168\u4f53\u306eRGB\u5024\u306f"+b+","+c+
","+d+"\u3067\u3057\u305f\u3002"):alert("\u52dd\u8005\u306f\u9752\u3067\u3059\u3002\u5168\u4f53\u306eRGB\u5024\u306f"+b+","+c+","+d+"\u3067\u3057\u305f\u3002");a.stop()}else a.frame>0&&a.frame%10==0&&(debug||alert("\u8272\u3092\u914d\u7f6e\u53ef\u80fd\u306b\u306a\u308a\u307e\u3057\u305f\uff08\u6b8b\u308a"+this.a.readyTouch+"\u56de\uff09"));document.title="\u6b8b\u308a\u30d5\u30ec\u30fc\u30e0:"+(h-a.frame)})};a.start()};
