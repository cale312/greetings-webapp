const greeted = require('../models/nameSchemaModel');

var namesObj = {};

module.exports = function(theName) {

    if (namesObj[theName] !== undefined) {

        namesObj[theName] += 1;

        greeted.findOneAndUpdate({
            name: theName
        }, {
            $inc: {
                greetCount: 1
            }
        }).then(function(result) {
            console.log('Update done')
        }).catch(function(err) {
            console.log(err);
        });
    } else {

        namesObj[theName] = 1;

        greeted.create({
           name: theName,
           greetCount: 1
        }).then(function(result) {
            console.log('New name added!');
        }).catch(function(err) {
            console.log(err);
        });
    }
    return theName
}