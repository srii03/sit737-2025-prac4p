const express = require('express');
const winston = require('winston');

const app = express();
const port = 3000;

// Configure Winston logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Root route handler
app.get('/', (req, res) => {
    res.send('Welcome to the Calculator Microservice. Please use /add, /subtract, /multiply, or /divide.');
});

// Calculator Endpoints
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for addition');
        return res.status(400).json({ error: 'Invalid input, must be numbers' });
    }
    const result = Number(num1) + Number(num2);
    logger.info(`Addition operation: ${num1} + ${num2} = ${result}`);
    res.json({ result });
});

app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for subtraction');
        return res.status(400).json({ error: 'Invalid input, must be numbers' });
    }
    const result = Number(num1) - Number(num2);
    logger.info(`Subtraction operation: ${num1} - ${num2} = ${result}`);
    res.json({ result });
});

app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for multiplication');
        return res.status(400).json({ error: 'Invalid input, must be numbers' });
    }
    const result = Number(num1) * Number(num2);
    logger.info(`Multiplication operation: ${num1} * ${num2} = ${result}`);
    res.json({ result });
});

app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for division');
        return res.status(400).json({ error: 'Invalid input, must be numbers' });
    }
    if (Number(num2) === 0) {
        logger.error('Division by zero attempt');
        return res.status(400).json({ error: 'Division by zero is not allowed' });
    }
    const result = Number(num1) / Number(num2);
    logger.info(`Division operation: ${num1} / ${num2} = ${result}`);
    res.json({ result });
});

app.listen(port, () => {
    console.log(`Calculator microservice running at http://localhost:${port}`);
});
