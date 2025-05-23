//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import express from 'express';
import configData from '../../public/config.json' assert { type: 'json' };
import { generateTempProcessData } from '../helper/util.js';
import './opcua-client.js';
import processData from './opcua-client.js'

//  Configuration and Constants
const adminApp = express();
adminApp.use(express.json());

//  Route Handlers
//  SERVE: landing page
adminApp.get(`/`, (req, res) => {
  res.end(`ADMIN APP:  /`)
});

//  SERVE: configuration data
adminApp.get(`/config`, (req, res) => {
  res.writeHead(200, { "Content-Type" : 'application/json' });
  res.end(JSON.stringify(configData))});

//  SERVE: process data
adminApp.get(`/data`, (req, res) => {
  res.writeHead(200, { "Content-Type" : 'application/json' });
  res.end(JSON.stringify(processData))});

//  DELEGATE: send unmatched routes back to app.js
adminApp.use((req, res, next) => {
  next();
});

export default adminApp;