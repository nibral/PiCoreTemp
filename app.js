'use strict';

var express = require('express');
var app = express();

var exec = require('child_process').exec;
const coretempCmd = 'cat /sys/class/thermal/thermal_zone0/temp';

app.get('/', (req, res) => {
  let child = exec(coretempCmd, (err, stdout, stderr) => {
    let temp = stdout / 1000;
    res.send(temp + ' °C');
  });
});

var server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
