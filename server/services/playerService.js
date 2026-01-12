export function AddPoints(player){
    player.points += 10;
    player.roundPoints = player.points;
}

function CreatePlayer(socket){
    return new Player(socket.nickname, 0);
}


export function getPlayerRoom(socketId, rooms) {
    for (let [roomId, room] of rooms.entries()) {
        if (room.players.some(player => player.id === socketId)) {
            return roomId;
        }
    }
    return null;
}