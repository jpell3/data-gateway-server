//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import express from 'express';
import configData from '../../public/config.json' assert { type: 'json' };
import processData from '../../public/process.json' assert { type: 'json' };
import { packageData, fetchData } from '../helper/util.js';
import './websocket-server.js';

//  Configuration and Constants
const customerApp = express();

//  Route Handlers
//  SERVE: landing page
customerApp.get(`/`, (req, res) => {
  res.end(`CUSTOMER APP:  /`)
});

//  SERVE: packaged configuration data
customerApp.get(`/config`, (req, res) => {
  res.json(packageData(configData));
});

//  SERVE: packaged process data
customerApp.get(`/api`, async (req, res) => {
  const data = await fetchData('http://127.0.0.1:3000/admin/data')
  res.json(data);
});

//  SERVE: process data hash
customerApp.get(`/api/hash`, (req, res) => {
  res.json(packageData(processData).hash) 
});

//  DELEGATE: send unmatched routes back to app.js
customerApp.use((req, res, next) => {
  next();
});

export default customerApp;