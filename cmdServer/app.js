// Everything above this line will be executed twice
if (false) {
  require('daemon')();
}

var express = require('express');
require('shelljs/global'); // for shell execution

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }
    //, { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
  ]
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');


var app = express();

var port = 8000;

// Authenticator
app.use(express.basicAuth('admin', 'password'));

//app.use(express.logger('dev'));
app.use(express.errorHandler()); 
app.use(express.bodyParser());
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(app.router);


var path = require('path');
//app.use(express.static(path.join(__dirname + '/')));
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.writeHead(302, {
    'location': '/index.html'
  });
  res.end();

  //res.end('Hello!');
});

app.use(express.static(__dirname + '/')); 

var CMD_REL = 'rel';
var REL_PORT = '25';

var CMD_DWN = 'dwn'; // shutdown
var CMD_RST = 'rst'; // restart

var CMD_MJG = 'mjg'; // mjpg-stream
var CMD_MTN = 'mtn'; // motion

var CMD_SCH = 'sch'; // schedule

function execCmd(cmd, mode, callback) {
  var shCmd = '';
  if (cmd == CMD_REL) {
    //shCmd = 'sudo python gpio.py ' + REL_PORT + ' ' + mode;

    //pinExport = '/sys/class/gpio/export';
    //pinUnexport = '/sys/class/gpio/unexport';
    //pin = '/sys/class/gpio/gpio' + REL_PORT;

    if (mode == 'on') {
       //shCmd = 'sudo /bin/sh -c "echo ' + REL_PORT + ' > ' + pinExport + '"';
       //shCmd += ' && sudo /bin/sh -c "echo out > ' + pin + '/direction "';
       //shCmd += ' && sudo /bin/sh -c "echo 1 > ' + pin + '/value "';

       shCmd = 'sudo /bin/sh /home/pi/cmdServer/rel.sh on';
    } else {
       //shCmd = 'sudo /bin/sh -c "echo 0 > ' + pin + '/value "';
       //shCmd += ' && sudo /bin/sh -c "echo ' + REL_PORT + ' > ' + pinUnexport + '"';

       shCmd = 'sudo /bin/sh /home/pi/cmdServer/rel.sh off';
    }
  } else if (cmd == CMD_DWN) {
      shCmd = 'sudo shutdown -h now ';
  } else if (cmd == CMD_RST) {
      shCmd = 'sudo shutdown -r now ';
  } else if (cmd == CMD_MJG) {
    if (mode == 'on') {
      shCmd = 'sudo service mjpg-streamer start ';
    } else {
      shCmd = 'sudo service mjpg-streamer stop ';
    }
  } else if (cmd == CMD_MTN) {
    if (mode == 'on') {
      shCmd = 'sudo service mymotion start ';
    } else {
      shCmd = 'sudo service mymotion stop ';
    }
  } else {
  }

  console.log('cmd: ' + shCmd);

  exec(shCmd, function(code, output) {
    console.log('Exit code:', code);
    console.log('Program output:', output);
    callback(code, output);
  });
}

app.post('/api/:cmd', function(req, res){
  var cmd = req.params.cmd;
  console.log('POST CMD: ' + cmd);

  var mode = req.body.mode;

  if (cmd == CMD_REL || cmd == CMD_DWN || cmd == CMD_RST 
   || cmd == CMD_MJG || cmd == CMD_MTN) {
    execCmd(cmd, mode, function(_code, _output) {
      if (_code == 0) {
        res.send(cmd + ' cmd ok');
      } else {
        res.send(cmd + ' cmd fail');
      }
    });
  } else if (cmd == CMD_SCH) {
    if (mode == 'on') {
      schedule_rel_on();
    } else {
      schedule_rel_off();
    }
    res.send(cmd + ' cmd ok');
  } else {
    res.send(500, { error: 'Invalid cmd!' });
  }
});


//var fs = require('fs');

app.use(function(err, req, res, next){
  console.error(err.stack);

  //var logfile = __dirname + '/err.log';
  //var content = JSON.stringify(err);
  //fs.writeFileSync(logfile, content,'utf8');

  res.send(500, 'Something broke!');
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});


var schedule = require('node-schedule');

var schedule = require('node-schedule');
var job_rel_on = null,
    job_rel_off = null;

function schedule_rel_off() {
  if (job_rel_on === null || job_rel_off === null) {
    console.log('Schedule not existing yet!');
    return;
  }

  job_rel_on.cancel();
  job_rel_off.cancel();
  job_rel_on = null;
  job_rel_off = null;
}

function schedule_rel_on() {
  if (job_rel_on || job_rel_off) {
    console.log('Schedule already existing!');
    return;
  }

  var rule_on = new schedule.RecurrenceRule();
  rule_on.hour = 11; // gmt+8: 19 h
  rule_on.minute = 0;
  rule_on.second = 0;

  var cmdRelOn = 'sudo /bin/sh /home/pi/cmdServer/rel.sh on';

  job_rel_on = schedule.scheduleJob(rule_on, function(){
    console.log('Scheduled rel on at: ' + new Date());

    exec(cmdRelOn, function(code, output) {
      console.log('Exit code:', code);
      console.log('Program output:', output);
    });
  });

  var rule_off = new schedule.RecurrenceRule();
  rule_off.hour = 13; // gmt+8: 21 h
  rule_off.minute = 30;
  rule_off.second = 0;

  var cmdRelOff = 'sudo /bin/sh /home/pi/cmdServer/rel.sh off';

  job_rel_off = schedule.scheduleJob(rule_off, function(){
    console.log('Scheduled rel off at: ' + new Date());

    exec(cmdRelOff, function(code, output) {
      console.log('Exit code:', code);
      console.log('Program output:', output);
    });
  });
}
