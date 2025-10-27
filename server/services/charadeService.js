export {Room as room} from "../models/room.js";
import {rooms} from "../sockets/websockets.js";

let codes = [];

export function AddPlayerToRoom(room, player){
    room.players.set(player.id, player);
}

export function GenerateCode(){
    code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.push(code);
    return code;
}

export function CreateRoom(){
    const room = new Room(GenerateCode());
    rooms.push(room);
    return room;
}

export function EndRoom(roomId){
    //logika kończenia pokoju
    for(const player of room.players.values()){
        player.points = 0;
    }
    delete rooms[roomId];
}


export function isCorrectAnswer(room, answer){
    if(answer == room.currentAnswer){
        return true;
    }
    return false;
}