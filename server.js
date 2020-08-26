var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');

app.use(cors());

mongoose.connect('mongodb://localhost/ManualAuth');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard&',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const http = require('http').createServer(app).listen(3000);

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

var Home = require('./routes/homeroutes');
app.use('/', Home);

// catch 404 and forward to error handler
app.use(function(req,res){
  res.status(404).render('error');
});



app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen(4000, function () {
  console.log('Express app listening on port 4000');
});
