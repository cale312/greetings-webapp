const assert = require('assert');
const getName = require('../controllers/getNameController');
const getMessage = require('../controllers/greetMessageController');

describe('Tests for saving new name to the database', function() {

    it('should return the name passed in the function', function(done) {
        assert.equal('Cale', getName('Cale'));
        done();
    });

    it('should return the correct greeting language selected', function(done) {
        assert.equal('Hello, ', getMessage('eng'));
        done();
    });

});