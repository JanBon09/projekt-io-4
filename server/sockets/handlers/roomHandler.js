import {Player} from "../../models/player.js";
import {AddPlayerToRoom, GenerateCode} from "../../services/roomService.js";
import {Room} from "../../models/room.js";
import {getPlayerRoom} from "../../services/playerService.js";


export function CreateRoom(socket, rooms, nicknames){
    socket.on("create-room", (data) => {
        const nickname = nicknames[socket.id];
        console.log(`User ${nickname} poprosił o utworzenie pokoju!`);

        const id = GenerateCode();
        console.log(`Wygenerowano pokój o id: ${id}`);
        const room = new Room(id, "", []);
        rooms.push(room);

        const player = new Player(socket.id, nickname,0, id);
        AddPlayerToRoom(room, player);
        socket.join(id);
        console.log("Uzytkownik: " + nickname + " dołączył do pokoju o ID: " + id);
        socket.to(id).emit("player-joined", {nickname: nickname});
        socket.emit("room-joined", {roomId: id})
    })
}


export function JoinRoom(socket, rooms, nicknames) {
    socket.on("join-room", async roomId => {
        const username = nicknames[socket.id];
        const room = rooms.find((room) => room.id === roomId);
        if(room){
            const player = new Player(socket.id, username,0, roomId);
            AddPlayerToRoom(room, player);
            await socket.join(roomId)
            console.log("Uzytkownik: " + username + " dołączył do pokoju o ID: " + roomId);
            socket.to(roomId).emit("player-joined", {nickname: username});
            socket.emit("room-joined", {roomId: roomId})
        }
        else{
            console.log("Pokój o id " + roomId + " nie istnieje");
            console.log(rooms);
            socket.emit("room-not-found")
        }
    })
}

export function LeaveRoom(socket, rooms) {
    socket.on("leave-room", async roomId => {
        const room = rooms.find((room) => room.id === roomId);
        const playerIndex = room.players.findIndex(p => socket.id === p.id);
        if (playerIndex !== -1) {
            const player = room.players[playerIndex];
            room.players.splice(playerIndex, 1);
            player.room = null;
            socket.leave(room.id);
            console.log(`${player.nickname} opuścił pokój: ${room.id}`);
            socket.to(room.id).emit("player-left", {
                nickname: player.nickname,
            });
        }
    })

}
