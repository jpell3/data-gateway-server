import { WebSocketServer } from 'ws'
      
const io = new WebSocketServer({ port: 8085 });

io.on('connection', socket => {
  console.log(`New client connected.`);
  socket.send("Server connection successful")
  
  socket.on('message', message => {
    console.log(`Message received from client: ${message}`);
    socket.send(`ECHO: ${message}`)
  });

  socket.on('close', () => {
    console.log(`Client Disconnected.`);
  });
});