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
    console.log(data);
    fetch(url, {
        method : method,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(res=> {
        console.log('fetch success');
        console.log(res);
        return res.json();
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
    console.log('meta Submitted');
}

function submitTradeBtn() {
    console.log('trade data submitted')
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