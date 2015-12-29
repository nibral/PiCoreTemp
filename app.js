'use strict';

var express = require('express');
var app = express();
var exec = require('child_process').exec;

// CPU温度計測コマンド
const coretempCmd = 'cat /sys/class/thermal/thermal_zone0/temp';

app.get('/', (req, res) => {
  let child = exec(coretempCmd, (err, stdout, stderr) => {
    // 小数点以下1桁で四捨五入する
    let temp = stdout / 100;
    temp = Math.round(temp);
    temp /= 10;
    
    // JSONで返事
    res.json({ temp: temp });
  });
});

// 特に指定がなければ3000番ポートで待ち受け
var server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});

