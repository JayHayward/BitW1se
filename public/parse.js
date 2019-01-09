var UNARY_OPERATORS = ['~', '!'];
var BINARY_OPERATORS = ['&&', '||', '<<', '>>>', '^', '&', '|', '>>'];
var DECIMAL_REGEX = new RegExp(/-?\d+/);
var HEX_REGEX = new RegExp(/0x[\da-zA-Z]+/)
var BINARY_REGEX = new RegExp(/b[01]+/)

class EquationObj {
  static parseIncomingText(text) {
    //strip spaces
    var newStr = text.replace(/\s+/g, '');
    for (let op of UNARY_OPERATORS) {
      var index = newStr.indexOf(op);
      if (index >= 0) {
        return ([op , newStr.substring(index+op.length)]);
      }
    }
    for (let op of BINARY_OPERATORS) {
      var index = newStr.indexOf(op);
      if (index >= 0) {
        return ([newStr.slice(0, index), newStr.substring(index, index+op.length), newStr.slice(index+op.length)]);
      }
    }
    return {};
  }

  isValid() {
    var ret = (this.firstVal != "" && this.firstBase != "" && this.operator != "");
    if (this.isUnaryEquation())
      return ret;
    else
      return (ret && this.secondVal != "" && this.secondBase != "");
  }

  isUnaryEquation() {
    return this.isUnary;
  }

  getResult() {
    if (this.isUnaryEquation())
        return this.findUnarySolution();
    else
        return this.findBinarySolution();
  }

  static getBase(val) {
    if (BINARY_REGEX.test(val))
      return 'b';
    if (DECIMAL_REGEX.test(val))
      return 'd';
    if (HEX_REGEX.test(val))
      return 'h';
    return "";
  }

  static getOperator(op, opList) {
    if (opList.includes(op))
      return op;
    return "";
  }

  findUnarySolution() {
      switch (this.operator) {
        case '~':
          return ~this.firstVal;
        case '!':
          return !this.firstVal;
        default:
          throw `Unary Parsing Failed. Op: {${this.operator}}. Arg: {${this.firstVal}}`;
      }
    }

  findBinarySolution() {
    switch (this.operator) {
      case '&':
        opname.textContent = "\xa0\xa0" + "AND";
        return this.firstVal & this.secondVal;
      case '&&':
        opname.textContent = "\xa0\xa0" + "LOGICAL AND";
        return this.firstVal && this.secondVal;
      case '|':
        opname.textContent = "\xa0\xa0" + "OR";
        return this.firstVal | this.secondVal;
      case '||':
        opname.textContent = "\xa0\xa0" + "LOGICAL OR";
        return this.firstVal || this.secondVal;
      case '<<':
        opname.textContent = "\xa0\xa0" + "LEFT SHIFT";
        return this.firstVal << this.secondVal;
      case '>>':
        opname.textContent = "\xa0\xa0" + "ARITHMETIC RIGHT SHIFT";
        return this.firstVal >> this.secondVal;
      case '>>>':
        opname.textContent = "\xa0\xa0" + "LOGICAL RIGHT SHIFT";
        return this.firstVal >>> this.secondVal;
      case '^':
        opname.textContent = "\xa0\xa0" + "XOR";
        return this.firstVal ^ this.secondVal;
      default:
        throw `Binary Parsing Failed. Op: {${this.operator}}. Args: {${this.firstVal}, ${this.secondVal}}`;
    }
  }

  toEntryString() {
    if (this.isUnaryEquation())
      return `${this.operator}${this.firstVal}`;
    else return `${this.firstVal}${this.operator}${this.secondVal}`;
  }

