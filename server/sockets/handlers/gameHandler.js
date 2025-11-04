
export function RenderDrawing(socket){
    socket.on("draw", (data) => {
        socket.broadcast.emit('drawing', data);
    })
}