document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const form = document.querySelector('.form');
    const resultBoxValue = document.querySelectorAll('.box-value');
    const resultBoxTitle = document.querySelectorAll('.box-title');
    const mainCurrency = document.getElementById('main-currency');
    const secondaryCurrency = document.getElementById('secondary-currency');
    const lastUpdate = document.querySelector('.info-last-update');
    const changeButton = document.querySelector('.form-change');

    let rates = {};

    const API_KEY = "12d0b92b9b49bfce1d11114086209c35";
    const API_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

    fetch(API_URL)
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    async function fetchRates() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success === true) {
                rates = data.rates;
                populateSelects(rates);
                updateLastUpdate(data.date);

                const fromCurrency = fromSelect.value;
                const toCurrency = toSelect.value;
                displayInfo(fromCurrency, toCurrency);
            } else {
                alert('Не удалось получить курсы валют.');
            }
        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            alert('Произошла ошибка при получении курсов валют.');
        }
    }

    function populateSelects(rates) {
        const currencies = Object.keys(rates);
        currencies.forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            fromSelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toSelect.appendChild(optionTo);
        });

        fromSelect.value = 'EUR';
        toSelect.value = 'USD';
    }

    function updateLastUpdate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdate.textContent = date.toLocaleDateString('ru-RU', options);
    }

    function displayInfo(fromCurrency, toCurrency) {
        const rate = rates[toCurrency];
        const conversionRate = (1 / rates[fromCurrency]) * rate;
    
        mainCurrency.textContent = `1 ${fromCurrency}`;
        secondaryCurrency.textContent = `${conversionRate.toFixed(4)} ${toCurrency}`;
    }    

    form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму.');
        return;
    }

    convertCurrency(amount, fromCurrency, toCurrency);

    displayInfo(fromCurrency, toCurrency);
    });

    function convertCurrency(amount, from, to) {
        const rateFrom = rates[from];
        const rateTo = rates[to];
        const rate = rateTo / rateFrom;
        displayResult(amount, rate, from, to);
    }

    function displayResult(amount, rate, from, to) {
        const convertedAmount = (amount * rate).toFixed(4);
        resultBoxValue[0].textContent = `${amount} ${from}`;
        resultBoxValue[1].textContent = convertedAmount;

        resultBoxTitle[0].textContent = from;
        resultBoxTitle[1].textContent = to;
    }

    changeButton.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        if (!isNaN(amount) && amount > 0) {
            convertCurrency(amount, fromCurrency, toCurrency);
            displayInfo(fromCurrency, toCurrency);
        }
    });

    fetchRates();
});

