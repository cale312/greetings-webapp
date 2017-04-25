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
var greetSchema = mongoose.Schema({
    name: String,
    greetCount: Number
  });

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


//return the selected greet in prefared language
function getMessage(language) {
  if (language === 'english') {
    return 'Hello';
  } else if (language === 'espanol') {
    return 'Hola';
  } else if (language === 'xhosa') {
    return 'Molo';
  }
}

//looks for the name in the database
function manageGreeting(newName, fn) {
  Greetings.findOne({name: newName}, function(err, greetedName) {
    if (greetedName) {
      Greetings.update({name: newName}, {greetCount: Number(greetedName.greetCount) + 1}, fn);
      console.log('Name updated');
      return;
    } else {
      Greetings.create({name: newName, greetCount : 1}, fn);
      console.log('Name created');
      return;
    }
  });
}

app.post('/greeting', function (req, res, next) {

  var language = req.body.lang;
  var newName = req.body.nameInput;
  var greetBtn = req.body.greetBtn;
  var resetBtn = req.body.resetBtn;

  if (greetBtn) {
    var processGreetingResult = function(err, theGreeting) {
      var greetingMessage = getMessage(language);
      for (var i = 0; i < namesGreeted.length; i++) {};
      if (err) {
        return next(err);
        //console.log('Error storing name');
      } else if (namesGreeted[newName] !== undefined && newName !== "" && greetingMessage) {
        res.render('greeting', {name: newName, count: theGreeting.greetCount, greeting: greetingMessage});
      } else if (namesGreeted[newName] === undefined && newName !== "" && greetingMessage) {
        namesGreeted[newName] = 1;
        names.push(newName);
        console.log(names);
        Greetings.findOne({name : newName}, function(err, theGreeting) {
          res.render('greeting', {name: newName, count: theGreeting.greetCount, greeting: greetingMessage});
        });
      }
    }
    manageGreeting(newName, processGreetingResult);
  } else if (resetBtn) {
    names = [];
    Greetings.remove({}, function (err) {
      if (err) {
        console.log('Error removing names from DB');
      } else {
        console.log('Names removed from DB');
      }
    });
    res.render('greeting', {});
  }
});

app.get('/greetings', function (req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('greetings', {names: names, count: count});
});

//server
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
