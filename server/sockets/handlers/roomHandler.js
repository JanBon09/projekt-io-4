import {rooms} from "../websockets.js";

// Handler do pokazywania dostępnych pokoi

export function ShowRooms(socket, rooms) {
    socket.on("show-rooms", () => {
        console.log(`Klient ${socket.id} zażądał listy pokoi.`);
        socket.emit("rooms-list", rooms);
    });
}