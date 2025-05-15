//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import express from 'express';
import configData from '../../public/config.json' assert { type: 'json' };
import processData from '../../public/process.json' assert { type: 'json' };
import { packageData, fetchData } from '../helper/util.js';
import { WebSocketServer } from 'ws';

//  Configuration and Constants
const customerApp = express();
const io = new WebSocketServer({ port: 80 });
let intervalId = null;

function startSending(io, socket, interval) {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      io.clients.forEach(client => {
        if (client.readyState === socket.OPEN) {
          client.send(JSON.stringify(processData));
          // client.send(JSON.stringify(configData));
        }
    });
    }, interval);
  } else {
    socket.send(`Already sending data. Send "stop" to stop.`);
  }
}

io.on('connection', socket => {
  console.log(`New client connected. ${io.clients.size} clients connected.`);
  // socket.send(`Server connection successful.`)

  socket.on('message', message => {

    console.log(`Message received from client: ${message}`);
    
    if (message.toString() === "start") {
      startSending(io, socket, 1000);
    } else if (message.toString() === "stop") {
      stopSending(socket);
    }

  });

  socket.on('close', () => {
    console.log(`Client Disconnected. ${io.clients.size} clients remain connected.`); 
    stopSending(socket)
  });
});

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