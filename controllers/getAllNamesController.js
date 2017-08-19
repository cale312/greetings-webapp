const greeted = require('../models/nameSchemaModel');

module.exports = function() {
    greeted.find({}).then(function(result) {
        return result
    }).catch(function(err) {
        console.log(err)
    });
}