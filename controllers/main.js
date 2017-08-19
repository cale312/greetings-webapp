'use strict';

const getMessage = require('./greetMessageController');
const getName = require('./getNameController');
const getAllNames = require('./getAllNamesController');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/greeting', function(req, res) {
    res.render('greetForm');
  });

  app.post('/greeting', function(req, res) {
    var language = req.body.lang;
    var newName = req.body.input;

    res.render('greetForm', {
       greetMessage: getMessage(language) + " " + getName(newName)
    });

  });

  app.get('/greeted', function(req, res) {
      res.render('greeted');
  });

  app.get('/counter/:nameInfo', function(req, res) {
    greetings.findOne({
      name: req.params.nameInfo
    }, function(err, result) {
      if (err) {
        console.log('Error!!!');
      } else {
        if (result) {
          res.render('counter', result);
        }
      }
    });
  });
};
