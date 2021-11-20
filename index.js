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
    const inData = req.body;
    const fixedData = formatFix.formatMetaData(inData);
    //dbquery.testing();
    //dbquery.getPair().then(dbres=> console.log(dbres));
    console.log(fixedData);
    console.log('meta server check')
    res.status(200).end();
});

app.post('/trade-form', (req, res)=> {
    const inData = req.body;
    const fixedTradeData = Object.values(inData);
    console.log(fixedTradeData);
    console.log('data server check')
    res.status(200).end();
});

app.listen(PORT);