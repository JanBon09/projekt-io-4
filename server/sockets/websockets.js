// Websocket.js Zajmuję się obsługiwaniem handlerów związnych z WebSocketami

import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";
import { PlayerConnection, NicknameHandler, DisconnectionHandler } from "./handlers/playerHandler.js";
import {ReceiveMessage} from "./handlers/chatHandler.js";
import {RenderDrawing} from "./handlers/gameHandler.js";
import { ShowRooms, RoomConnection, RoomDetailsHandler } from "./handlers/roomHandler.js";
import { CheckCorrectAnswerHandler } from "./handlers/gameHandler.js";
import { BroadcastMessage } from "./handlers/chatHandler.js";

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

    //Player Handlers

    PlayerConnection(socket);
    NicknameHandler(socket, nicknames);
    DisconnectionHandler(socket, nicknames);
    ReceiveMessage(socket, nicknames);
    RenderDrawing(socket, nicknames);
    
    // Room Handlers
    
    ShowRooms(socket, rooms);
    RoomConnection(socket, rooms, nicknames);
    RoomDetailsHandler(socket, rooms);

    //Game Handlers

    CheckCorrectAnswerHandler(socket);

    //Chat Handlers
    BroadcastMessage(socket, nicknames);
});


export {nicknames, rooms} ;