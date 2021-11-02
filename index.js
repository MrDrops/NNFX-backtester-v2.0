const express = require('express');
const path = require('path');
const dbquery = require('./services/query');
//const validateData = require('./server/validate_indata');

var PORT = process.env.port || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

app.post('/meta-form', (req, res)=> {
    const metaFormData = req.body;
    //dbquery.testing();
    //dbquery.getPair().then(dbres=> console.log(dbres));
    console.log(metaFormData);
    console.log('meta server check')
    res.status(200).end();
});

app.post('/trade-form', (req, res)=> {
    const tradeFormData = req.body;
    console.log(tradeFormData);
    console.log('data server check')
    res.status(200).end();
});

app.listen(PORT);