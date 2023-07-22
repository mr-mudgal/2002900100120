const router = require('express').Router();
const {parseUrl} = require('../controllers/control');


router.get('/', (req, res) => {
    res.send('Go to "/numbers"');
})


router.get('/numbers', (req, res) => {
    parseUrl(req, res);
})


module.exports = router;