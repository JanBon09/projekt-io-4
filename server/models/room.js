export class Room {
    constructor(id, name, players, ownerId, gameType = 'charades') {
        this.id = id;
        this.name = name;
        this.players = players;
        this.ownerId = ownerId;
        this.gameType = gameType
        this.currentAnswer = "";
        this.drawingPlayerId = null;
        this.round = 0;
        this.totalRounds = 5;
        this.isGameStarted = false;
        this.currentHint = "";
        this.currentClue = "";

        this.timerInterval = null;
        this.timeLeft = 0;
        this.solvedBy = [];
    }
}