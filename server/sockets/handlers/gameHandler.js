import {nicknames, rooms} from "../websockets.js";
import { isCorrectAnswer } from "../../services/charadeService.js";
import { AddPoints } from "../../services/playerService.js";
import { BroadcastMessage } from "./chatHandler.js";

export function CheckCorrectAnswerHandler(socket) {
    socket.on("check-answer", (answer) => {
        const room = rooms[socket.roomId];
        if(isCorrectAnswer(room, answer)) {
            console.log(`Klient ${socket.id} podał poprawną odpowiedź: ${answer}`);
            AddPoints(socket.player);
            socket.emit("correct-answer", { message: "Poprawna odpowiedź!", points: "+ " + socket.player.points, IsAnswered: true });
        }
        else{
            console.log(`Klient ${socket.id} podał niepoprawną odpowiedź: ${answer}`);
            BroadcastMessage(socket, nicknames);
            socket.emit("wrong-answer", { IsAnswered: false});
        }
    });
}