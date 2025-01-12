import './style.css'


document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('swap-form');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const amountSendInput = document.getElementById('amount-send');
    const amountReceiveInput = document.getElementById('amount-receive');
    const errorMessageDiv = document.getElementById('error-message');

    const pricesUrl = 'https://interview.switcheo.com/prices.json';
    let prices = [];

    try {
        const response = await fetch(pricesUrl);
        prices = await response.json();
    } catch (error) {
        errorMessageDiv.textContent = 'Failed to fetch token prices.';
        return;
    }

    prices.forEach(token => {
        if (token?.price === 0) {
            return;
        }
        const optionFrom = document.createElement('option');
        optionFrom.value = token.price;
        optionFrom.textContent = token.currency;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = token.price;
        optionTo.textContent = token.currency;
        toCurrencySelect.appendChild(optionTo);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const fromPrice = fromCurrencySelect.value;
        const toPrice = toCurrencySelect.value;
        const amountSend = parseFloat(amountSendInput.value);

        if (!fromPrice || !toPrice || isNaN(amountSend) || amountSend <= 0) {
            errorMessageDiv.textContent = 'Please fill out all fields correctly.';
            return;
        }


        if (!fromPrice || !toPrice) {
            errorMessageDiv.textContent = 'Selected currencies are not available for swapping.';
            return;
        }

        const amountReceive = (amountSend * fromPrice) / toPrice;
        amountReceiveInput.value = amountReceive.toFixed(2);
        errorMessageDiv.textContent = '';
    });
});


document.querySelector('#app').innerHTML = `
<div class="container">
<form id="swap-form">
  <h1>Currency Swap</h1>
  <div class="form-group">
    <label for="from-currency">From:</label>
    <select id="from-currency"></select>
  </div>
  <div class="form-group">
    <label for="to-currency">To:</label>
    <select id="to-currency"></select>
  </div>
  <div class="form-group">
    <label for="amount-send">Amount to send:</label>
    <input type="number" id="amount-send" required>
  </div>
  <div class="form-group">
    <label for="amount-receive">Amount to receive:</label>
    <input type="number" id="amount-receive" readonly>
  </div>
  <button type="submit">CONFIRM SWAP</button>
  <div id="error-message"></div>
</form>
</div>
`
