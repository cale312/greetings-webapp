var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var namesGreeted = {};
var names = [];
var count = 0;

//check connection to the db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');
});

//a 'blueprint' for how it will accept the names
var greetSchema = mongoose.Schema({name: String, greetCount: Number});

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

function manageGreeting(newName, cb) {
  Greetings.findOne({name: newName}, function(err, greetedName) {
    if (greetedName) {
      Greetings.update({name: newName}, {counter: newName.greetCount + 1}, cb);
      return;
    } else {
      Greetings.create({name: newName}, cb);
      return;
    }
  });
}

app.post('/greeting', function (req, res, next) {
  for (var i = 0; i < namesGreeted.length; i++) {};

  var language = req.body.lang;
  var newName = req.body.nameInput;

  function getMessage(language) {
    if (language === 'english') {
      return 'Hello';
    } else if (language === 'espanol') {
      return 'Hola';
    } else if (language === 'xhosa') {
      return 'Molo';
    }
  }
  manageGreeting(newName, function(err, greeting) {
    if (err) {
      return next(err);
      //console.log('Error storing name');
    } else {
      //return res.redirect('greeting');
      var greetingMessage = getMessage(language);
      //??? render with the new greeting...
      res.render('greeting', {name: newName, count: count, greeting: greetingMessage});
    }
  });
});

app.get('/history', function (req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('history', {names: names, count: count});
});

//server
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
