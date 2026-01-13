import {normalizeAnswer} from "../../services/charadeService.js";

export function BroadcastMessage(socket, rooms, nicknames) {
    socket.on("message", (data) => {
        const roomId = data["roomId"];
        const room = rooms.find(r => r.id === roomId);

        if (room && room.isGameStarted) {
            if ((data.message.trim().toLowerCase() === room.currentAnswer.toLowerCase()) || (normalizeAnswer(data.message.trim().toLowerCase())) === normalizeAnswer(room.currentAnswer.toLowerCase())) {
                return;
            }
        }
        socket.emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
        socket.to(roomId).emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
    });
}