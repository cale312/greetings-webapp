var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var names = [];
var count = "0";

//check connection to the db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');
});

//a 'blueprint' for how it will accept the names
var greetSchema = mongoose.Schema({name: String});

//how it will be model in the db
var Greetings = mongoose.model('Greetings', greetSchema);

//connect to the dB
mongoose.connect('mongodb://localhost/greetings');

//static files
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

//view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var port = process.env.PORT || 5000;


//routes
app.get('/', function(req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('index');
});

app.get('/greeting', function (req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('greeting');
});

app.post('/greeting', function (req, res) {
  if (req.body.lang === 'english' && req.body.nameInput !== "") {
    names.push(req.body);
    count = names.length;
    res.render('greeting', {name: req.body.nameInput, count: count, lang: 'Hello'});
  } else if (req.body.lang === 'xhosa' && req.body.nameInput !== "") {
    names.push(req.body);
    count = names.length;
    res.render('greeting', {name: req.body.nameInput, count: count, lang: 'Molo'});
  } else if (req.body.lang === 'espanol' && req.body.nameInput !== "") {
    names.push(req.body);
    count = names.length;
    res.render('greeting', {name: req.body.nameInput, count: count, lang: 'Hola'});
  } else {
    res.sendFile(__dirname + '/404.html', function () {console.log('404 Error!!');});
  }
  var newName = new Greetings({name: req.body.nameInput});

  console.log(req.body);
  console.log(names);
});

app.get('/history', function (rq, res) {
  res.render('history', {data: names, count: count});
});

//server
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
