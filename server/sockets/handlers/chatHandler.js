//Message Basic Echo Handler
export function ReceiveMessage(socket, nicknames){
    socket.on("message", (data) => {
        console.log("message from", socket.id, data);
        socket.emit("echo", {'sender': nicknames[socket.id], 'data': data});
        socket.broadcast.emit("echo", {'sender': nicknames[socket.id] , 'data': data});
    });
}
