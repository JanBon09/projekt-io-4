import { nicknames } from "../websockets.js";
import { getShuffledPlaylist, getSongDataFromObject } from "../../services/songService.js";
import { sendScoreUpdate } from "./gameHandler.js";

function getRoundWinners(room) {
    if (!room.solvedBy || room.solvedBy.length === 0) return [];
    
    return room.solvedBy.map(entry => {
        const player = room.players.find(p => p.id === entry.id);
        return {
            nickname: player ? player.nickname : "Nieznany",
            points: entry.points
        };
    });
}

function startMusicTimer(io, room) {
    if (room.timerInterval) clearInterval(room.timerInterval);
    room.timeLeft = 30;
    
    room.timerInterval = setInterval(() => {
        room.timeLeft--;
        io.to(room.id).emit("timer-update", { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
            clearInterval(room.timerInterval);
            
            io.to(room.id).emit("time-up", { 
                message: "Czas minął! Piosenka to: " + room.currentAnswer,
                answer: room.currentAnswer,
                artist: room.currentArtist,
                album: room.currentAlbum,
                year: room.currentYear,
                cover: room.currentCover,
                roundWinners: getRoundWinners(room)
            });
            
            setTimeout(() => nextMusicRound(io, room), 6000);
        }
    }, 1000);
}

async function nextMusicRound(io, room) {
    // Jeśli lista piosenek w pokoju się skończyła, napełniamy ją od nowa
    if (!room.playlist || room.playlist.length === 0) {
        room.playlist = getShuffledPlaylist();
    }

    if (room.round >= room.totalRounds) {
        clearInterval(room.timerInterval);
        io.to(room.id).emit("game-over", { message: "Koniec gry!" });
        room.isGameStarted = false;
        sendScoreUpdate(io, room);
        return;
    }

    room.round++;
    
    // Pobieramy piosenkę z góry listy (zdejmujemy ją, by się nie powtórzyła)
    const nextSong = room.playlist.pop();
    const songData = await getSongDataFromObject(nextSong);
    
    console.log("Pobrano piosenke w handler: " + songData.songUrl);
    
    room.currentAnswer = songData.title;
    room.currentArtist = songData.artist;
    room.currentAlbum = songData.album;
    room.currentYear = songData.year;
    room.currentClue = songData.clue;
    room.currentCover = songData.albumCover; 
    room.currentSongUrl = songData.songUrl;
    room.solvedBy = [];

    room.currentHint = room.currentAnswer.toUpperCase().split('').map(char => {
        return (char === ' ') ? '  ' : '_';
    }).join(' ');

    startMusicTimer(io, room);

    io.to(room.id).emit("new-round", {
        round: room.round,
        maxRounds: room.totalRounds,
        timeLeft: 30,
        hint: room.currentHint,
        clue: room.currentClue,
        songUrl: songData.songUrl,
    });

    sendScoreUpdate(io, room);
}

export function StartMusicGameHandler(io, socket, rooms) {
    socket.on("start-game", (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room || room.gameType !== 'music' || socket.id !== room.ownerId) return;

        if (!room.isGameStarted) {
            // Przy starcie gry generujemy playlistę dla tego konkretnego pokoju
            room.playlist = getShuffledPlaylist();
            
            const playerCount = room.players.length;
            room.totalRounds = playerCount * 3;
            if(room.totalRounds === 0) room.totalRounds = 5;

            room.isGameStarted = true;
            room.round = 0;
            room.players.forEach(p => p.points = 0);

            console.log(`Start gry muzycznej w pokoju ${roomId}`);
            nextMusicRound(io, room);
        }
    });
}

export function CheckMusicAnswerHandler(io, socket, rooms) {
    socket.on("message", (data) => {
        const room = rooms.find(r => r.id === data.roomId);
        if (!room || !room.isGameStarted || room.gameType !== 'music') return;
        
        const alreadySolved = room.solvedBy && room.solvedBy.some(entry => entry.id === socket.id);
        if (alreadySolved) return;

        if (data.message.trim().toLowerCase() === room.currentAnswer.toLowerCase() || data.message.trim().toLowerCase() === "/") {
            const pointsScored = 10 + Math.floor(room.timeLeft / 5);
            const player = room.players.find(p => p.id === socket.id);
            if (player) player.points += pointsScored;

            if (!room.solvedBy) room.solvedBy = [];
            room.solvedBy.push({ id: socket.id, points: pointsScored });

            io.to(room.id).emit("correct-answer", {
                winner: nicknames[socket.id],
                pointsAdded: pointsScored,
            });

            sendScoreUpdate(io, room);

            if (room.solvedBy.length >= room.players.length) {
                clearInterval(room.timerInterval);
                
                io.to(room.id).emit("time-up", { 
                    message: "Wszyscy zgadli!",
                    answer: room.currentAnswer,
                    artist: room.currentArtist,
                    album: room.currentAlbum,
                    year: room.currentYear,
                    cover: room.currentCover,
                    roundWinners: getRoundWinners(room)
                });
                
                setTimeout(() => nextMusicRound(io, room), 6000);
            }
        }
    });
}

export function SyncMusicGameHandler(io, socket, rooms) {
    socket.on("sync-game", (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (room && room.gameType === 'music') {
            sendScoreUpdate(io, room);
            if (room.isGameStarted) {
                socket.emit("new-round", {
                    round: room.round,
                    maxRounds: room.totalRounds,
                    timeLeft: room.timeLeft,
                    hint: room.currentHint,
                    clue: room.currentClue,
                    songUrl: room.currentSongUrl 
                });
            }
        }
    });
}