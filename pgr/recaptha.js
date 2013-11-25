var simple_recaptcha = require('simple-recaptcha');
var express = require("express");
var app = express();

app.configure(function() {
    app.use(express.bodyParser());
});

app.post('/', function(req, res) {

  var privateKey = '6Lf1Z-oSAAAAALQA7XBiogtwa8gECDkzYg7n6Ewz';
  var ip = req.ip;
  var challenge = req.body.recaptcha_challenge_field;
  var response = req.body.recaptcha_response_field;

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {
    if (err) return res.send(err.message);
    res.send('verified');
  });
});

app.listen(8002);