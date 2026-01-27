import { server } from "../src/index.js";
import { Server as IOServer } from "socket.io";
import { PlayerConnection, NicknameHandler } from "./handlers/playerHandler.js";
import { CreateRoom, JoinRoom, LeaveRoom } from "./handlers/roomHandler.js";
import { BroadcastMessage } from "./handlers/chatHandler.js";
import {
    RenderDrawing,
    StartGameHandler,
    CheckCorrectAnswerHandler,
    SyncGameHandler
} from "./handlers/gameHandler.js";

import { StartMusicGameHandler, CheckMusicAnswerHandler, SyncMusicGameHandler } from "./handlers/songgameHandler.js";

const io = new IOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let nicknames = {};
let rooms = [];

io.on("connection", (socket) => {
    // Player
    PlayerConnection(socket);
    NicknameHandler(socket, nicknames);

    // Room
    CreateRoom(socket, rooms, nicknames);
    JoinRoom(socket, rooms, nicknames);
    LeaveRoom(socket, rooms, io);

    // Game
    RenderDrawing(io, socket, rooms);
    StartGameHandler(io, socket, rooms);
    CheckCorrectAnswerHandler(io, socket, rooms);
    SyncGameHandler(io, socket, rooms);

    StartMusicGameHandler(io, socket, rooms);
    CheckMusicAnswerHandler(io, socket, rooms);
    SyncMusicGameHandler(io, socket, rooms);

    // Chat
    BroadcastMessage(socket, rooms, nicknames);
});

export { nicknames, rooms };