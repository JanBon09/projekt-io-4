import {Room} from "../models/room.js";
import {rooms} from "../sockets/websockets.js";

let codes = [];

export function AddPlayerToRoom(room, player){
    player.room = room.id;
    room.players.push(player);
}

export function GenerateCode(){
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.push(code);
    return code;
}

export function CreateRoom(){
    const room = new Room(GenerateCode(), "", []);
    rooms.push(room);
    return room;
}
