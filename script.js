// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===== Feature Toggle =====
document.querySelectorAll('.feature-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const content = document.getElementById(targetId);

        if (content.classList.contains('active')) {
            content.classList.remove('active');
            button.textContent = 'Show';
        } else {
            content.classList.add('active');
            button.textContent = 'Hide';
        }
    });
});

// ===== Calculator =====
class Calculator {
    constructor() {
        this.display = document.getElementById('calc-display');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForOperand = false;

        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const { value, action } = e.target.dataset;

                if (action === 'clear') {
                    this.clear();
                } else if (action === 'delete') {
                    this.delete();
                } else if (action === 'equals') {
                    this.calculate();
                } else if (['+', '-', '*', '/', '%'].includes(value)) {
                    this.setOperation(value);
                } else {
                    this.appendNumber(value);
                }

                this.updateDisplay();
            });
        });
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    appendNumber(num) {
        if (this.waitingForOperand) {
            this.currentValue = num;
            this.waitingForOperand = false;
        } else {
            if (num === '.' && this.currentValue.includes('.')) return;
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
    }

    setOperation(op) {
        if (this.operation && !this.waitingForOperand) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operation = op;
        this.waitingForOperand = true;
    }

    calculate() {
        if (!this.operation || !this.previousValue) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        this.currentValue = String(Math.round(result * 100000000) / 100000000);
        this.operation = null;
        this.previousValue = '';
        this.waitingForOperand = true;
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
    }
}

const calculator = new Calculator();

// ===== Todo List =====
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';

        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.addButton = document.getElementById('add-todo');
        this.countElement = document.getElementById('todo-count');
        this.clearButton = document.getElementById('clear-completed');

        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.clearButton.addEventListener('click', () => this.clearCompleted());

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    addTodo() {
        const text = this.input.value.trim();
        if (!text) return;

        this.todos.push({
            id: Date.now(),
            text: text,
            completed: false
        });

        this.input.value = '';
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.save();
        this.render();
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const filteredTodos = this.getFilteredTodos();

        this.list.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox"
                       class="todo-checkbox"
                       ${todo.completed ? 'checked' : ''}
                       onchange="todoList.toggleTodo(${todo.id})">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" onclick="todoList.deleteTodo(${todo.id})">Delete</button>
            </li>
        `).join('');

        const activeCount = this.todos.filter(t => !t.completed).length;
        this.countElement.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const todoList = new TodoList();

// ===== Color Palette Generator =====
class ColorPalette {
    constructor() {
        this.palette = document.getElementById('color-palette');
        this.generateButton = document.getElementById('generate-palette');

        this.generateButton.addEventListener('click', () => this.generate());
        this.generate();
    }

    generate() {
        const colors = Array.from({ length: 5 }, () => this.randomColor());

        this.palette.innerHTML = colors.map(color => `
            <div class="color-item" style="background: ${color}" onclick="colorPalette.copyColor('${color}')">
                <div class="color-code">${color}</div>
            </div>
        `).join('');
    }

    randomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60 + Math.floor(Math.random() * 30);
        const lightness = 50 + Math.floor(Math.random() * 20);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    copyColor(color) {
        // Convert HSL to HEX for copying
        const hex = this.hslToHex(color);

        navigator.clipboard.writeText(hex).then(() => {
            const notification = document.createElement('div');
            notification.className = 'color-copied';
            notification.textContent = 'Copied!';
            event.currentTarget.appendChild(notification);

            setTimeout(() => notification.remove(), 1000);
        });
    }

    hslToHex(hsl) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!match) return hsl;

        let [, h, s, l] = match.map(Number);
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}

const colorPalette = new ColorPalette();

// ===== Quote Generator =====
class QuoteGenerator {
    constructor() {
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.generateButton = document.getElementById('generate-quote');

        this.quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
            { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
            { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
            { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
            { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
            { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
            { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
            { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
            { text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
            { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
            { text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupery" }
        ];

        this.generateButton.addEventListener('click', () => this.generate());
    }

    generate() {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

        this.quoteText.style.opacity = '0';
        this.quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `— ${quote.author}`;

            this.quoteText.style.transition = 'opacity 0.5s ease';
            this.quoteAuthor.style.transition = 'opacity 0.5s ease';
            this.quoteText.style.opacity = '1';
            this.quoteAuthor.style.opacity = '1';
        }, 300);
    }
}

const quoteGenerator = new QuoteGenerator();

// ===== Typing Speed Test =====
class TypingTest {
    constructor() {
        this.textElement = document.getElementById('typing-text');
        this.inputElement = document.getElementById('typing-input');
        this.startButton = document.getElementById('start-typing');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timerElement = document.getElementById('timer');

        this.texts = [
            "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Code is poetry written in logic.",
            "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. The future belongs to those who believe in the beauty of their dreams.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do. Stay hungry, stay foolish."
        ];

        this.isRunning = false;
        this.startTime = null;
        this.timer = null;
        this.timeLeft = 60;

        this.startButton.addEventListener('click', () => this.start());
        this.inputElement.addEventListener('input', () => this.checkInput());
    }

    start() {
        this.isRunning = true;
        this.startTime = Date.now();
        this.timeLeft = 60;
        this.inputElement.value = '';
        this.inputElement.disabled = false;
        this.inputElement.focus();
        this.startButton.disabled = true;

        const text = this.texts[Math.floor(Math.random() * this.texts.length)];
        this.textElement.innerHTML = text.split('').map(char =>
            `<span>${char}</span>`
        ).join('');

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = `${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.inputElement.disabled = true;
        this.startButton.disabled = false;
        this.startButton.textContent = 'Try Again';

        setTimeout(() => {
            this.startButton.textContent = 'Start Test';
        }, 2000);
    }

    checkInput() {
        if (!this.isRunning) return;

        const inputText = this.inputElement.value;
        const targetChars = this.textElement.querySelectorAll('span');

        let correct = 0;
        let incorrect = 0;

        targetChars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');

            if (index < inputText.length) {
                if (inputText[index] === char.textContent) {
                    char.classList.add('correct');
                    correct++;
                } else {
                    char.classList.add('incorrect');
                    incorrect++;
                }
            } else if (index === inputText.length) {
                char.classList.add('current');
            }
        });

        // Calculate WPM
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60;
        const wordsTyped = inputText.trim().split(/\s+/).length;
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        this.wpmElement.textContent = wpm;

        // Calculate Accuracy
        const total = correct + incorrect;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
        this.accuracyElement.textContent = `${accuracy}%`;

        // Check if finished
        if (inputText.length >= targetChars.length) {
            this.stop();
        }
    }
}

const typingTest = new TypingTest();

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Add entrance animations on scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

console.log('🚀 AI Coding Showcase loaded successfully!');
console.log('💡 Built with vanilla JavaScript, HTML, and CSS');
console.log('🎨 No frameworks, no dependencies, just pure web development');
