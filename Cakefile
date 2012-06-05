{spawn} = require 'child_process'

task 'watch', 'watch src/ and concatenate them to lib/main.js', (callback) ->
  watch = spawn 'coffee', ['-w', './']
  watch.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  watch.stdout.on 'data', (data) ->
    console.log 'file changed'
    build = spawn 'coffee', ['-j', 'lib/main.js', '-cl', './']
    build.stderr.on 'data', (data) ->
      process.stderr.write data.toString()
    build.on 'exit', (code) ->
      if code is 0
        console.log 'build complete'