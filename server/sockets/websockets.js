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
    LeaveRoom(socket, rooms, io); // Przekazujemy 'io' do LeaveRoom

    // Game
    RenderDrawing(socket);
    StartGameHandler(io, socket, rooms);
    CheckCorrectAnswerHandler(io, socket, rooms);
    SyncGameHandler(io, socket, rooms); // NOWY HANDLER

    // Chat
    BroadcastMessage(socket, rooms, nicknames);
});

export { nicknames, rooms };