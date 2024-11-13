const display = document.getElementById("input")
const result = document.getElementById("result")

const ops = ['+', '-', '*', '/']
const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


let hostEndsWith = (host, ends) => {
    let value = false;
    value = ends.some(element => {
        return host.endsWith(element);
    });
    return value;
};

let previous = ''
let current = ''
let operator = ''
let state = false
let decimal_status = false
let equal_state = false

function appendDisplay(input){
    let len = display.value.length
    let last_eneterd_is_operator = hostEndsWith(display.value, ops)
    if (nums.includes(input) && result.value === '0'){ 
        //first number to be entered
        result.value = input
        previous = result.value
    } else if (nums.includes(input) && result.value !== '0' && state === false){
        //second... numbers to be entered
        previous += input
        result.value += input
    } else if (ops.includes(input) && result.value !== '0' && state === false){ 
        //we have entered the 1st number and we clicked on an operator
        operator = input
        state = true
        decimal_status = false
        display.value += result.value + input
    } else if (input === '.' && state === false && decimal_status === false){
        //clicked on the '.' decimal and we are still with the first number
        previous += input
        result.value += input
        decimal_status = true
    } else if (input === '.' && state === true && decimal_status === false){
        //input 2nd decimal number
        current += input
        result.value = current
        decimal_status = true
    } else if (state === true && nums.includes(input)){
        //entering the 2nd number
        current += input
        result.value = current
    } else if (state === true && input === '='){
        //clicked operator and we have added another number now we clicked '='
        display.value += result.value + input
        result.value = checkForDecimal(operate(operator, previous * 1, current * 1))
        state = true
        equal_state = true
        previous = result.value
        current = ''
    } else if (state === true && ops.includes(input) && current !== ''){
        //enetered a 2nd number and clicked on an operator
        result.value = checkForDecimal(operate(operator, previous * 1, current * 1))
        operator = input
        display.value = result.value + input
        previous = result.value
        current = ''
    } else if (state === true && ops.includes(input) && current === '' && last_eneterd_is_operator === true){
        //1st number and operator entered and clicked on a 2nd operator
        operator = input
        display.value = display.value.substring(0, len - 1) + input
    } else if (equal_state === true && ops.includes(input)) {
        //we have complete an operationa and then clicked on an operator
        state = true
        operator = input
        previous = result.value
        current = ''
        display.value = result.value + input
    } else if (equal_state === true && ops.includes(input)){
        //clicked the '=' and clicked on an operator just after
        operator = input
        previous = result.value
        current = ''
        state = true
        equal_state = false
        
    } else if (equal_state === true && input === '='){
        //we have clicked on '=' and if we click once again on '=' nothing changes
        return
    }

}

function clearDisplay() {
    display.value = ''
    result.value = '0'
    state = false
    previous = ''
    current = ''
    decimal_status = false
    equal_state = false
}

function deleteLast() {
    if (state === false){
        result.value = result.value.substring(0, result.value.length - 1)
        if (result.value === '' && equal_state === false){
            result.value = '0'
            previous = result.value
        }
        previous = result.value
    } else if (state === true && equal_state === false){
        result.value = result.value.substring(0, result.value.length - 1)
        if (result.value === ''){
            result.value = '0'
            current = result.value
        }
        current = result.value
    } else if (equal_state === true){
        result.value = result.value.substring(0, result.value.length - 1)
        if (result.value === ''){
            result.value = '0'
            previous = result.value
        }
        previous = result.value
    } 
}

function percentage() {
    if (state === false){
        result.value /= 10
        previous = result.value
    } else if (state === true){
        result.value /= 10
        current = result.value
    }
}

function addMinus() {
    if (state === false){
        result.value = (-1) * result.value
        previous = result.value
    } else if (state === true){
        result.value = (-1) * result.value
        current = result.value
        equal_state = false
    }

}

function add(x, y){
    return x + y
}

function subtraction(x, y){
    return x - y
}

function multiply(x, y){
    return x * y
}

function division(x, y){
    if (y === 0){
        alert("CAN'T DIVIDE BY ZERO")
    }
    else {
        return x / y
    }
}

function operate(operator, previous, current){
    switch (operator){
        case '+':
            return add(previous, current)
        case '-':
            return subtraction(previous, current)
        case '*':
            return multiply(previous, current)
        case '/':
            return division(previous, current)
        default:
            return
    }

}

function checkForDecimal(result){
    if (!Number.isInteger(result)){
        ans = Math.round(result * 1000000) / 1000000
        return ans
    }
    return result
}