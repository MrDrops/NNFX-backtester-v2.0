//functions to fix input format issues before sending to database

function formatMetaData(metaData) {
    function valOrNull(value) {
        return value.length > 0 ? value : null;
    }

    const fixedData = {
        pr : metaData.pairName,
        sd : metaData.startDate,
        ed : metaData.endDate,
        c1 : metaData.entryIndi,
        c1p : metaData.entryParam,
        bl : valOrNull(metaData.blineIndi),
        blp : valOrNull(metaData.blineParam),
        ex : valOrNull(metaData.exitIndi),
        exp : valOrNull(metaData.exitParam),
        vol : valOrNull(metaData.volIndi),
        vlp : valOrNull(metaData.volParam),
        c2 : valOrNull(metaData.c2Indi),
        c2p : valOrNull(metaData.c2Param),
    }
    console.log(Object.values(fixedData));
    return Object.values(fixedData);
};

module.exports = {
    formatMetaData
}