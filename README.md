RGBウォーズ
======================
このゲームは赤、緑、青の3色が争うリアルタイムシミュレーションです。  
黒色のタイルに色を配置し、最も多くのタイルを自分の色に染め上げることを目指します。  
 
実行方法
----------
・通常モードを実行する場合  
(1) index.htmlを開く  
(2) http://rgbwars-rukantos.dotcloud.com/ へアクセスする  

・大規模・高速モードを実行する場合  
(1) wizard.htmlを開く  
(2) http://rgbwars-rukantos.dotcloud.com/wizard.html へアクセスする  

ファイルリスト
----------
・README.md  
　このファイルです。  

・index.html  
　このHTMLでゲームが実行されます。  

・wizard.html  
　高負荷モードです。（非常に高負荷なのでChromeの最新バージョンでの閲覧を推奨）  

・game.js  
　メインループを記述したJavascriptコードです。  

・tile.js  
　タイルクラスを記述したJavascriptコードです。  

・game.css  
　タイルの形状を記述したstylesheetです。  

・-compilied.js  
　Closure Compilerで圧縮した軽量ファイルです。  

・compile.bat  
　Closure Compilerでjsファイルを圧縮する際のバッチ処理です。  

・dotcloud.yml  
 dotcloud.comにデプロイするための設定ファイルです。  

 
ライセンス
----------
Copyright &copy; 2012 Haruto Watanabe
Distributed under the [MIT License][mit].
[MIT]: http://www.opensource.org/licenses/mit-license.php