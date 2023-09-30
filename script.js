let savedOperand = '';
let activeOperand = '';
let activeOperator = '';
let displayText = '';

function add(x, y) {
  return Number.parseFloat(x) + Number.parseFloat(y);
}

function subtract(x, y) {
  return Number.parseFloat(x) - Number.parseFloat(y);
}

function multiply(x, y) {
  return Number.parseFloat(x) * Number.parseFloat(y);
}

function divide(x, y) {
  return Number.parseFloat(x) / Number.parseFloat(y);
}

function operate(num1, num2, op) {
  if (op === '+') {
    return add(num1, num2);
  } else if (op === '-') {
    return subtract(num1, num2);
  } else if (op === '*') {
    return multiply(num1, num2);
  } else if (op === '/') {
    if (parseFloat(num2) === 0) {
      return 'Nice try!'
    }

    return divide(num1, num2);
  }
}

function updateDisplay(button) {
  const screen = document.querySelector('#screen p');

  if (!!button.dataset.value) {
    if (activeOperand.length > 9) {
      return
    }

    if (button.dataset.value === '.' &&
        activeOperand.replace('.', '').length != activeOperand.length) {
      return;
    }

    activeOperand += button.dataset.value
    displayText = activeOperand;

    if (button.dataset.value === '.') {
      screen.textContent = displayText;
    } else {
      screen.textContent = displayRound(displayText);
    }

  } else if (!!button.dataset.operator) {

    const operator = button.dataset.operator;
    
    // Handle clear functions
    if (operator === 'AC') {
      resetCalculator();

      screen.textContent = displayText;
      return;

    } else if (operator === 'CE') {
      activeOperand = '';
      displayText = '';

      screen.textContent = displayText;
      return;
    }

    // Handle empty operands when pressing operator
    if (savedOperand === '' && activeOperand === '') {
      return;
    }

    // Handle maths operators
    if (activeOperator === '') {
      savedOperand = activeOperand;
    } else {
      savedOperand = operate(savedOperand, activeOperand, activeOperator).toString();
    }

    if (!Number.isFinite(parseFloat(savedOperand))) {
      const msg = savedOperand;

      resetCalculator();

      displayText = msg;
      screen.textContent = displayText;
      return;
    }

    activeOperand = '';

    if (operator === '=') {
      activeOperator = '';
    } else {
      activeOperator = operator;
    }
    
    displayText = savedOperand;
    screen.textContent = displayRound(displayText);
  }
}

function resetCalculator() {
  savedOperand = '';
  activeOperand = '';
  activeOperator = '';
  displayText = '';
}

function displayRound(num) {
  return Math.round(parseFloat(num) * 1e8) / 1e8;
}

function keyPressed(e) {
  // console.log(e.key);

  const key = e.key;
  let button;

  if (Number.isFinite(parseFloat(key)) || key === '.') {
    button = document.querySelector(`button[data-value="${key}"]`);
  } else {
    let op;

    if (key.toLowerCase() == 'escape' ||
        key.toLowerCase() == 'a') {
      op = 'AC';
    } else if (key.toLowerCase() == 'backspace' ||
               key.toLowerCase() == 'delete' ||
               key.toLowerCase() == 'c') {
      op = 'CE';
    } else if (key.toLowerCase() == 'enter') {
      op = '=';
    } else {
      op = key;
    }

    button = document.querySelector(`button[data-operator="${op}"]`);
  }

  if (button) {
    button.click();
  }
}

function initCalculator() {
  const buttons = document.querySelectorAll('.buttons button');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      updateDisplay(button);
    });
  });

  window.addEventListener('keydown', keyPressed);
}

initCalculator();
