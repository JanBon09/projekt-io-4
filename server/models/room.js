export class Room {
    constructor(id, name, players, ownerId) {
        this.id = id;
        this.name = name;
        this.players = players;
        this.ownerId = ownerId;


        this.currentAnswer = "";
        this.drawingPlayerId = null;
        this.round = 0;
        this.totalRounds = 5;
        this.isGameStarted = false;
        this.currentHint = "";

        this.timerInterval = null;
        this.timeLeft = 0;
        this.solvedBy = [];
    }
}