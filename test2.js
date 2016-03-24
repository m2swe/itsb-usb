var process = require('child_process'),
    ls = process.spawn('sh',['test.sh'], { stdio: 'inherit' })

var password = 'NORRporten2015\n';

ls.stdout.on('data', function(data) {
  console.log(data.toString());
  spawn.stdin.write(password);
});
