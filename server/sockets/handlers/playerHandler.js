import { nicknames } from "../websockets.js";



// Ogólnie jest problem bo nie moge zrobic albo narazie nie wiem jak
// zrobić eksport wielu funkcji ponieważ pierwsza connection tworzy jakby juz ten socket.io
// na connecta i nie moge kolejnych handlerow dodac

// UPDATE : MOŻE DZIAŁAĆ (działa)

// Tutaj w PlayerContection używam "connection" w websockets do obsługi połączenia 
// żebym mógł wszystko porozbijać na mniejsze funkcje

export function PlayerConnection(socket) {
    console.log("Nowy klient połączony:", socket.id, socket.handshake.address);
    socket.emit("Witaj", { message: "connected", socketId: socket.id });
}


// Handler odpowiadający za nadawanie nicków (client : "create-nickname", nickname)

export function NicknameHandler(socket, nicknames) {
    socket.on("create-nickname", (nickname) => {
        nicknames[socket.id] = nickname;
        console.log(`${socket.id} ustawił nick na ${nickname}`);
    });
}


// Handler odpowiadający za rozłączenie

export function DisconnectionHandler(socket, nicknames) {
    socket.on("disconnect", () => {
        console.log(`Klient ${socket.id + " | " + nicknames[socket.id]} rozłączony.`);
        delete nicknames[socket.id];
    });
}
