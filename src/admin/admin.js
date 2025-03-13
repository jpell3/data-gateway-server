//  FarrelConnect Data Server
//  Farrel Corporation © 2025

// import libaries
import express from 'express'
import ip from 'ip'

const adminApp = express()
const port = process.env.ADMIN_PORT || 3102;

adminApp.use(express.json())

// landing page
adminApp.get(`/`, (req, res) => {
  res.end(`ADMIN APP:  /`)
});

// expose configuration data
adminApp.get(`/config`, (req, res) => {
  res.writeHead(200, { "Content-Type" : 'application/json' });
  res.end(JSON.stringify(data))});

// catch all route
adminApp.get(`*`,(req, res) => {
  res.status(404).send(`Sorry, the page ${req.url} does not exist. Please try a different URL.`)
});

adminApp.listen(port, () => {
  console.log(`Admin server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip.address()}:${port} (network)`);
});

export default adminApp;