'use strict';

const express = require('express');
const app = express();
const exec = require('child_process').exec;

// for parsing application/x-www-form-urlencoded
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('/', (req, res) => {
    // ignore neither GET nor POST
    const method = req.method;
    if (method !== 'GET' && method !== 'POST') {
        res.status(405).end();
        return;
    }

    // get cpu temperature
    const coretempCmd = 'cat /sys/class/thermal/thermal_zone0/temp';
    exec(coretempCmd, (err, stdout) => {
        if (err) {
            res.send(err);
        }

        // round 1 digit after the decimal point
        let temp = stdout / 100;
        temp = Math.round(temp);
        temp /= 10;

        // response simply JSON in GET method
        if (method === 'GET') {
            res.json({
                temp: temp
            }).end();
            return;
        }

        // response to slack
        const SLACK_HOOK_USERNAME = 'pi-core-temp';
        const username = req.body.user_name;
        if (username !== SLACK_HOOK_USERNAME) {
            res.json({
                text: '@' + username + ' ' + temp + '℃',
                link_names: 1   // eslint-disable-line
            });
        } else {
            res.send('');
        }
    });
});

// start server (default port is 3000)
const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});

