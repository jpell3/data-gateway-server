const express = require('express');
const ip = require('ip').address()
const crypto = require('crypto')
const { packageData } = require('../helper/util')
const data = require('../../public/config.json')

const customerApp = express();
const port = process.env.CUSTOMER_PORT || 3103

customerApp.get(`/`, (req, res) => {
  res.end(`CUSTOMER APP:  /`)
});

customerApp.get(`/api`, (req, res) => {
  res.json(packageData(data));
});

customerApp.get(`/api/hash`, (req, res) => {
  res.json(packageData(data).hash) 
})

customerApp.listen(port, () => {
  console.log(`Customer server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip}:${port} (network)`);
})

module.exports = customerApp;