'use strict';

const getMessage = require('./greetMessageController');
const getName = require('./getNameController');
const getCounter = require('./counterController');
const greeted = require('../models/nameSchemaModel');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/greeting', function(req, res) {
      // console.log(getCounter())
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
      greeted.find({}, function(err, results) {
          if (err) {
              return err;
          } else {
              res.render('greeted', {names: results})
          }
      });
  });

  app.get('/counter/:nameInfo', function(req, res) {
    greeted.findOne({
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
