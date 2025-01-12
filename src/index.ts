import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// let allSockets = {
//     "room1": [socket1, socket2],
//     "room2": [socket3, socket4]
// }

interface User {
    socket: WebSocket,
    room: string
}

let allSockets: User[] = [];

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        //@ts-ignore
        const parsedMessage = JSON.parse(data)
        if (parsedMessage.type === 'join') {
            if (!allSockets.some((user) => user.socket === ws)) {
                allSockets.push({
                    socket: ws,
                    room: parsedMessage.payload.roomId
                })
            }
        }

        if (parsedMessage.type === 'chat') {
            const currentUserRoom = allSockets.find((x) => x.socket === ws)?.room;
            console.log('currentUserRoom', currentUserRoom)
            allSockets.forEach((socket, index) => {
                console.log(socket, index);
                if (socket.room === currentUserRoom) {
                    socket.socket.send(parsedMessage.payload.message)
                }
            })
        }
    });
});