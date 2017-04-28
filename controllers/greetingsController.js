module.exports = function(app) {
  var mongoose = require('mongoose');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('We are connected');
  });

  var greetSchema = mongoose.Schema({name: String, greetCount: Number});
  var Greetings = mongoose.model('Greetings', greetSchema);

  mongoose.connect('mongodb://localhost/greetings');

  var namesGreeted = {};
  var names = [];
  var count = 0;

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

  app.get('/', function(req, res) {
    console.log('Request was made on: ' + req.url);
    res.render('index');
  });

  app.get('/greeting', function (req, res) {
    console.log('Request was made on: ' + req.url);
    res.render('greeting');
  });

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
}
