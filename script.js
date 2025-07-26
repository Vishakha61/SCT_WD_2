// Calculator button layout
const buttons = [
    ['C', 'DEL', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['(', ')', '0', 'π'],
    ['√', '^', '=']
];

const operators = ['÷', '×', '−', '+', '%', '^'];
const display = document.getElementById('display');
const buttonsContainer = document.querySelector('.buttons');

// Generate buttons dynamically
buttons.forEach(row => {
    row.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.classList.add('button');
        if (operators.includes(btn)) button.classList.add('operator');
        if (btn === '=') button.classList.add('equal');
        if (btn === 'C') button.classList.add('clear');
        if (btn === 'DEL') button.classList.add('del');
        if (btn === '+') button.classList.add('plus');
        button.addEventListener('click', () => handleButton(btn));
        buttonsContainer.appendChild(button);
    });
});

// History logic
let history = [];
const historyBtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

historyBtn.addEventListener('click', () => {
    if (historyPanel.style.display === 'none') {
        renderHistory();
        historyPanel.style.display = 'block';
    } else {
        historyPanel.style.display = 'none';
    }
});

function renderHistory() {
    historyList.innerHTML = '';
    const clearBtn = document.getElementById('clear-history-btn');
    if (history.length === 0) {
        historyList.innerHTML = '<li>No history yet.</li>';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    if (clearBtn) {
        clearBtn.style.display = 'block';
        clearBtn.onclick = () => {
            history = [];
            renderHistory();
        };
    }
    history.slice().reverse().forEach((item, idx, arr) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        const span = document.createElement('span');
        span.textContent = item;
        span.style.flex = '1';
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.style.background = 'none';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.style.fontSize = '1.1em';
        delBtn.style.height = '100%';
        delBtn.style.display = 'flex';
        delBtn.style.alignItems = 'center';
        delBtn.style.justifyContent = 'center';
        delBtn.style.color = 'red';
        delBtn.title = 'Delete this history item';
        delBtn.onclick = () => {
            // Remove the correct item from history (reverse index)
            const realIdx = history.length - 1 - idx;
            history.splice(realIdx, 1);
            renderHistory();
        };
        li.appendChild(span);
        li.appendChild(delBtn);
        historyList.appendChild(li);
    });
}

let currentInput = '';

function handleButton(value) {
    if (value === 'C') {
        currentInput = '';
        updateDisplay('');
    } else if (value === 'DEL') {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    } else if (value === '=') {
        try {
            let expr = currentInput
                .replace(/÷/g, '/')
                .replace(/×/g, '*')
                .replace(/−/g, '-')
                .replace(/π/g, Math.PI)
                .replace(/√([0-9.]+)/g, 'Math.sqrt($1)')
                .replace(/\^/g, '**');
            let result = eval(expr);
            if (result === undefined || isNaN(result)) throw Error('Invalid');
            updateDisplay(result);
            // Save to history
            history.push(`${currentInput} = ${result}`);
            currentInput = result.toString();
        } catch {
            updateDisplay('Error');
            currentInput = '';
        }
    } else if (value === '√') {
        currentInput += '√';
        updateDisplay(currentInput);
    } else if (value === 'π') {
        currentInput += 'π';
        updateDisplay(currentInput);
    } else if (value === '^') {
        currentInput += '^';
        updateDisplay(currentInput);
    } else {
        if (display.value === 'Error') currentInput = '';
        currentInput += value;
        updateDisplay(currentInput);
    }
}

function updateDisplay(val) {
    display.value = val;
}

// Keyboard support
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.' || e.key === '(' || e.key === ')') {
        handleButton(e.key);
    } else if (e.key === '/' || e.key === '*') {
        handleButton(e.key === '/' ? '÷' : '×');
    } else if (e.key === '-') {
        handleButton('−');
    } else if (e.key === '+') {
        handleButton('+');
    } else if (e.key === '%') {
        handleButton('%');
    } else if (e.key === '^') {
        handleButton('^');
    } else if (e.key === 'Enter' || e.key === '=') {
        handleButton('=');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleButton('DEL');
    } else if (e.key.toLowerCase() === 'c') {
        handleButton('C');
    }
});

// Dark/Light mode toggle
const toggleBtn = document.getElementById('toggle-mode');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});
