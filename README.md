RGBウォーズ
======================
このゲームは赤、緑、青の3色が争うリアルタイムシミュレーションです。  
黒色のタイルに色を配置し、最も多くのタイルを自分の色に染め上げることを目指します。  

開発環境
----------
・使用言語  
 HTML5＋Javascript  

・使用ライブラリ  
 enchant.js  
 
・開発に使用したOS  
 Windows 7 x64
 
実行方法
----------
・通常モードを実行する場合  
(1) index.htmlを開く  
(2) http://rgbwars-rukantos.dotcloud.com/ へアクセスする  

・大規模・高速モードを実行する場合  
(1) wizard.htmlを開く  
(2) http://rgbwars-rukantos.dotcloud.com/wizard.html へアクセスする  

※1  
 PC上での動作はOpera 12.00　/　Internet Explorer 9　/　Firefox 11　/　Safari5.1　/　Chrome 20  
 スマートフォン上での動作はMobile Safari@iOS5.1　/　Android Browser@Android2.3.4で確認を行いました。  
 
※2  
 大規模・高速モードは非常に処理の負荷が高いため、実行する際はChromeの最新バージョンを推奨します。

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
　Closure Compilerでjsファイルを圧縮する際に用いたWindowsバッチファイルです。  

・dotcloud.yml  
 dotcloud.comにデプロイするための設定ファイルです。  

 
ライセンス
----------
Copyright &copy; 2012 Haruto Watanabe
Distributed under the [MIT License][mit].
[MIT]: http://www.opensource.org/licenses/mit-license.php