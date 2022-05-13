


function testSelectOptions() {
    /*
    Calls on db to gather available options for tests select input
    in: nothing
    return: 
    */
   const tests = fetch('/available-tests')
   .then((res)=> res.json())
   .then((testList) => {
       //console.log(testList);
       return testList;
   });
   return tests;
};

function selectMenu() {
    console.log('WORK!!!');
    const select = document.getElementById('test-option-input');
    testSelectOptions()
    .then((options)=> {
        for (let i=0; i < options.length; i++) {
            let opt = options[i];
            let el = document.createElement('option');
            el.textContent = opt;
            el.value = opt.slice(0,1);
            select.appendChild(el);
        }
    });
};

function testWork() {
    const testid = document.getElementById('test-option-input').value;
    console.log('test work ' + toString(testid));
}

function viewResultsBtn() {
    const testId = document.getElementById('test-option-input').value;
    const payload = { id: testId};
    console.log(typeof payload);
    console.log('payload:  ' + payload);
    if(testId != 0) {
        fetch('/trade-data', {
            method : 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then((res) => {
            console.log('fetch worked');
        })
        //send results to calculation functions
        //generate table with calculated values
        //generate graph
    }
};