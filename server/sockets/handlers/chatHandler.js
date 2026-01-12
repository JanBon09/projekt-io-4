export function BroadcastMessage(socket, rooms, nicknames) {
    socket.on("message", (data) => {
        const roomId = data["roomId"];
        const room = rooms.find(r => r.id === roomId);

        // Logika anty-spoilerowa
        if (room && room.isGameStarted) {
            // Jeśli to poprawna odpowiedź, PRZERYWAMY funkcję (nie robimy emit 'echo')
            // Logikę punktów obsłuży CheckCorrectAnswerHandler w gameHandler.js
            if (data.message.trim().toLowerCase() === room.currentAnswer.toLowerCase()) {
                return;
            }
        }

        // Standardowe działanie dla zwykłych wiadomości
        console.log("Message from", nicknames[socket.id], data["message"] + " Room: " + roomId);
        // Emitujemy do nadawcy (żeby widział co napisał, chyba że chcesz ukryć też u niego)
        socket.emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
        // Emitujemy do reszty
        socket.to(roomId).emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
    });
}