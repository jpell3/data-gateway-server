import express from 'express'
import ip from 'ip'
import packageData from '../helper/util.js'
import data from '../../public/config.json' assert { type: 'json' };
import { WebSocketServer } from 'ws'

const customerApp = express();
const io = new WebSocketServer({ port: 8085 });
const port = process.env.CUSTOMER_PORT || 3103
let intervalId = null;

function startSending(socket, interval) {
  if (intervalId === null) { // Prevent multiple intervals
    socket.send(`Start received. Sending random numbers every ${interval / 1000} seconds.`);
    intervalId = setInterval(() => {
      socket.send(Math.random() * 100);
    }, interval);
  } else {
    socket.send(`Already sending data. Send "stop" to stop.`);
  }
}

function stopSending(socket) {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    socket.send(`Stop received. Send "start" to resume.`);
  } else {
    socket.send(`Not currently sending. Send "start" to begin.`);
  }
}

io.on('connection', socket => {
  console.log(`New client connected. ${io.clients.size} clients connected.`);
  socket.send(`Server connection successful.`)

  socket.on('message', message => {

    console.log(`Message received from client: ${message}`);
    
    if (message.toString() === "start") {
      startSending(socket, 1000);
    } else if (message.toString() === "stop") {
      stopSending(socket);
    }

  });

  socket.on('close', () => {
    console.log(`Client Disconnected. ${io.clients.size} clients remain connected.`); 
    stopSending(socket)
  });
});

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