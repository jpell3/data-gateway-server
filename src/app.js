//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import express from 'express'
import helmet from 'helmet'
import ip from 'ip'
import adminApp from './admin/admin.js'
import customerApp from './customer/customer.js'

//  Configuration and Constants
const app = express();
const port = 3000;

//  Middleware
app.use(logger);
app.use(helmet());
app.use(`/admin`, adminApp);
app.use(`/customer`, customerApp);

//  Route Handlers
//  SERVE: landing page
app.get(`/`, (req, res) => {
  res.end("Welcome to the landing page of FarrelConnect. This page is currently under construction.")
});

//  SERVE: 404 not found
app.use((req, res) => {
  res.status(404).send(`Sorry, the page ${req.url} does not exist. Please try a different URL.`)
});

//  Start Server
app.listen(port, "0.0.0.0", () => {
  console.log(`App server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip.address()}:${port} (network)`);
});

//  Middleware Functions
function logger(req, res, next) {
  console.log(`LOG: ${req.method} request originated from ${req.ip} for route ${req.url}`);
  next()
}