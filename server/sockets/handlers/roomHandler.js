import { Room } from "../../models/room.js";
import { AddPlayerToRoom, GenerateCode } from "../../services/roomService.js";
import { Player } from "../../models/player.js";

// Importujemy funkcję z gameHandler, aby zaktualizować listę graczy (z ikoną korony) przy zmianach
import { sendScoreUpdate } from "./gameHandler.js";

export function CreateRoom(socket, rooms, nicknames) {
    socket.on("create-room", (data) => {
        const nickname = nicknames[socket.id];
        console.log(`User ${nickname} tworzy pokój.`);

        const id = GenerateCode();
        // Czwarty argument to ownerId - ustawiamy twórcę jako właściciela
        const room = new Room(id, "", [], socket.id);
        rooms.push(room);

        const player = new Player(socket.id, nickname, 0, id);
        AddPlayerToRoom(room, player);

        socket.join(id);
        socket.emit("room-joined", { roomId: id });
    });
}

export function JoinRoom(socket, rooms, nicknames) {
    socket.on("join-room", async (roomId) => {
        const username = nicknames[socket.id];
        const room = rooms.find((r) => r.id === roomId);

        if (room) {
            const player = new Player(socket.id, username, 0, roomId);
            AddPlayerToRoom(room, player);
            await socket.join(roomId);

            console.log(`${username} dołączył do pokoju ${roomId}`);

            socket.to(roomId).emit("player-joined", { nickname: username });
            socket.emit("room-joined", { roomId: roomId });
        } else {
            socket.emit("room-not-found");
        }
    });
}

export function LeaveRoom(socket, rooms, io) { // Dodajemy 'io' jako argument w websockets.js
    const handleLeave = (roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;

        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
            const player = room.players[playerIndex];
            room.players.splice(playerIndex, 1);

            socket.leave(roomId);
            console.log(`${player.nickname} opuścił pokój ${roomId}`);

            socket.to(roomId).emit("player-left", { nickname: player.nickname });

            // LOGIKA PRZEKAZYWANIA WŁAŚCICIELA
            if (socket.id === room.ownerId && room.players.length > 0) {
                room.ownerId = room.players[0].id; // Nowym szefem pierwszy gracz z listy
                console.log(`Nowym właścicielem pokoju ${roomId} jest ${room.players[0].nickname}`);
            }

            // Jeśli gra trwa lub jesteśmy w lobby, aktualizujemy listę (żeby pokazać nową koronę)
            if (io) sendScoreUpdate(io, room);
        }

        // Usuń pokój jeśli pusty
        if (room.players.length === 0) {
            const roomIndex = rooms.indexOf(room);
            if (roomIndex !== -1) rooms.splice(roomIndex, 1);
        }
    };

    socket.on("leave-room", (roomId) => handleLeave(roomId));

    socket.on("disconnect", () => {
        // Znajdź pokój gracza (uproszczone szukanie)
        const room = rooms.find(r => r.players.some(p => p.id === socket.id));
        if (room) handleLeave(room.id);
    });
}