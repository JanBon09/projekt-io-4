// Websocket.js Zajmuję się obsługiwaniem handlerów związnych z WebSocketami

import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";
import { PlayerConnection } from "./handlers/playerHandler.js";

const io = new IOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let nicknames = {};

PlayerConnection(io, nicknames, server);
