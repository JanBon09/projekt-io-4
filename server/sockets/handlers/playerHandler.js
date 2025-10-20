// Ogólnie jest problem bo nie moge zrobic albo narazie nie wiem jak
// zrobić eksport wielu funkcji ponieważ pierwsza connection tworzy jakby juz ten socket.io
// na connecta i nie moge kolejnych handlerow dodac

export function PlayerConnection(io, nicknames = {}) {
    io.on("connection", (socket) => {
        console.log("Nowy klient połączony:", socket.id, socket.handshake.address);
        socket.emit("Witaj", { message: "connected", socketId: socket.id });

        socket.on("create-nickname", (nick) => {
            socket.nickname = nick;
            nicknames[socket.id] = nick;
            console.log("Użytkownik utworzył nazwę:", socket.id, nick);
            io.emit("nicknames", nicknames);
        });

        socket.on("disconnect", (reason) => {
            console.log("Użytkownik rozłączony:", socket.id, reason);
            delete nicknames[socket.id];
            io.emit("nicknames", nicknames);
        });
    });
}