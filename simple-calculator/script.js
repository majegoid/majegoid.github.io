// state
let operandA = '';
let operandB = '';
let operator = '';
let equals = '';
let result = '';
let operatorFunc = null;
let expressionString = `${operandA} ${operator} ${operandB} ${equals}`;
let resultString = '0';
let hasError = false;

// document queries
// number keys
let key0Div = document.querySelector('#key-0');
let key1Div = document.querySelector('#key-1');
let key2Div = document.querySelector('#key-2');
let key3Div = document.querySelector('#key-3');
let key4Div = document.querySelector('#key-4');
let key5Div = document.querySelector('#key-5');
let key6Div = document.querySelector('#key-6');
let key7Div = document.querySelector('#key-7');
let key8Div = document.querySelector('#key-8');
let key9Div = document.querySelector('#key-9');
// operator keys
let keyPlusDiv = document.querySelector('#key-plus');
let keySubtractDiv = document.querySelector('#key-subtract');
let keyMultiplyDiv = document.querySelector('#key-multiply');
let keyDivideDiv = document.querySelector('#key-divide');
let keyEqualsDiv = document.querySelector('#key-equals');
// expression management keys (change numbers, clear state)
let keyClearDiv = document.querySelector('#key-clear');
let keyDeleteDiv = document.querySelector('#key-delete');
let keyPeriodDiv = document.querySelector('#key-period');
// displays
let expressionDisplayDiv = document.querySelector('#expression-display');
let resultDisplayDiv = document.querySelector('#result-display');

// add event listeners
// number keys
key0Div.onclick = handleNumberKeyPress;
key1Div.onclick = handleNumberKeyPress;
key2Div.onclick = handleNumberKeyPress;
key3Div.onclick = handleNumberKeyPress;
key4Div.onclick = handleNumberKeyPress;
key5Div.onclick = handleNumberKeyPress;
key6Div.onclick = handleNumberKeyPress;
key7Div.onclick = handleNumberKeyPress;
key8Div.onclick = handleNumberKeyPress;
key9Div.onclick = handleNumberKeyPress;
// operator keys
keyPlusDiv.onclick = handleOperatorKeyPress;
keySubtractDiv.onclick = handleOperatorKeyPress;
keyMultiplyDiv.onclick = handleOperatorKeyPress;
keyDivideDiv.onclick = handleOperatorKeyPress;
// misc keys
keyEqualsDiv.onclick = handleEqualsKeyPress;
keyClearDiv.onclick = handleClearKeyPress;
keyPeriodDiv.onclick = handlePeriodKeyPress;
keyDeleteDiv.onclick = handleDeleteKeyPress;

// operation functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// event handlers
// function to handle all number key presses
function handleNumberKeyPress(e) {
  if (hasError) return;
  if (result) clear();
  let inputNumber = e.currentTarget.id.split('-')[1];
  // accumulate digits on operandA
  if (operandA && !operator && !operandB) operandA += inputNumber;
  // accumulate digits on operandB
  if (operandA && operator && operandB) operandB += inputNumber;
  // first digit for operandA
  if (!operandA && !operator && !operandB) operandA = inputNumber;
  // first digit for operandB
  if (operandA && operator && !operandB) operandB = inputNumber;
  updateDisplays();
}

// function to handle all operator key presses
function handleOperatorKeyPress(e) {
  if (hasError) return;
  // if we have a result from an operation, put it as operandA
  if (result) updateExpressionToResult();

  // if we have a period as the last character of either operandA or operandB
  removeTrailingPeriodsFromOperands();

  // based on key id, set operatorFunc and operator
  let keyId = e.currentTarget.id;
  switch (keyId) {
    case 'key-plus':
      operatorFunc = add;
      operator = '+';
      break;
    case 'key-subtract':
      operatorFunc = subtract;
      operator = '-';
      break;
    case 'key-multiply':
      operatorFunc = multiply;
      operator = '*';
      break;
    case 'key-divide':
      operatorFunc = divide;
      operator = '/';
      break;
    default:
      throw new Error('Invalid operator id.');
  }

  // an operator key was pressed first
  if (!operandA && !operator && !operandB && !result) {
    operandA = '0';
  }

  // do an operation
  if (operandA && operator && operandB && !result) {
    result = operate(operatorFunc, Number(operandA), Number(operandB));
    updateExpressionToResult();
  }

  updateDisplays();
}

