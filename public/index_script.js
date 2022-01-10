/*
3 goals
1. fetch comms with server:
    - submit meta data
    - submit trade data
    - delete row if wrong submission
    - delete whole test (from db and refresh forms)

2. front-end validation of input values

3. general functions so entry form page works
*/

function ajaf(method, url, data={}) {
    /* 
    Universal use ajax (fetch) function to connect to server, use any method and
    relay data if needed
    in:
        method - str [GET, POST...]
        url - str [/meta-form, etc]
        data - str (optional) [for data transfer]
    */
    console.log('in ajaf');
    //console.log(data);
    fetch(url, {
        method : method,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(res=> {
        console.log('fetch success');
        //console.log(res);
        //return res.json();
    })
    .catch(err=> {
        console.log('fetch error: ' + err);
    });
};

function submitMetaBtn() {
    /*
    Takes metadata from form, passes it through validation and sends to server
    using ajaf function
    in: nothing
    return: nothing
    */
    const metaData = {
        pairName: document.getElementById('pair-name-input').value,
        startDate: document.getElementById('period-start-date-input').value,
        endDate: document.getElementById('period-end-date-input').value,
        entryIndi: document.getElementById('entry-indi-input').value,
        entryParam: document.getElementById('entry-params-input').value,
        blineIndi: document.getElementById('baseline-indi-input').value,
        blineParam: document.getElementById('baseline-params-input').value,
        exitIndi: document.getElementById('exit-indi-input').value,
        exitParam: document.getElementById('exit-params-input').value,
        volIndi: document.getElementById('volume-indi-input').value,
        volParam: document.getElementById('volume-params-input').value,
        c2Indi: document.getElementById('c2-indi-input').value,
        c2Param: document.getElementById('c2-params-input').value,
    };
    let flag = validateMeta(metaData);
    //console.log(flag + 'flag');
    if(flag) {
        console.log('check input');
        //pop up saying to check input values
    } else {
        console.log(metaData);
        ajaf('POST', '/meta-form', metaData);
        blockMeta();
    }
}

function blockMeta() {
    /*
    blocks meta form input once submitted, unblocks trade form and focuses cursor on
    start of begin form
    in: nothing
    return: nothing
    */
    document.getElementById('meta-input-field-lock').setAttribute('disabled', 'disabled');
    document.getElementById('trade-input-field-lock').removeAttribute('disabled');
    document.getElementById('entry-date-input').focus();
}

function submitTradeBtn() {
    /*
    takes trade data from form, passes it through validation and if validated, sends to server
    with ajaf function
    in: nothing
    return: nothing
    effect: Either gets a console.log error or submits trade data and clears
    trade form to start a new entry
    */
    const tradeData = {
        entryDate: document.getElementById('entry-date-input').value,
        entryPrice: document.getElementById('entry-price-input').value,
        longShort: document.getElementById('long-or-short-input').value,
        atr: document.getElementById('atr-input').value,
        exitDate: document.getElementById('exit-date-input').value,
        exitPrice: document.getElementById('exit-price-input').value,
    };

    let errFlag = validateTrade(tradeData);
    if(errFlag) {
        console.log('check trade input')
        // pop up saying to check input
    } else {
        console.log('submitTradeDataBtn');
        updatePanel(tradeData);
        ajaf('POST', '/trade-form', tradeData);   
    };
}

function updatePanel(tradeData) {
    /*
    Joiner function that sends trade data to create table, calls to update results panel and
    clears trade form to start new entry
    in: object {string-date, string-price, string-direction, string-date, string-price}
    return: nothing
    */
    createTableRow(tradeData);
    tradeData.entryPrice = parseFloat(tradeData.entryPrice);
    tradeData.atr = parseFloat(tradeData.atr);
    tradeData.exitPrice = parseFloat(tradeData.exitPrice);
    console.log('updatePanel check');
    quickResults(tradeData);
    document.getElementById('trade-form').reset();
    document.getElementById('entry-date-input').focus();
}

function instructionsBtn() {
    /*
    button that pops up instructions on how to use backtester
    in = nothing
    return: nothing
    effect: pop up new hmtl
    */
    let instrWindow;
    const features = 'width=400, height=400, top=100';
    instrWindow = window.open('/instructions.html', 'instrWindow', features);
}

function resultsBtn() {
    /*
    button function to pop up confirmation to direct to results page
    in: nothing
    return: nothing
    */
    const gotoResults = window.confirm('Finish test and go to results page?\n' +
    'Please ensure all test data is input and test is finished before continuing');
    if(gotoResults) {
        window.open('/results.html', '_self');
    }
}

function endClearSubmitBtn() {
    /*
    button function that pops up a confirmation before finishing current
    test and restarting a new one
    */
    const endTest = window.confirm('Please ensure all test data is input.\n' +
    'Finish test and reset form?');
    if(endTest) {
        location.reload();
    }
}

function validateDates(inDate) {
    /*
    Validates if entered date is correct
    in: string-date 'ddmmyyyy'
    return: bool-error?
    */
    let err = false;
    let year = parseFloat(inDate.slice(0,4));
    let month = parseFloat(inDate.slice(4,6));
    let day = parseFloat(inDate.slice(6,8));
    if(inDate.length != 8) { err = true };
    if(year < 1900 || year > 2023) { err = true};
    if(month <= 0 || month > 12) {err = true};
    if(day <= 0 || day > 31) {err = true};
    //console.log(inDate + ' validateDates');
    return err;
}

function validatePrices(inPrice) {
    /*
    Validates if entered price is correct
    in: string-floating point number 'xxx.xxx'
    return: bool-error?
    */
    let correctForm = [false, false, false];
    let re1 = /\d.\d\d\d\d\d/;
    let re2 = /\d\d\d.\d\d\d/;
    let re3 = /\d\d.\d\d\d/;
    //console.log(typeof(inPrice));
    if(re1.test(inPrice)) {
        correctForm[0] = true;
    }
    if(re2.test(inPrice)) {
        correctForm[1] = true;
    }
    if(re3.test(inPrice)) {
        correctForm[2] = true;
    }
    const err = !correctForm.includes(true);
    return err;
}

function validatePair(inPair) {
    /*
    Validates if entered pair name is correct
    in: string-pair name 'xxxxxx'
    return: bool-error?
    */
    const pairs = ['usd', 'gbp', 'chf', 'eur', 'jpy', 'aud', 'cad', 'nzd'];
    const base = inPair.slice(0,3);
    const quote = inPair.slice(3,6);
    let err = !(pairs.includes(base) && pairs.includes(quote));
    return err;
};

function validateMeta(mData) {
    /*
    Joiner meta form validation (entry/exit dates, pair name)
    in: object-metadata {...key: str}
    return: bool-error?
    */
    let err = false;
    if(validatePair(mData.pairName)) {
        err = true;
    }
    if(validateDates(mData.startDate)) {
        err = true;
    }
    if(validateDates(mData.endDate)) {
        err = true;
    }
    return err;
}

function validateTrade(tData) {
    /*
    Joiner trade form validation (entry/exit dates/prices, atr)
    in: object-tradedata
    return: bool-error?
    */
    let err = false;
    if(validateDates(tData.entryDate)) {
        err = true;
    };
    if(validatePrices(tData.entryPrice)) {
        err = true;
    };
    if(validatePrices(tData.atr)) {
        err = true;
    };
    if(validateDates(tData.exitDate)) {
        err = true;
    }
    if(validatePrices(tData.exitPrice)) {
        err = true;
    };
    return err;
}

function createTableRow(tradeData) {
    /*
    Takes trade data and creates new row in the bottom backtester table
    in: object-tradeData
    return: nothing
    effect: new line added to bottom table with last trade data input
    */
    const table = document.getElementById('trade-table');
    let rowNum = table.rows.length;
    let row = table.insertRow(1);
    let tdTradeId = row.insertCell(0);
    let tdEntryDate = row.insertCell(1);
    let tdEntryPrice = row.insertCell(2);
    let tdLorS = row.insertCell(3);
    let tdAtr = row.insertCell(4);
    let tdExitDate = row.insertCell(5);
    let tdExitPrice = row.insertCell(6);
    let tdErase = row.insertCell(7)
    let erBtn = document.createElement('button');
    erBtn.innerHTML = 'X';
    let erBtnId = 'eraseTradeBtn' + rowNum;
    erBtn.setAttribute('id', erBtnId);

    tdTradeId.innerHTML = rowNum;
    tdEntryDate.innerHTML = tradeData.entryDate;
    tdEntryPrice.innerHTML = tradeData.entryPrice;
    tdLorS.innerHTML = tradeData.longShort;
    tdAtr.innerHTML = tradeData.atr;
    tdExitDate.innerHTML = tradeData.exitDate;
    tdExitPrice.innerHTML = tradeData.exitPrice;
    tdErase.appendChild(erBtn);
}

function sltp(tradeData) {
    /*
    Takes trade data and calculates stop-loss and take-profit
    in: object-tradeData {entryPrice: float, longShort: str, atr: float}
    return: array [float stop-loss, float take-profit]
    */
    let sl, tp;
    if(tradeData.longShort == 'long') {
        sl = tradeData.entryPrice - (tradeData.atr * 1.5);
        tp = tradeData.entryPrice + tradeData.atr;
    } else {
        sl = tradeData.entryPrice + (tradeData.atr * 1.5);
        tp = tradeData.entryPrice - tradeData.atr;
    }
    return [roundTo(sl, 5), roundTo(tp, 5)];
}

function populateSltp() {
    /*
    Changes trade data to floats and passes it to sltp and put it on the DOM
    in: nothing
    return: nothing
    */
    console.log('populateSlTp test');
    const tradeData = {
        entryPrice : document.getElementById('entry-price-input').value,
        longShort: document.getElementById('long-or-short-input').value,
        atr : document.getElementById('atr-input').value,
    }

    if(tradeData.entryPrice.length > 0 && tradeData. atr.length > 0) {
        tradeData.entryPrice = parseFloat(tradeData.entryPrice);
        tradeData.atr = parseFloat(tradeData.atr);
        const slSpan = document.getElementById('sl-placeholder');
        const tpSpan = document.getElementById('tp-placeholder');
        [slSpan.innerHTML, tpSpan.innerHTML] = sltp(tradeData);
    }
}

//should separate the calculations from the placing them on the DOM
function quickResults(tradeData) {
    /*
    Takes in tradeData and calculates quick resulsts (current account value, max drawdown).
    Puts calculated figures in DOM
    in: object-tradeData {entryDate: str, entryPrice: str longShort: str, atr: str, 
        exitDate: str, exitPrice: str}
    return: nothing
    */
    console.log('inside quickResults');
    let currAccount = parseFloat(document.getElementById('profit-span').innerHTML);
    let currDrawdown = parseFloat(document.getElementById('hidden-drawdown').value);
    let maxDrawdown = parseFloat(document.getElementById('drawdown-span').innerHTML);
    const rawSl = tradeData.atr * 1.5;
    let outcome;
    if(tradeData.longShort == 'long') {
        outcome = tradeData.exitPrice - tradeData.entryPrice;
    } else {
        outcome = tradeData.entryPrice - tradeData.exitPrice;
    }
    let toPerc = outcome / rawSl;
    currAccount = currAccount + toPerc;
    document.getElementById('profit-span').innerHTML = roundTo(currAccount,2);
    if(currAccount < 100) {
        currDrawdown = -(roundTo(100 - currAccount,2));
        document.getElementById('hidden-drawdown').value = currDrawdown;
        if(currDrawdown < maxDrawdown) {
            maxDrawdown = roundTo(currDrawdown,2);
            document.getElementById('drawdown-span').innerHTML = roundTo(currDrawdown,2);
        }
    }
}

function roundTo(number, decimalPlaces) {
    //There is no round function for decimal places in js so I used a function
    //from a medium article I found
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
}

module.exports {
    validatePrices
}