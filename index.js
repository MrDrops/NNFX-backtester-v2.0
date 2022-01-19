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

app.listen(PORT);