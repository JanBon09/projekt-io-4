export class Room {
    constructor(id, currentAnswer = "", players = []) {
        this.id = id;
        this.currentAnswer = currentAnswer;
        this.players = new Map();
        for(const p of players){
            this.players.set(p.id, p);
        }
    }
}