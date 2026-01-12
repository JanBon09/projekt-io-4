import { nicknames } from "../websockets.js";
import { generateRandomAnswer } from "../../services/charadeService.js";
import { AddPoints } from "../../services/playerService.js";

// --- POMOCNICZA: Wysyłanie listy graczy (w tym info kto jest właścicielem) ---
export function sendScoreUpdate(io, room) {
    const playerList = room.players.map(p => ({
        id: p.id,
        nickname: p.nickname,
        points: p.points,
        isDrawer: p.id === room.drawingPlayerId,
        isOwner: p.id === room.ownerId // WAŻNE: Info dla frontendu
    }));
    io.to(room.id).emit("update-players", playerList);
}

// --- LOGIKA TIMERA ---
function startRoundTimer(io, room) {
    if (room.timerInterval) clearInterval(room.timerInterval);
    room.timeLeft = 120;

    room.timerInterval = setInterval(() => {
        room.timeLeft--;
        io.to(room.id).emit("timer-update", { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
            clearInterval(room.timerInterval);
            io.to(room.id).emit("time-up", { message: "Time's up! Password is: " + room.currentAnswer });
            setTimeout(() => nextRound(io, room), 3000);
        }
    }, 1000);
}

// --- LOGIKA RUND ---
function nextRound(io, room) {
    if (room.round >= room.totalRounds) {
        clearInterval(room.timerInterval);
        io.to(room.id).emit("game-over", { message: "Game Over!" });
        room.isGameStarted = false;
        sendScoreUpdate(io, room); // Aktualizacja statusów
        return;
    }

    room.round++;
    room.currentAnswer = generateRandomAnswer();
    room.solvedBy = [];

    const painterIndex = (room.round - 1) % room.players.length;
    const painter = room.players[painterIndex];
    room.drawingPlayerId = painter.id;

    startRoundTimer(io, room);

    io.to(room.id).emit("new-round", {
        round: room.round,
        maxRounds: room.totalRounds, // Wysyłamy dynamiczną liczbę rund
        painterNickname: painter.nickname,
        painterId: painter.id,
        timeLeft: 120
    });

    sendScoreUpdate(io, room); // Aktualizacja (kto rysuje)
    io.to(painter.id).emit("secret-word", { word: room.currentAnswer });
}

// --- START GRY ---
export function StartGameHandler(io, socket, rooms) {
    socket.on("start-game", (roomId) => {
        const room = rooms.find(r => r.id === roomId);

        if (!room) return;

        // WERYFIKACJA WŁAŚCICIELA
        if (socket.id !== room.ownerId) {
            console.log(`Gracz ${socket.id} próbował startować, ale nie jest właścicielem.`);
            return;
        }

        if (!room.isGameStarted) {
            // USTAWIANIE LICZBY RUND: Gracze * 3
            const playerCount = room.players.length;
            room.totalRounds = playerCount * 3;
            // Zabezpieczenie na wypadek 0 graczy (teoretycznie niemożliwe tu)
            if (room.totalRounds === 0) room.totalRounds = 3;

            room.isGameStarted = true;
            room.round = 0;
            room.players.forEach(p => p.points = 0);

            console.log(`Start w pokoju ${roomId}. Rundy: ${room.totalRounds}`);
            nextRound(io, room);
        }
    });
}

// --- SYNCHRONIZACJA (Gdy gracz wchodzi na CharadesPage) ---
export function SyncGameHandler(io, socket, rooms) {
    socket.on("sync-game", (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            // Wyślij aktualną listę graczy (żeby wiedział kto jest ownerem)
            sendScoreUpdate(io, room);

            // Jeśli gra trwa, wyślij stan gry
            if (room.isGameStarted) {
                socket.emit("new-round", {
                    round: room.round,
                    maxRounds: room.totalRounds,
                    painterNickname: room.players.find(p => p.id === room.drawingPlayerId)?.nickname || "?",
                    painterId: room.drawingPlayerId,
                    timeLeft: room.timeLeft
                });

                // Jeśli to malarz się odświeżył, przypomnij mu hasło
                if (socket.id === room.drawingPlayerId) {
                    socket.emit("secret-word", { word: room.currentAnswer });
                }
            }
        }
    });
}

// --- SPRAWDZANIE ODPOWIEDZI ---
export function CheckCorrectAnswerHandler(io, socket, rooms) {
    socket.on("message", (data) => {
        const room = rooms.find(r => r.id === data.roomId);
        if (!room || !room.isGameStarted) return;
        if (socket.id === room.drawingPlayerId) return;
        if (room.solvedBy && room.solvedBy.includes(socket.id)) return;

        if (data.message.trim().toLowerCase() === room.currentAnswer.toLowerCase()) {
            const timeBonus = Math.floor(room.timeLeft / 10);
            const pointsScored = (9 + timeBonus) * 10;

            const player = room.players.find(p => p.id === socket.id);
            if (player) player.points += pointsScored;

            if (!room.solvedBy) room.solvedBy = [];
            room.solvedBy.push(socket.id);

            if (room.solvedBy.length === 1) {
                room.timeLeft = Math.floor(room.timeLeft / 2);
                io.to(room.id).emit("timer-shortened", { message: "Time is halved!" });
            }

            io.to(room.id).emit("correct-answer", {
                winner: nicknames[socket.id],
                pointsAdded: pointsScored,
                totalPoints: player ? player.points : 0,
                word: room.currentAnswer
            });

            sendScoreUpdate(io, room); // Aktualizacja punktów

            if (room.solvedBy.length >= room.players.length - 1) {
                //WSZYSCY ZGADLI
                clearInterval(room.timerInterval);
                setTimeout(() => nextRound(io, room), 2000);
            }
        }
    });
}

export function RenderDrawing(socket) {
    socket.on("draw", (data) => {
        socket.to(data.roomId).emit('drawing', data);
    })
}