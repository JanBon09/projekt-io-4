// Websocket.js Zajmuję się obsługiwaniem handlerów związnych z WebSocketami

import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";

const io = new IOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let nicknames = {};

//playerHandler.js

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id, socket.handshake.address);
    socket.emit("welcome", { message: "connected", socketId: socket.id });

    //playerHandler.js
    socket.on("create-nickname", (nick) => {
        socket.nickname = nick;
        nicknames[socket.id] = nick;
        console.log("Nickname created:", socket.id, nick);
        io.emit("nicknames", nicknames);
    });

    //chatHandler.js
    socket.on("message", (data) => {
        console.log("message from", socket.id, data);
        socket.emit("echo", data);
    });

    //playerHandler.js
    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", socket.id, reason);
        delete nicknames[socket.id];
        io.emit("nicknames", nicknames);
    });
});

server.listen(3000, () => {
    console.log("WebSocket server is running on port 3000");
});