var proxy = require('express-http-proxy');
var express = require('express');
const app = express();

app.use(express.static('../build'));

app.use('/db', proxy('http://localhost:3002'));
app.use('/socket', proxy('http://localhost:4000'));

app.listen(80);