function handleEqualsKeyPress(e) {
  if (hasError) return;
  removeTrailingPeriodsFromOperands();
  // if there's a result, store it as operandA, reset the result
  if (result) {
    operandA = result;
    result = '';
  }
  //if we have A op, but not B or a result, set up for performing A op A
  if (operandA && operator && !operandB && !result) {
    operandB = operandA;
  }
  //A op B, but no result: perform the operation
  if (operandA && operator && operandB && !result) {
    result = operate(operatorFunc, Number(operandA), Number(operandB));
    equals = '=';
  }
  updateDisplays();
}

function handleClearKeyPress(e) {
  clear();
  updateDisplays();
}

function handlePeriodKeyPress(e) {
  if (hasError) return;
  // operandA can have a period appended to it
  if (operandA && !operator && !operandB && !Array.from(operandA).find((c) => c === '.'))
    operandA += '.';
  // operandB can have a period appended to it
  if (operandA && operator && operandB && !Array.from(operandB).find((c) => c === '.'))
    operandB += '.';
  updateDisplays();
}

function handleDeleteKeyPress(e) {
  if (hasError) return;
  if (operandA && operator && operandB && equals) {
    result = '';
    equals = '';
    updateDisplays();
    return;
  }
  if (operandA && operator && operandB) {
    result = '';
    equals = '';
    if (operandB.length === 1) operandB = '';
    if (operandB.length > 1) operandB = operandB.slice(0, operandB.length - 1);
    updateDisplays();
    return;
  }
  if (operandA && operator) {
    result = '';
    equals = '';
    operandB = '';
    operator = '';
    updateDisplays();
    return;
  }
  if (operandA) {
    result = '';
    equals = '';
    operandB = '';
    operator = '';
    if (operandA.length === 1) operandA = '';
    if (operandA.length > 1) operandA = operandA.slice(0, operandA.length - 1);
    updateDisplays();
    return;
  }
}

// all operator keys call operate (+,-,*,/,=)
function operate(operatorFunc, a, b) {
  if (
    operatorFunc &&
    typeof a === 'number' &&
    !Number.isNaN(a) &&
    typeof b === 'number' &&
    !Number.isNaN(b)
  ) {
    // handle divide by 0 with error
    if (operator === '/' && b === 0) {
      let errorMessage = "Can't divide by zero.";
      setErrorState(errorMessage);
      // updateDisplays();
      resultDisplayDiv.textContent = errorMessage;
      hasError = true;
      return;
    }
    return String(operatorFunc(a, b));
  }
}

function clear() {
  operandA = '';
  operandB = '';
  operator = '';
  equals = '';
  result = '';
  resultString = '0';
  hasError = false;
}

function updateExpressionToResult() {
  operandA = result;
  operator = '';
  operandB = '';
  equals = '';
  result = '';
}

function updateDisplays() {
  if (operandA && !operandB) resultString = operandA;
  // if (operandA && operandB) resultString = operandB;
  if (operandA && operandB && result) resultString = result;
  // check if result has a decimal point, round to 3 decimal places
  if (result) {
    let resultAsArr = Array.from(result);
    if (resultAsArr.find((c) => c === '.')) {
      if (result.split('.')[1].length > 3) {
        result = Number(result).toFixed(3);
        resultString = result;
      }
    }
  }
  if (!operandA) resultString = '0';
  resultDisplayDiv.textContent = resultString;
  expressionString = `${operandA} ${operator} ${operandB} ${equals}`;
  expressionDisplayDiv.textContent = expressionString.trim();
}

function removeTrailingPeriod(string) {
  if (string.charAt(string.length - 1) === '.') {
    return string.slice(0, length - 1);
  }
  return string;
}

function removeTrailingPeriodsFromOperands() {
  operandA = removeTrailingPeriod(operandA);
  operandB = removeTrailingPeriod(operandB);
}

function setErrorState(message) {
  resultString = message;
}

// update displays initially
updateDisplays();
