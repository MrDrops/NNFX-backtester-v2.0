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
    dbquery.testing();
    dbquery.getPair().then(dbres=> console.log(dbres));
    console.log(metaFormData);
    res.status(200).json('data through meta-form post in index.js');
    //data goes subject to validation
    // dbquery.getPair().then((pair) => {
    //     console.log(pair);
    //     console.log(metaFormData);
    //     res.status(200).json('data through meta-form post in index.js');
    // });
});

app.post('/trade-form', (req, res)=> {
    const tradeFormData = req.body;

    console.log(tradeFormData);
    res.status(200).json('data through trade-form post in index.js');
});

app.listen(PORT);