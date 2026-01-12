
// UPDATE : MOŻE DZIAŁAĆ (działa)

import {LeaveRoom} from "./roomHandler.js";
import {getPlayerRoom} from "../../services/playerService.js";

export function PlayerConnection(socket) {
    console.log("Nowy klient połączony:", socket.id);
}

export function NicknameHandler(socket, nicknames) {
    socket.on("create-nickname", (nickname) => {
        nicknames[socket.id] = nickname;
        console.log(`${socket.id} ustawił nick na ${nickname}`);
    });
}


// export function DisconnectionHandler(socket, nicknames, rooms) {
//     socket.on("disconnect", () => {
//         console.log(`Klient ${socket.id + " | " + nicknames[socket.id]} rozłączony.`);
//         const roomId = getPlayerRoom(socket.id, rooms);
//         console.log(roomId);
//         if (roomId) {
//             LeaveRoom(socket, rooms.get(roomId), socket.id);
//         }
//         delete nicknames[socket.id];
//     });
// }
