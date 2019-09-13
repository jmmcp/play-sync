"use strict";

require('dotenv').config();

var express = require('express');

var app = express();

var server = require('http').createServer(app);

app.use(express.static('build'));
server.listen(process.env.PORT, function (_) {
  var rhost = server.address().address;
  var rport = server.address().port;
  console.log("static host serving on ", rhost + ":" + rport);
});