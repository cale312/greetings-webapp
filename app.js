var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var names = [];
var count = 1;

//check connection to the db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');
});

//a 'blueprint' for how it will accept the names
var greetSchema = mongoose.Schema({
  name: String
});

//how it will be model in the db
var Greetings = mongoose.model('Greetings', greetSchema);

//connect to the dB
mongoose.connect('mongodb://localhost/greetings');

//view engine
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
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
  var newName = new Greetings({name: req.body.name});
  console.log(req.body);
  if (req.body.lang === 'english' && req.body.name !== "") {
    res.render('greeting', {name: req.body, count: count, lang: 'Hello'});
    names.push({name : req.body.name});
    count += 1;
  } else if (req.body.lang === 'xhosa' && req.body.name !== "") {
    res.render('greeting', {name: req.body, count: count, lang: 'Molo'});
    names.push({name : req.body.name});
    count += 1;
  } else if (req.body.lang === 'espanol' && req.body.name !== "") {
    res.render('greeting', {name: req.body, count: count, lang: 'Hola'});
    names.push({name : req.body.name});
    count += 1;
  } else {
    res.sendFile(__dirname + '/404.html', function () {console.log('404 Error!!');});
  }
  newName.save(function (err) {
    if (err) {
      console.log('error saving name');
    } else {
      console.log('name has been successfully stored in the db');
    }
  });
  console.log(names);
});

app.get('/history', function (rq, res) {
  res.render('history', {data: names, count: count});
});

//server
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
