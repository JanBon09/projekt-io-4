export class Room {
    constructor(id, name, players, ownerId) {
        this.id = id;
        this.name = name;
        this.players = players; // Tablica obiektów graczy
        this.ownerId = ownerId; // ID socketa właściciela

        // Pola gry
        this.currentAnswer = "";
        this.drawingPlayerId = null;
        this.round = 0;
        this.totalRounds = 5; // Domyślnie, nadpisywane przy starcie
        this.isGameStarted = false;

        // Timer
        this.timerInterval = null;
        this.timeLeft = 0;
        this.solvedBy = []; // Lista ID graczy, którzy zgadli w danej rundzie
    }
}