  constructor(text) {
    var argList = EquationObj.parseIncomingText(text);
    if (argList.length === 2) {

      this.firstVal = argList[1];
      this.firstBase = EquationObj.getBase(argList[1]);
      this.operator = EquationObj.getOperator(argList[0], UNARY_OPERATORS);
      this.isUnary = true;
    }
    else if (argList.length === 3) {
      this.firstVal = argList[0];
      this.firstBase = EquationObj.getBase(argList[0]);
      this.secondVal = argList[2];
      this.secondBase = EquationObj.getBase(argList[2]);
      this.operator = EquationObj.getOperator(argList[1], BINARY_OPERATORS);
      this.isUnary = false;
    }
    else {
      this.firstVal = this.secondVal = this.firstBase = this.secondBase = this.operator = "";
    }
  }
}


var equationObj = {};
function onKeyTyped(event) {
  var currentText = document.getElementById('textbox').value;
  if (currentText.length > 0)
    updateAutosuggest(currentText);
  equationObj = new EquationObj(currentText);
  if (equationObj.isValid()) {
    updateResultDiv(equationObj);
  }
}

function onEnterPressed() {
  if (equationObj.isValid())
    $.ajax({
      url: '/newEntry',
      data: {"str": equationObj.toEntryString()},
      success: function(data) {
        console.log(data);
      }
    })
}

function updateResultDiv(equationObj) {
  var result = equationObj.getResult();
  argSpan1.textContent = equationObj.firstVal;
  argSpanB1.textContent = addLeadingZeroes(equationObj.firstVal);
  argSpan2.textContent = equationObj.secondVal;
  argSpanB2.textContent = addLeadingZeroes(equationObj.secondVal);
  operatorSpan.textContent = equationObj.operator;

  initB1 = addLeadingZeroes(equationObj.firstVal);
  initB2 = addLeadingZeroes(equationObj.secondVal);

  matchLength(initB1, initB2);

  operatorDiv.textContent = equationObj.operator;

  // firstIntSpan.textContent = addLeadingZeroes(equationObj.firstVal); firstIntSpan.setAttribute('truthy', String(!!equationObj.firstVal));
  // secondIntSpan.textContent = addLeadingZeroes(equationObj.secondVal); secondIntSpan.setAttribute('truthy', String(!!equationObj.secondVal));;
  firstIntSpan.textContent = FIS;
  secondIntSpan.textContent = SIS;

  resultBin = addLeadingZeroes(result) + "\xa0\xa0" + "=" + "\xa0\xa0" + result;
  resultBin.innerHTML = resultBin.replace(/0/g, '<span style="color: red;">0</span>').replace(/1/g, '<span style="color: blue;">1</span>');
  resultSpan.textContent = resultBin;
}

var FIS;
var SIS;

function matchLength(b1, b2) {
  if (b1.length > b2.length) {
    b2 = "00000000" + b2;
    matchLength(b1, b2);
  }
  else if (b2.length > b1.length) {
    b1 = "00000000" + b1;
    matchLength(b1, b2);
  }
  else if (b1.length === b2.length) {
    FIS = b1;
    SIS = b2;
  }
}

function addLeadingZeroes(binValue) {
  binValue = ((+binValue).toString(2));
  switch (binValue.length % 8) {
    case 0:
      return binValue;
    case 1:
      return "0000000" + binValue;
    case 2:
      return "000000" + binValue;
    case 3:
      return "00000" + binValue;
    case 4:
      return "0000" + binValue;
    case 5:
      return "000" + binValue;
    case 6:
      return "00" + binValue;
    case 7:
      return "0" + binValue;
    default:
      console.log("Ya done goofed");
  }
}

function updateAutosuggest(text) {
  var input = document.getElementById("textbox");
  var awesomplete = new Awesomplete(input);
  $.ajax({
    url: '/getEntries',
    data: {"str": text},
    success: function(data) {
      let expressionList = [];
      for (var i in data.results.rows) {
        expressionList.push(data.results.rows[i].expression);
      }
      console.log(expressionList);
      awesomplete.list = expressionList;
    }
  });
  input.focus();
}

function toggleHelp() {
    var x = document.getElementById("helpDiv");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

document.getElementById('textbox').addEventListener('input', onKeyTyped);
document.getElementById('textbox').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      onEnterPressed();
    }
});
