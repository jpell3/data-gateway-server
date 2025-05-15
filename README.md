#  iOS Data Server

##  Project Summary

The purpose of this project is to bridge the gap between industrial control systems and modern-day technology and frameworks. Designed as a modular Node.js server, it provides a clean and scalable architechture to retrieve real-time process data from PLCs using OPC UA and deliver that data to remote clients via WebSockets.

The system is split into two distinct services:
- **'Admin' Service** – Handles secure OPC UA data retrieval and formatting.
- **'Customer' Service** – Delivers the formatted data to mobile clients via WebSockets.

The goal is to provide a modular, scalable solution for remote visibility into live machine data — with a focus on reliability, clean architecture, and industrial applicability.


##  Architecture Overview

           +-----------------+         OPC UA        +------------------+
           |                 | <-------------------- |    PLC Server    |
           |      Admin      |                       +------------------+
           |  (Data Fetcher) |
           |                 |   JSON via Internal API
           |                 | ----------------------->
           +-----------------+                        |
                                                      ▼
                                         +--------------------------+
                                         |         Customer         |
                                         |    (WebSocket Server)    |
                                         +--------------------------+
                                                      |
                                                      |  WebSocket
                                                      ▼
                                         +--------------------------+
                                         |       iOS Client         |
                                         |    (Real-time Viewer)    |
                                         +--------------------------+
                                         

##  Sub-Applications

### 🔹 Admin Service
- Connects to the PLC via OPC UA using `node-opcua`.
- Fetches selected process values at regular intervals.
- Outputs data in a clean, structured JSON format.
- Passes data to the Customer service (planned: via HTTP, IPC, or shared memory).

### 🔹 Customer Service
- Exposes a WebSocket endpoint for remote clients.
- Receives updated process data from the Admin service.
- Delivers real-time updates to connected users.


##  Commands

To run this project, use `npm run dev`. This will start the main server and services automatically.


##  Skills & Technologies Utilized

- **Node.js** – Event-driven server architecture.
- **OPC UA (via `node-opcua`)** – Industrial data communication.
- **WebSocket** – Real-time, bi-directional data streaming.
- **Modular architecture** – Service separation and clean interfaces.
- **SwiftUI (in companion iOS project)** – UI for displaying process data.
- **Git / GitHub** – Version control and collaboration.


##  Project Milestones

| Milestone | Status |
|--------------|--------|
| Setup Node.js environment and project structure | ✅ Completed |
| Implement OPC UA data connection in Admin | ⏳ In Progress |
| Format and validate JSON output | ⏳ In Progress |
| Develop Customer service WebSocket server | ✅ Completed |
| Connect Admin and Customer services | ⏳ In Progress |
| Build SwiftUI client for iOS | ✅ Initial prototype complete |
| Add error handling and logging | ☐ Planned |
| Implement authentication for OPC UA access | ☐ Planned |
| Implement authentication for clients | ☐ Planned |
| Deploy server to Cloud | ☐ Future Improvement |


##  Repository

Companion iOS app: [github.com/jpell3/farrel-connect](https://github.com/jpell3/farrel-connect)


##  Notes

This project reflects my interest in combining industrial control knowledge with modern software engineering principles — focusing on performance, modularity, and ease of integration across platforms.