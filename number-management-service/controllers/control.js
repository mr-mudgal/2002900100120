// importing reuqired packages
const url = require('url');
const https = require('https');
const http = require('http')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// sorting fetched data in ascending order
function sortData(list) {
    for (let i=0; i<list.length; i++) {
        for (let j=0; j<list.length-1; j++) {
            if (list[j] > list[j + 1]) {
                let tmp = list[j];
                list[j] = list[j + 1];
                list[j + 1] = tmp;
            }
        }
    }
    return list;
}


// merging data into single data list, fetched from multiple urls, making sure there is no repetition
function arrangeData(lists) {
    let temp = []
    for(let i=0; i<lists.length; i++){
        for(let j=0; j<lists[i].length; j++){
            if(!(temp.includes(lists[i][j]))){
                temp.push(lists[i][j])
            }
        }
    }
    temp = sortData(temp)
    return temp
}


// creating httpsAgent to make sure, it works on unauthorized calls and is alive
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
});

// creating httpsAgent to make sure is alive
const httpAgent = new http.Agent({
    keepAlive: true,
});

// setting options for the fetch using httpsAgent or httpAgent as per requirement
const options = {
    agent: function (_parsedURL) {
        if (_parsedURL.protocol === 'http:') {
            return httpAgent;
        } else {
            return httpsAgent;
        }
    }
}


// function to check whether a url is valid or not
function isValidUrl(s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};


// asynchronous function which would parse our '/number' url to get multiple search queries and also calling fetch to request data from those query urls
async function parseUrl(req, res) {
    // storing all queried url into single list
    const uri = new url.URL(req.url, `http://${req.headers.host}/`);
    const query = new url.URLSearchParams(uri.search);
    const list = query.getAll('url');
    let temp = []; // temp list to store all the number lists from multiple urls into a single list

    // loop running to the length of number of searched queries, and making a fetch request for each single url in the searched queries
    for(let i=0; i<list.length; i++) {
        if (isValidUrl(list[i])) {
            try {
                // requesting the data is the url is valid
                const response = await fetch(list[i], options, 500);
                let r = await response.json()
                temp.push(r.numbers);
            }
            catch (e) {
                console.log(e.message)  // displaying message if there if some error while request the url data
            }
        } else {
            res.send(`'${list[i]}' : is not a valid url}`) // displaying message if the url is not valid
        }
    }

    // creating the json object variable which would store final result and would be send to the client (browser)
    let data = {"numbers" : arrangeData(temp)};
    res.send(data);
}

module.exports = {parseUrl};
