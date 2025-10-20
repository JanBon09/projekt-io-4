//Message Basic Echo Handler

function SendMessage(socket){    
    socket.on("message", (data) => {
        console.log("message from", socket.id, data);
        socket.emit("echo", data);
    });
}