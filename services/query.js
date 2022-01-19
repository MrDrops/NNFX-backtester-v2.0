const db = require('./connection');

//take mataData into db
async function metaToDb(metaData) {
    try {
        await db.query(
            `INSERT INTO test_meta_data (pair_name, start_date, end_date, entry, baseline, exit_ind, volume, c2, entry_params, bline_params, exit_params, vol_params, c2_params)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, metaData
        );
    } catch(err) {
        console.log(err.message);
    }
}

//take trade data to db
async function tradeToDb(tradeData) {
    try {
        await db.query(
            `INSERT INTO trades_data (test_id, trade_id, entry_date, entry_price, direction, atr, exit_date, exit_price)
            VALUES (?,?,?,?,?,?,?,?)`, tradeData
        );
    } catch(err) {

    }
}

async function getPreTestId() {
    try {
        const testId = await db.query(
        `SELECT test_id FROM trades_data ORDER BY test_id DESC LIMIT 1`, []
        );
        return testId[0].test_id;
    }catch (err) {
        if(err.name == 'TypeError') {
            console.log('no previous pre_test_id');
            return 0;
        } else {
            console.log('getPreTestId, other error');
            console.log(err.message);
        }
        //console.log(err.message);    
    }
}

async function getTestId() {
    try {
        const testId = await db.query(
        `SELECT test_id FROM test_meta_data ORDER BY test_id DESC LIMIT 1`, []
        );
        return testId[0].test_id;
    }catch (err) {
        console.log(err.message); 
    }
}

async function getTradeId() {
    /*
    Fetches last trade id from db
    Return: int
    */
    try {
        const tradeId = await db.query(
            'select trade_id from trades_data order by test_id desc, trade_id desc limit 1', []
        );
        return tradeId[0].trade_id;
    }catch (err) {
        if(err.name == 'TypeError') {
            console.log('no previous trade_id');
            return 1;
        } else {
            console.log('getTradeId err. other error');
            console.log(err.message);
        }   
    }
};

//example
// async function getPair() {
//     /*
//     Fetches pair name from db
//     Return: str (6chrs)
//     */
//     try {
//         const result = await db.query(
//             'SELECT * FROM test_meta_data', []
//         );
//         return result[0];
//     } catch(err) {
//         console.error(err);
//     };    
// };

function testing() {
    console.log('test succesfull');
}

module.exports = {
    metaToDb,
    tradeToDb,
    getPreTestId,
    getTestId,
    getTradeId,
    testing
}