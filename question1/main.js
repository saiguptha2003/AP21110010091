const express = require('express');

const app = express();
const PORT = 9876;

const windowSize = 10;
let numbersWindow = [];

async function fetchNumbers(numberType) {
    try {
        const response = await fetch(`http://20.244.56.144/test/numbers/${numberType}`, {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTU4MDY4LCJpYXQiOjE3MTIxNTc3NjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMyNzVlMGZhLTE4N2YtNDZmOC1hMGQ1LWFlNTU3YWFiZTUzMyIsInN1YiI6InNhaWd1cHRoYV92QHNybWFwLmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6IlNSTSBVbml2ZXJzaXR5IiwiY2xpZW50SUQiOiIzMjc1ZTBmYS0xODdmLTQ2ZjgtYTBkNS1hZTU1N2FhYmU1MzMiLCJjbGllbnRTZWNyZXQiOiJWQUpyd0JzU0pXYXJzT3JsIiwib3duZXJOYW1lIjoiViBEIFBhbmR1cmFuZ2EgU2FpIEd1cHRoYSIsIm93bmVyRW1haWwiOiJzYWlndXB0aGFfdkBzcm1hcC5lZHUuaW4iLCJyb2xsTm8iOiJBUDIxMTEwMDEwMDkxIn0.UC6rabSTKH1PfcfQB6Co8Z8MPd3aeftmk5ou9nuirIk',
            }
        });
        const data = await response.json();
        const numbers = data.numbers || [];
        return numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
}

function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

async function updateNumbersWindow() {
    const fetchedNumbers = await fetchNumbers();
    numbersWindow = fetchedNumbers.slice(-windowSize);
}

app.use(async (req, res, next) => {
    await updateNumbersWindow();
    next();
});

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId.toLowerCase();

    const filteredNumbers = numbersWindow.filter(num => {
        switch (numberId) {
            case 'p':
                return isPrime(num);
            case 'f':
                return isFibonacci(num);
            case 'e':
                return num % 2 === 0;
            case 'r':
                return true; 
            default:
                return false;
        }
    });

    const average = calculateAverage(filteredNumbers);

    res.json({
        numbers: filteredNumbers,
        windowPrevState: numbersWindow.slice(0, windowSize - 1),
        windowCurrState: numbersWindow.slice(-windowSize),
        avg: average.toFixed(2)
    });
});

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function isFibonacci(num) {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const isPerfectSquare = x => {
        const s = Math.sqrt(x);
        return s === Math.floor(s);
    };
    return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
