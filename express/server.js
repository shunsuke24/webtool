const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors({ origin: true, credentials: true }));

const router = require('./routes/router');

app.use('/', router);

module.exports = app;