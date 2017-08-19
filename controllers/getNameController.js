const greeted = require('../models/nameSchemaModel');

module.exports = function(theName) {

    if (true) {

        greeted.findOneAndUpdate({
            name: theName
        }, {
            $inc: {
                greetCount: 1
            }
        }).then(function(result) {
            if (result) {
                console.log('Update done')
            } else {
                greeted.create({
                    name: theName,
                    greetCount: 1
                });
                console.log('New name added!');
            }
        }).catch(function(err) {
            console.log(err);
        });
    }
    return theName
}