"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        var _a;
        //@ts-ignore
        const parsedMessage = JSON.parse(data);
        if (parsedMessage.type === 'join') {
            if (!allSockets.some((user) => user.socket === ws)) {
                allSockets.push({
                    socket: ws,
                    room: parsedMessage.payload.roomId
                });
            }
        }
        if (parsedMessage.type === 'chat') {
            const currentUserRoom = (_a = allSockets.find((x) => x.socket === ws)) === null || _a === void 0 ? void 0 : _a.room;
            console.log('currentUserRoom', currentUserRoom);
            allSockets.forEach((socket, index) => {
                console.log(socket, index);
                if (socket.room === currentUserRoom) {
                    socket.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
});
