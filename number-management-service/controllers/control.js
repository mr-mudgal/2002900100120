const url = require('url');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const isValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};


async function parseUrl(req, res) {
    const uri = new url.URL(req.url, `http://${req.headers.host}/`);
    const query = new url.URLSearchParams(uri.search);
    const list = query.getAll('url');

    if(isValidUrl(list[0])) {
        const https = require('https');
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        const response = await fetch(list[0], {agent: httpsAgent});
        const data = await response.json();

        res.send(data);
    }
    else{
        res.send(`'${list[0]}' : is not a valid url}`)
    }

}

module.exports = {parseUrl};