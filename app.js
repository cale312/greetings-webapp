var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var names = [];
var count = 1;
//view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

//routes
app.get('/', function(req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('index');
});

app.get('/greeting', function (req, res) {
  console.log('Request was made on: ' + req.url);
  res.render('greeting');
});

app.post('/greeting', urlencodedParser, function (req, res) {
  console.log(req.body);
  if (req.body.lang === 'english') {
    res.render('english', {data: req.body, count: count});
    count += 1;
  } else if (req.body.lang === 'espanol') {
    res.render('espanol', {data: req.body, count: count});
    count += 1;
  } else if (req.body.lang === 'xhosa') {
    res.render('xhosa', {data: req.body, count: count});
    count += 1;
  } else {
    res.sendFile(__dirname + '/404.html', function () {
      console.log('Error!!');
    });
  }
  names.push({name : req.body.name});
  console.log(names);
});

app.get('/history', function (rq, res) {
  res.render('history', {data: names});
});

//server
app.listen(3000, function () {
  console.log('Server running on port 3000');
});
