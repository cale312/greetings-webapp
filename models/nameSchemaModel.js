const mongoose = require('mongoose');

var greetSchema = mongoose.Schema({
    name: String,
    greetCount: Number
});

var greeted = mongoose.model('name', greetSchema);

module.exports = greeted;