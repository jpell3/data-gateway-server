const express = require('express');
const ip = require('ip').address()
const adminApp = require('./admin/admin');
const env = require('dotenv').config();
const customerApp = require('./customer/customer');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = process.env.APP_PORT || 3101;

//  MIDDLEWARE - cors, helmet, logger
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  console.log(`LOG: ${req.method} request originated from ${req.ip} for route ${req.url}`);
  next()
});
app.use(`/admin`, adminApp);
app.use(`/customer`, customerApp);

app.get(`/`, (req, res) => {
  res.end("Welcome to the landing page of FarrelConnect.")
});

app.listen(port, () => {
  console.log(`App server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip}:${port} (network)`);
})