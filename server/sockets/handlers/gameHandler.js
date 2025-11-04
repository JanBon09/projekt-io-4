
export function RenderDrawing(socket, users){
    socket.on("draw", (data) => {
        socket.broadcast.emit('drawing', data);
    })
}