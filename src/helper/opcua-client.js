//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

//  Imports
import {  OPCUAClient, AttributeIds  } from 'node-opcua'
import processData from '../../public/process.json' assert { type: 'json' };
import os from 'os'

//  Configuration and Constants
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
    console.log('DEBUG: step1');
    accessableTags = [{
      "name": '"MIX_MTR"."DRIVE"."RPM"."SCREW_SP"',
      "description": "Mixer Motor. Speed Setpoint (rpm)"
    },
    {
      "name": '"MIX_MTR"."DRIVE"."RPM"."SCREW_PV"',
      "description": "Mixer Motor. Speed Setpoint (rpm)"
    },
    {
      "name": '"MIX_MTR"."DRIVE"."TRQ"."VALUE"',
      "description": "Mixer Motor. Torque (%)"
    },
    {
      "name": '"MIX_MTR"."DRIVE"."PWR"."PV"',
      "description": "Mixer Motor. Power (kW)"
    },
    {
      "name": '"MIX_MTR"."DRIVE"."STA"."RUN"',
      "description": "Extruder Motor. Run Feedback"
    }]
    resolve("Step2")
  })
}

//  STEP 2: Connect to server
async function connectClient(client) {
  return new Promise((resolve, reject) => {
    console.log('DEBUG: step2');
    client.connect(`opc.tcp://${serverIPAddress}:${serverPortAddress}`, error => {
    error ? message = 'failed to connect' : message = 'successfully connected'
    console.log(`Client ${message} to opc.tcp://${serverIPAddress}:${serverPortAddress}.`);
    error ? reject("Step2") : resolve("Step3")
    })
  })
}

//  STEP 3: Open server session
async function openSession(client) {
  console.log('DEBUG: step3');
  return new Promise((resolve, reject) => {
    client.createSession((error, session) => {
      if(error) { reject("Step3") }
      currentSession = session
      const sessionID = currentSession.sessionId.value
      const sessionName = currentSession.serverEndpoints[0].server.applicationName.text
      console.log(`Session opened successfully with server ${sessionName} with ID ${sessionID}`);
      resolve("Step4")
    })
  })
}

//  STEP 4: Read data continuously
async function readData(session, accessableTags) {
  console.log('DEBUG: step4');
  return new Promise((resolve, reject) => {
    setInterval(pollData, 1000)
    // resolve("Exit")
  })
}

//  STEP 5: Close session
async function disconnectClient(client, session) {
  console.log('DEBUG: step5');
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
  console.log(`Backoff #${retry}. Trying again in ${delay/1000} seconds.`);
});

//  Convert PLC Tag to OPC UA tag format
function formatTags(tagArray) {
  const regex1 = /\'/g
  const regex2 = /\'/g
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
        console.log(`Tag ${tag.name} found with value ${tag.value}`);
      } else {
        tag.value = null
        console.log(`Unable to read tag ${tag}.`);
      }
    })
  })
  console.log(`------------`);
}

export { processData }