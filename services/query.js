const db = require('./connection');

//example
async function getPair() {
    /*
    Fetches pair name from db
    Return: str (6chrs)
    */
    try {
        const result = await db.query(
            'SELECT * FROM test_meta_data', []
        );
        return result[0];
    } catch(err) {
        console.error(err);
    };    
};

function testing() {
    console.log('test succesfull');
}

module.exports = {
    getPair,
    testing
}