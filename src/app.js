import express from 'express'
import ip from 'ip'
import env from 'dotenv'
import adminApp from './admin/admin.js'
import customerApp from './customer/customer.js'
import helmet from 'helmet'
import cors from 'cors'

const app = express();
env.config()
const port = process.env.APP_PORT || 3101;

//  MIDDLEWARE - cors, helmet, logger
app.use(cors());
app.use(helmet());
app.use(logger);
app.use(`/admin`, adminApp);
app.use(`/customer`, customerApp);

app.get(`/`, (req, res) => {
  res.end("Welcome to the landing page of FarrelConnect.")
});

app.get(`*`, (req, res) => {
  res.status(404).send(`Sorry, the page ${req.url} does not exist. Please try a different URL.`)
});

app.listen(port, "0.0.0.0", () => {
  console.log(`App server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip.address()}:${port} (network)`);
});

function logger(req, res, next) {
  console.log(`LOG: ${req.method} request originated from ${req.ip} for route ${req.url}`);
  next()
};