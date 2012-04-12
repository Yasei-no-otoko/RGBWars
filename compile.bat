java -jar compiler.jar --js tile.js --js_output_file tile-compiled.js --externs game.js --externs lib\enchant.js --compilation_level ADVANCED_OPTIMIZATIONS
java -jar compiler.jar --js game.js --js_output_file game-compiled.js --externs tile.js --externs lib\enchant.js --compilation_level ADVANCED_OPTIMIZATIONS
