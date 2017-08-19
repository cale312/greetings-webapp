var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var greetingsController = require('./controllers/main');
var app = express();

const connectDB = require('./models/dbConnection');
connectDB();

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

greetingsController(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
