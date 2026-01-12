export function BroadcastMessage(socket, rooms, nicknames) {
    socket.on("message", (data) => {
        const roomId = data["roomId"];
        console.log("Message from", nicknames[socket.id], data["message"] + " Room: " + roomId);
        socket.emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
        socket.to(roomId).emit("echo", {'sender': nicknames[socket.id], 'message': data.message});
    });
}