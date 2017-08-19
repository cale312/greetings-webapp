var mongoose = require('mongoose');

module.exports = function() {
    const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/greeted";
    mongoose.connect(mongoURL);

    mongoose.Promise = global.Promise;

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('App connected to ' + mongoURL + ' database');
    });
}

