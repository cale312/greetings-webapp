module.exports = function(app) {
  'use strict';
  var mongoose = require('mongoose');
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    'use strict';
    console.log('We are connected');
  });

  const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/greetings";
  mongoose.connect(mongoURL);

  var greetSchema = mongoose.Schema({name: String, greetCount: Number});
  var greetings = mongoose.model('greetings', greetSchema);

  var namesGreeted = {};
  var names = [];
  var count = 0;

  //return the selected greet in prefared language
  function getMessage(language) {
    'use strict';
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
    'use strict';
    greetings.findOne({name: newName}, function(err, greetedName) {
      'use strict';
      if (greetedName) {
        greetings.update({name: newName}, {greetCount: Number(greetedName.greetCount) + 1}, fn);
        console.log('Name updated');
        return;
      } else {
        greetings.create({name: newName, greetCount : 1}, fn);
        console.log('Name created');
        return;
      }
    });
  }

  app.get('/', function(req, res) {
    'use strict';
    console.log('Request was made on: ' + req.url);
    res.render('index');
  });

  app.get('/greeting', function (req, res) {
    'use strict';
    console.log('Request was made on: ' + req.url);
    res.render('greeting', {count: count});
  });

  app.post('/greeting', function (req, res, next) {
    'use strict';
    var language = req.body.lang;
    var newName = req.body.nameInput;
    var greetBtn = req.body.greetBtn;
    var resetBtn = req.body.resetBtn;

    if (greetBtn) {
      var processGreetingResult = function(err, theGreeting) {
        'use strict';
        var greetCount = theGreeting.greetCount;
        var greetingMessage = getMessage(language);
        for (var i = 0; i < namesGreeted.length; i++) {};
        if (err) {
          return next(err);
        } else if (namesGreeted[newName] !== undefined && newName !== "" && greetingMessage) {
          res.render('greeting', {name: newName, count: count, greeting: greetingMessage});
        } else if (namesGreeted[newName] === undefined && newName !== "" && greetingMessage) {
          count += 1;
          namesGreeted[newName] = 1;
          names.push(newName);
          console.log(names);
          greetings.findOne({name : newName}, function(err, theGreeting) {
            'use strict';
            res.render('greeting', {name: newName, count: count, greeting: greetingMessage});
          });
        }
      }
      manageGreeting(newName, processGreetingResult);
    } else if (resetBtn) {
      names = names;
      count = 0;
      greetings.update({}, {$set: {greetCount: 0}}, function (err) {
        'use strict';
        if (err) {
          console.log('Error removing names from DB');
        } else {
          console.log('Names updated');
        }
      });
      res.render('greeting', {name: "", count: count});
    }
  });

  app.get('/greetings', function (req, res) {
    'use strict';
    console.log('Request was made on: ' + req.url);
    res.render('greetings', {names: names, count: count});
  });

  app.get('/counter/:nameInfo', function(req, res) {
    'use strict';
    greetings.findOne({name : req.params.nameInfo}, function(err, result) {
      if(err) {
        console.log('Error!!!');
      } else {
        if(result) {
          var named = result;
          res.render('counter', named);
        }
      }
    });
  });
}
