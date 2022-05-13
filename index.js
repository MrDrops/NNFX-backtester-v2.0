const express = require('express');
const path = require('path');
const dbquery = require('./services/query');
const formatFix = require('./services/format_db_query');
//const validateData = require('./server/validate_indata');

var PORT = process.env.port || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

//Gather and store test meta data from input form to db
app.post('/meta-form', (req, res)=> {
    const metaData = req.body;
    const fixedData = formatFix.formatMetaData(metaData);
    dbquery.metaToDb(fixedData)
    .then(()=> {
        console.log(fixedData);
        console.log('meta server check')
        res.status(200).end();
    });    
});

//Gather and store trade data from input form to db
app.post('/trade-form', (req, res)=> {
    const tradeData = req.body;
    const preTestId = dbquery.getPreTestId();
    const testId = dbquery.getTestId();
    const tradeId = dbquery.getTradeId();

    Promise.all([preTestId, testId, tradeId])
    .then(ids=> {
        tradeData.testId = ids[1];
        tradeData.tradeId = ids[0] < ids[1] ? 1 : (ids[2] + 1);
        console.log([ids[0], ids[1], ids[2]]);
        const formattedTradeData = formatFix.formatTradeData(tradeData);
        return formattedTradeData;
    })
    .then((ftd)=> {
        console.log(ftd);
        dbquery.tradeToDb(ftd);
        console.log('data server check')
        res.status(200).end();
    })
});

/*
        Below are functions for the results page
*/

app.get('/available-tests', (req, res)=> {
    //call to db to retrieve test data
    dbquery.getAvailableTests()
    .then(response=> response)
    .then(availTests=> {
        const strTest = formatFix.formatTradeList(availTests);
        //organize tests in a nice form before sending to front
        //console.log(availTests[0]);
        res.json(strTest);
    })
    //sort data in a presentable form
    //send to fetch request from result page
})

app.post('/trade-data', (req, res)=> {
    const testIdReq = req.body;
    console.log('body: ' + testIdReq);
    // dbquery.testToanalize(testIdReq)
    // .then(response=> {
    //     res.json(response);
    // })
    //get data from db
    //send data to analysis
    //send analyzed data to results.html
})

app.listen(PORT);