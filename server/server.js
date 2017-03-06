var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'));

app.use(function (req, res) {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

app.listen(3000, function () {
  console.log('server starting!');
});