const { authenticateWebSocket } = require('./middlewares/authMiddleware');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7070 });

var userDevices = [];

wss.on('connection', (ws, req) => {
    authenticateWebSocket(ws, req, () => {
        console.log(`User ${ws.user.username} connected successfully`);
        //insert user imeis to send command just to user's devices
        // var connection;
        // ws.user.imeis.array.forEach(item => {
        //     connection.imei = item;
        //     connection.connection = ws;
        // });
        // userDevices.push(connection);
        ws.on('message', (message) => {
            const data = JSON.parse(message);

            console.log(`Received message : ${data.message}`);
        });
    });
});

console.log('WebSocket server is running on ws://localhost:7070');