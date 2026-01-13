export function PlayerConnection(socket) {
    console.log("Nowy klient połączony:", socket.id);
}

export function NicknameHandler(socket, nicknames) {
    socket.on("create-nickname", (nickname) => {
        nicknames[socket.id] = nickname;
        console.log(`${socket.id} ustawił nick na ${nickname}`);
    });
}

