const greeted = require('../models/nameSchemaModel');

module.exports = function(theName, counter) {

    if (true) {

        greeted.findOne({
            name: theName
        }).then(function(result) {
            if (result) {
                counter++
            } else {
                counter = counter
            }
        }).catch(function(err) {
            console.log(err);
        });
    }
    return counter
}