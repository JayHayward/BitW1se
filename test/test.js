var assert = require('assert');
let app = require('../public/parse_unit_test.js');


describe('Decimal Test Cases', function() {

  // Decimal Test Cases
  it('should return the correct decimal result from ^ operator', function() {
    var equationObj = new app.EquationObj("5^9");
        assert.equal(equationObj.getResult(), 12);
    });
  it('should return the correct decimal result from >> operator', function() {
    var equationObj = new app.EquationObj("5>>1");
        assert.equal(equationObj.getResult(), 2);
    });
  it('should return the correct decimal result from ~ unary operator', function() {
    var equationObj = new app.EquationObj("~-1");
        assert.equal(equationObj.getResult(), 0);
    });
});

describe('Hexadecimal Test Cases', function() {
  // Hexadecimal Test Cases
  it('should return the correct hex result from | operator', function() {
    var equationObj = new app.EquationObj("0x15|0x3");
        assert.equal(equationObj.getResult(), 23);
    });
  it('should return the correct hex result from ~ operator', function() {
    var equationObj = new app.EquationObj("~0x16");
        assert.equal(equationObj.findUnarySolution(), -23);
    });
  it('should validate if this is a unary equation with only one input argument', function() {
    var equationObj = new app.EquationObj("~0x16");
        assert.equal(equationObj.isUnaryEquation(), true);
    });
});

describe('Binary Test Cases', function() {
  // Binary Test Cases
  it('should return the correct binary result from & operator', function() {
    var equationObj = new app.EquationObj("b1101&b11");
        assert.equal(equationObj.getResult(), 9);
    });
  it('should return the correct binary result from ~ operator', function() {
    var equationObj = new app.EquationObj("~b0101");
        assert.equal(equationObj.getResult(), -102);
    });
  it('should return the correct binary result from >> operator', function() {
    var equationObj = new app.EquationObj("b1001>>b11");
        assert.equal(equationObj.findBinarySolution(), 0);
    });
  it('should return the correct distinction of whether user input is in binary, hex, or decimal', function() {
        assert.equal(app.EquationObj.getBase("0b1001"), 'b');
    });
});
describe('Miscellaneous', function() {
  it('should return the correct operator from user input', function() {
      assert.equal(app.EquationObj.getOperator("|", ['&&', '||', '<<', '>>>', '^', '&', '|', '>>']), '|');
    });
  it('should detect invalidity of user input', function() {
      var equationObj = new app.EquationObj("like a hundred bees");
      assert.equal(equationObj.isValid(), false);
    });
});