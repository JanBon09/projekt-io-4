
let answers = ["cat", "dog", "house"]


export function generateRandomAnswer(){
    return answers[Math.floor(Math.random() * answers.length)];
}

export function isCorrectAnswer(room, userAnswer){
    return userAnswer === room.currentAnswer;
}


function nextRound(io, room) {
    if (room.round >= room.totalRounds) {
        io.to(room.id).emit("game-over", { message: "Game over!" });
        return;
    }

    room.round++;
    room.currentAnswer = generateRandomAnswer();
    // Wybieramy kolejnego gracza jako rysownika
    const painterIndex = (room.round - 1) % room.players.length;
    room.drawingPlayerId = room.players[painterIndex].id;

    // Powiadom wszystkich o nowej rundzie
    io.to(room.id).emit("new-round", {
        round: room.round,
        painterNickname: room.players[painterIndex].nickname,
        painterId: room.drawingPlayerId
    });

    // Wyślij hasło TYLKO do rysownika
    io.to(room.drawingPlayerId).emit("secret-word", { word: room.currentAnswer });
}

// Zaktualizuj CheckCorrectAnswerHandler w tym samym pliku
export function CheckCorrectAnswerHandler(io, socket, rooms) {
    socket.on("message", (data) => {
        const room = rooms.find(r => r.id === data.roomId);
        if (!room || socket.id === room.drawingPlayerId) return; // Rysownik nie może zgadywać

        if (data.message.toLowerCase() === room.currentAnswer.toLowerCase()) {
            // Logika przyznawania punktów
            const player = room.players.find(p => p.id === socket.id);
            player.points += 10;

            io.to(room.id).emit("correct-answer", {
                winner: player.nickname,
                word: room.currentAnswer,
                points: player.points
            });

            // Rozpocznij kolejną rundę po krótkiej przerwie
            setTimeout(() => nextRound(io, room), 3000);
        }
    });
}