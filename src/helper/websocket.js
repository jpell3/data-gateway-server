//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import { WebSocketServer } from 'ws';
import configData from '../../public/config.json' assert { type: 'json' };
import processData from '../../public/process.json' assert { type: 'json' };
import { generateTempProcessData } from '../helper/util.js';

//  Configuration
const io = new WebSocketServer({ port: 80 });

//  Begin Broadcasting to all Clients
broadcast()

//  Socket Management
io.on('connection', socket => {
  console.log(`New client connected. ${io.clients.size} clients connected.`);

  socket.on('message', message => {
    console.log(`Message received from client: ${message}`);
  });

  socket.on('close', () => {
    console.log(`Client Disconnected. ${io.clients.size} clients remain connected.`); 
  });
});

function broadcast() {
  setInterval(broadcastProcessData, 1000)
  setInterval(broadcastConfigurationData, 5000)
}

function broadcastProcessData() {  
  io.clients.forEach( client => {
    generateTempProcessData(processData)
    client.send(JSON.stringify(processData))
  })
}

function broadcastConfigurationData() {
  io.clients.forEach( client => {
    client.send(JSON.stringify(configData))
  })
}

function broadcastMessage(message) {
  io.clients.forEach( client => {
    client.send(`BROADCAST: ${message}`)
  })
}