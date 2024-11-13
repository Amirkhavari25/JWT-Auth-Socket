const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7070 });


wss.on('connection', (socket) => {
    console.log(socket);
    console.log('server is connected');

    

    socket.on("close", () => {
        console.log('Server disconnected');
    })
});