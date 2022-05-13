//functions to fix input format issues before sending to database

function formatDate(strDate) {
    /*
    formats dates into mysql dateformat
    in: str ('yyyymmdd')
    return: str ('yyyy-mm-dd')
    */
    let arr = [strDate.slice(0,4), strDate.slice(4,6), strDate.slice(6)];
    return arr.join('-');
}

function formatMetaData(metaData) {
    function valOrNull(value) {
        return value.length > 0 ? value : null;
    }

    const fixedData = {
        pr : metaData.pairName,
        sd : formatDate(metaData.startDate),
        ed : formatDate(metaData.endDate),
        c1 : metaData.entryIndi,
        bl : valOrNull(metaData.blineIndi),
        ex : valOrNull(metaData.exitIndi),
        vol : valOrNull(metaData.volIndi),
        c2 : valOrNull(metaData.c2Indi),
        c1p : metaData.entryParam,
        blp : valOrNull(metaData.blineParam),
        exp : valOrNull(metaData.exitParam),
        vlp : valOrNull(metaData.volParam),
        c2p : valOrNull(metaData.c2Param),
    }
    return Object.values(fixedData);
};

function formatTradeData(tradeData) {
    const fixedData = {
        ti : tradeData.testId,
        tri : tradeData.tradeId,
        ed : formatDate(tradeData.entryDate),
        ep : tradeData.entryPrice,
        ls : tradeData.longShort,
        atr : tradeData.atr,
        htp : tradeData.hitTP,
        exd : formatDate(tradeData.exitDate),
        exp  : tradeData.exitPrice,
    }
    return Object.values(fixedData);
}

function formatTradeList(allTrades) {
    const tradeArr = [];
    for (let trade of allTrades) {
        let start = new Date(trade.start_date).toISOString().replace(/T.*/,'').split('-').reverse().join('/');
        let end = new Date(trade.end_date).toISOString().replace(/T.*/,'').split('-').reverse().join('/');
        trade.start_date = start;
        trade.end_date = end;
        let strTrade = Object.values(trade).join(', ');
        tradeArr.push(strTrade);
    }
    return tradeArr;
}

module.exports = {
    formatMetaData,
    formatTradeData,
    formatTradeList
}