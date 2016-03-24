var spawn = require('child_process').spawn;
var exec = require('child_process').exec;


var child = spawn('sh', ['test.sh']);
//spawn('sh',['test.sh'], { stdio: 'inherit' })

child.stdin.setEncoding('utf8');

child.stdout.on('data', function(data) {
  console.log(data.toString());
  child.stdin.write('NORRporten2015\n');
  setTimeout(function() {
    child.stdin.end();
}, 3000);

});
