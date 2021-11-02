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

//START OF PROVISIONAL CODE FOR MOCK INDEX PAGE
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function startTestBtn() {
    try {
        const inData = document.getElementById('meta-mock-data').value;
        const metaFormData = mockToOb(inData);
        console.log(metaFormData);
        ajaf('POST', '/meta-form', metaFormData);
    } catch(e) {
        console.log('error in startTestBtn ' + e.message);
    };
}

//provisional mock data
function mockToOb(mockData) {
    const anArr = mockData.split(', ');
    const usefulData = {
        pairName : anArr[0],
        pStart : anArr[1],
        pEnd : anArr[2],
        c1Indi : anArr[3],
        blineIndi : anArr[4],
        exitIndi : anArr[5],
        volIndi : anArr[6],
        c2Indi : anArr[7],
        c1Params : anArr[8],
        blineParams : anArr[9],
        c2Params : anArr[10],
        exitParams : anArr[11],
        volParams : anArr[12],
    }
    return usefulData;
}

//submitTradeBtn() {}
function startTradeBtn() {
    try {
        const inData = document.getElementById('trade-mock-data').value;
        const tradeFormData = tradeMockObj(inData);
        console.log(tradeFormData);
        ajaf('POST', '/trade-form', tradeFormData);
    } catch(e) {
        console.log('error in startTradeBtn ' + e.message);
    };
}

//provisional mock data
function tradeMockObj(mockTrade) {
    const anArr = mockTrade.split(', ');
    const usefulTradeData = {
        inDate : anArr[0],
        inPrice : anArr[1],
        longShort : anArr[2],
        atr: anArr[3],
        extDate : anArr[4],
        extPrice : anArr[5]
    };
    return usefulTradeData;
}

// END OF PROVISIONAL CODE
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function submitMetaBtn() {
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
    console.log(flag + 'flag');
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
    document.getElementById('meta-input-field-lock').setAttribute('disabled', 'disabled');
    document.getElementById('trade-input-field-lock').removeAttribute('disabled');
    document.getElementById('entry-date-input').focus();
}

function submitTradeBtn() {
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
        createTableRow(tradeData);
        ajaf('POST', '/trade-form', tradeData);
        document.getElementById('trade-form').reset();
        document.getElementById('entry-date-input').focus();
    };
}

function instructionsBtn() {
    console.log('instructions button');
}

function resultsBtn() {
    console.log('warning popup. go to results?');
}

function endClearSubmitBtn() {
    console.log('warning popup. end current test y clear form?');
}

function validateDates(inDate) {
    let err = false;
    let year = parseFloat(inDate.slice(0,4));
    let month = parseFloat(inDate.slice(4,6));
    let day = parseFloat(inDate.slice(6,8));
    if(inDate.length != 8) { err = true };
    if(year < 1900 || year > 2023) { err = true};
    if(month <= 0 || month > 12) {err = true};
    if(day <= 0 || day > 31) {err = true};
    console.log(inDate + ' validateDates');
    return err;
}

function validatePrices(inPrice) {
    let correctForm = [false, false, false];
    let re1 = /\d.\d\d\d\d\d/;
    let re2 = /\d\d\d.\d\d\d/;
    let re3 = /\d\d.\d\d\d/;
    console.log(typeof(inPrice));
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
    const pairs = ['usd', 'gbp', 'chf', 'eur', 'jpy', 'aud', 'cad', 'nzd'];
    const base = inPair.slice(0,3);
    const quote = inPair.slice(3,6);
    let err = !(pairs.includes(base) && pairs.includes(quote));
    return err;
};

function validateMeta(mData) {
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
    let sl, tp;
    if(tradeData.longShort == 'long') {
        sl = tradeData.entryPrice - (tradeData.atr * 1.5);
        tp = tradeData.entryPrice + tradeData.atr;
    } else {
        sl = tradeData.entryPrice + (tradeData.atr * 1.5);
        tp = tradeData.entryPrice - tradeData.atr;
    }
    return [sl, tp];
}

function populateSltp() {
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

