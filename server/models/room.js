export class Room {
    constructor(id, currentAnswer = "", players = []) {
        this.id = id;
        this.currentAnswer = currentAnswer;
        this.usedAnswers = []
        this.players = [];
        this.roundNum = 0;
    }
}