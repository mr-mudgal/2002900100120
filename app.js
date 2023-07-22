const express = require('express');
const app = express();


const router = require('./routers/router.js');
const http = require("http");

app.use('/', router);

app.listen(8008);

