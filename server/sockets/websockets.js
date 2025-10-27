// Websocket.js Zajmuję się obsługiwaniem handlerów związnych z WebSocketami

import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";
import { PlayerConnection, NicknameHandler, DisconnectionHandler } from "./handlers/playerHandler.js";
import {ReceiveMessage} from "./handlers/chatHandler.js";

const io = new IOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let nicknames = {};

// Tu by musiał być już jakiś model rooms; (rooms tylko dla przykładu)
let rooms = {};

// Jeżeli taki sposób wam się podoba LAJK!

io.on("connection", (socket) => {
    PlayerConnection(socket);
    NicknameHandler(socket, nicknames);
    DisconnectionHandler(socket, nicknames);
    ReceiveMessage(socket, nicknames);
});


export {nicknames} ;