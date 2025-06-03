//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import {  OPCUAClient, AttributeIds  } from 'node-opcua'
import processData from '../../public/process.json' assert { type: 'json' };
import os from 'os'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'

//  Configuration and Constants
console.log(`Initializing OPCUA`);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const client = OPCUAClient.create({  clientName:`DataGatewayServer-${os.hostname()}`, keepSessionAlive: true  })
// const serverIPAddress = `10.0.0.10`
const serverIPAddress = `192.168.4.250`
const serverPortAddress = 4840
let message, accessableTags, currentSession

//  Run Server
const startingStep = 'Step1'
handleClient(startingStep)

//  Function Handler
async function handleClient(currentStep) {
  while(currentStep) {
    switch(currentStep) {
      case 'Step1':
        currentStep = await readTagFile()
        break
      case 'Step2':
        currentStep = await connectClient(client)
        break
      case 'Step3':
        currentStep = await openSession(client)
        break
      case 'Step4':
        currentStep = await readData(currentSession, accessableTags)
        break
      case 'Step5':
        currentStep = await disconnectClient(client, currentSession)
        break
      case 'Exit':
        console.log(`Program execution stopped normally.`);
        process.exit(0)
        break
      default:
        console.log(`Unknown error. currentStep = ${currentStep}`)
    }
  }
}

//  STEP 1: Read PLC tags from file
async function readTagFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../public/tags.json'), 'utf-8', (error, data) => {
      if(!error) {
        accessableTags = formatTags(JSON.parse(data))
        resolve("Step2")
      } else {
        console.log(error);
        reject()
      }
    })
  })
}

//  STEP 2: Connect to server
async function connectClient(client) {
  return new Promise((resolve, reject) => {
    client.connect(`opc.tcp://${serverIPAddress}:${serverPortAddress}`, error => {
    error ? message = 'failed to connect' : message = 'successfully connected'
    console.log(`Client ${message} to opc.tcp://${serverIPAddress}:${serverPortAddress}.`);
    error ? reject("Step2") : resolve("Step3")
    })
  })
}

//  STEP 3: Open server session
async function openSession(client) {
  return new Promise((resolve, reject) => {
    client.createSession((error, session) => {
      if(error) { reject("Step3") }
      currentSession = session
      const sessionID = currentSession.sessionId.value
      const sessionName = currentSession.serverEndpoints[0].server.applicationName.text
      console.log(`Session opened successfully with server name ${sessionName} with client ID ${sessionID}`);
      resolve("Step4")
    })
  })
}

//  STEP 4: Read data continuously
async function readData(session, accessableTags) {
  return new Promise((resolve, reject) => {
    setInterval(pollData, 1000)
    // currently staying in this state indefinitely
    // resolve("Exit")
  })
}

//  STEP 5: Close session
async function disconnectClient(client, session) {
  return new Promise((resolve, reject) => {
    session.close(error => {
      if(error) {
        console.log("Failed to close session...");
        reject()
      }
    })
    client.disconnect( error => {
      if(error) {
        console.log("Client failed to disconnect...");
        reject()
      }
    })
    resolve("Exit")
  })
}



//  Event Handler
client.on("backoff", (retry, delay) => {
  console.log(`Backoff #${retry}. Trying again in ${Math.floor(delay/1000)} seconds.`);
});


//  Convert PLC Tag to OPC UA tag format
function formatTags(tagArray) {
  const regex1 = /\'/g
  const regex2 = /\./g
  tagArray.forEach( tag => {
    tag.name = `\"${tag.name.replace(regex1, '').replace(regex2, "\".\"")}\"`
  })
  return tagArray
}

//  Poll for Data
function pollData() {
  accessableTags.forEach(tag => {
    const accessName = {  nodeId: `NodeId ns=3;s=${tag.name}`, attributeId: AttributeIds.Value   }
    currentSession.read(accessName, (error, returnValue) => {
      if(!error) {
        tag.value = returnValue.value.value
        mapData(tag)
      } else {
        tag.value = null
        console.log(`Unable to read tag ${tag}.`);
      }
    })
  })
}

//  Temporary hardcode data to processData. Need to create a mapping function.
function mapData(tag) {
    switch(tag.name) {
      case `"MIX_MTR"."DRIVE"."RPM"."SCREW_PV"`:
        processData.data.mixer.drive.speed = tag.value
        break;
      case `"MIX_MTR"."DRIVE"."RPM"."SCREW_SP"`:
        processData.data.mixer.drive.setpoint = tag.value
        break;
      case `"MIX_MTR"."DRIVE"."TRQ"."VALUE"`:
        processData.data.mixer.drive.torque = tag.value
        break;
      case `"MIX_MTR"."DRIVE"."PWR"."PV"`:
        processData.data.mixer.drive.power  = tag.value
        break;
      case `"MIX_MTR"."DRIVE"."STA"."RUN"`:
        processData.data.mixer.drive.running = tag.value
        break;
      case `"EXT_MTR"."DRIVE"."RPM"."SCREW_PV"`:
        processData.data.extruder.drive.speed = tag.value
        break;
      case `"EXT_MTR"."DRIVE"."RPM"."SCREW_SP"`:
        processData.data.extruder.drive.setpoint = tag.value
        break;
      case `"EXT_MTR"."DRIVE"."TRQ"."VALUE"`:
        processData.data.extruder.drive.torque = tag.value
        break;
      case `"EXT_MTR"."DRIVE"."PWR"."PV"`:
        processData.data.extruder.drive.power  = tag.value
        break;
      case `"EXT_MTR"."DRIVE"."STA"."RUN"`:
        processData.data.extruder.drive.running = tag.value
        break;
      default:
        console.log(`Unable to map ${tag.name}`);  
    }
}

export default processData