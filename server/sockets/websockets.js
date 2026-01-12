// Websocket.js Zajmuję się obsługiwaniem handlerów związnych z WebSocketami

import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";
import { PlayerConnection, NicknameHandler } from "./handlers/playerHandler.js";
import {RenderDrawing} from "./handlers/gameHandler.js";
import {CreateRoom, JoinRoom, LeaveRoom} from "./handlers/roomHandler.js";
import { CheckCorrectAnswerHandler } from "./handlers/gameHandler.js";
import { BroadcastMessage } from "./handlers/chatHandler.js";
import {Room} from "../models/room.js";


const io = new IOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let nicknames = {};

let rooms = [];



io.on("connection", (socket) => {
    //Player Handlers
    PlayerConnection(socket);
    NicknameHandler(socket, nicknames);

    
    // Room Handlers
    CreateRoom(socket, rooms, nicknames);
    JoinRoom(socket, rooms, nicknames);
    LeaveRoom(socket, rooms, nicknames);

    //Game Handlers
    RenderDrawing(socket, nicknames);
    //CheckCorrectAnswerHandler(socket);

    //Chat Handlers
    BroadcastMessage(socket, rooms,nicknames);
});


export {nicknames, rooms} ;