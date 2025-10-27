import CreatePlayer from "../../services/playerService.js";
import { AddPlayerToRoom } from "../../services/charadeService.js";

// Handler do pokazywania dostępnych pokoi

export function ShowRooms(socket, rooms) {
    socket.on("show-rooms", () => {
        console.log(`Klient ${socket.id} zażądał listy pokoi.`);
        socket.emit("rooms-list", rooms);
    });
}

export function RoomConnection(socket, rooms, nicknames) {
    console.log("Nowy klient połączony do RoomHandler:", socket.id, socket.handshake.address);
    const player = CreatePlayer(socket);
    AddPlayerToRoom(rooms[socket.roomId], player);
    socket.emit("room-connect", { message: "Połączono do pokoju", socketId: socket.id, nicknames: nicknames[socket.id] });
}

export function RoomDetailsHandler(socket, rooms) {
    socket.on("room-details", () => {
        const room = rooms[socket.roomId];
        if (room) {
            socket.emit("room-details", { id: room.id, players: Array.from(room.players.values()) });
        } else {
            socket.emit("room-details", { error: "Pokój nie istnieje." });
        }
    });
}