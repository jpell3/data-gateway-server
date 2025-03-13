import express from 'express'
import ip from 'ip'
import packageData from '../helper/util.js'
import data from '../../public/config.json' assert { type: 'json' };

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
});

// catch all route
customerApp.get(`*`, (req, res) => {
  res.status(404).send(`Sorry, the page ${req.url} does not exist. Please try a different URL.`)
});

customerApp.listen(port, () => {
  console.log(`Customer server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip.address()}:${port} (network)`);
});

export default customerApp;