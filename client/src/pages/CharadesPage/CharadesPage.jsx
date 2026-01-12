import styles from './CharadesPage.module.css'
import {useEffect, useRef, useState} from "react";
import {useSocket} from "../../context/SocketContext";
import BackArrow from "../../components/BackArrow/BackArrow";
import ColorBucket from "../../components/ColorBucket/ColorBucket";
import AnimatedComponent from "../../components/AnimatedComponent/AnimatedComponent";
import ChatComponent from "../../components/ChatComponent/ChatComponent";
import buttonSprite from '../../assets/png/send-button-sheet.png';
import cursorSmSprite from '../../assets/png/cursor-sm-sheet.png';
import cursorLgSprite from '../../assets/png/cursor-lg-sheet.png';
import cursorMdSprite from '../../assets/png/cursor-md-sheet.png';
import pencilButtonSprite from '../../assets/png/pencil-button-sheet.png';
import eraserButtonSheet from '../../assets/png/eraser-button-sheet.png';
import {ReactComponent as CornerL} from "../../assets/svg/corner-left.svg";
import {ReactComponent as CornerR} from "../../assets/svg/corner-right.svg";
import {useParams} from "react-router-dom";

function CharadesPage() {
    const {id} = useParams();
    const canvasRef = useRef(null)
    const inputRef = useRef(null)
    const socket = useSocket();
    const [lastPos, setLastPos] = useState([0,0])
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#000000");
    const [strokeSize, setStrokeSize] = useState(10);
    const [state, setState] = useState("DRAWING");
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

    // --- STANY GRY ---
    const [gameActive, setGameActive] = useState(false);
    const [round, setRound] = useState(0);
    const [maxRounds, setMaxRounds] = useState(5); // Nowy stan
    const [isPainter, setIsPainter] = useState(false);
    const [secretWord, setSecretWord] = useState("");
    const [painterName, setPainterName] = useState("");
    const [timeLeft, setTimeLeft] = useState(120);
    const [players, setPlayers] = useState([]);

    // Obliczamy czy jestem właścicielem na podstawie listy graczy
    const isOwner = players.find(p => p.id === socket?.id)?.isOwner || false;

    useEffect(() => {
        if (!canvasRef.current || !socket) return;

        // NAJWAŻNIEJSZE: Poproś serwer o aktualny stan po wejściu
        socket.emit("sync-game", id);

        socket.on("drawing", (data) => drawUser(data));

        socket.on("echo", (data) => {
            setMessages((prev) => [...prev, {username: data["sender"], message: data["message"], type: "normal"}]);
        });
        socket.on("player-joined", (data) => {
            setMessages((prev) => [...prev, {username: data.nickname, type: "user-join"}]);
            // Poproś o odświeżenie listy graczy (dla pewności)
            socket.emit("sync-game", id);
        });
        socket.on("player-left", (data) => {
            setMessages((prev) => [...prev, {username: data.nickname, type: "user-left"}]);
        });

        socket.on("new-round", (data) => {
            setGameActive(true);
            setRound(data.round);
            setMaxRounds(data.maxRounds); // Ustawiamy max rund
            setPainterName(data.painterNickname);
            setIsPainter(data.painterId === socket.id);
            setSecretWord("");
            setTimeLeft(data.timeLeft || 120);

            // Czyść canvas tylko jeśli to faktycznie nowa runda (nie przy odświeżaniu)
            // Można dodać logikę sprawdzającą, ale dla uproszczenia czyścimy:
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            setMessages((prev) => [...prev, {
                username: "SYSTEM",
                message: `Round ${data.round} / ${data.maxRounds}! Drawing: ${data.painterNickname}`,
                type: "system"
            }]);
        });

        socket.on("update-players", (playerList) => {
            setPlayers(playerList);
        });

        socket.on("timer-update", (data) => setTimeLeft(data.timeLeft));

        socket.on("timer-shortened", () => {
            setMessages((prev) => [...prev, {username: "INFO", message: "Time is halved!", type: "system"}]);
        });

        socket.on("secret-word", (data) => setSecretWord(data.word));

        socket.on("correct-answer", (data) => {
            setMessages((prev) => [...prev, {
                username: "SUKCES",
                message: `${data.winner} guessed the password! (+${data.pointsAdded} pts)`,
                type: "system"
            }]);
        });

        socket.on("game-over", (data) => {
            setGameActive(false);
            setMessages((prev) => [...prev, {username: "SYSTEM", message: data.message, type: "system"}]);
        });

        return () => {
            socket.off("drawing");
            socket.off("new-round");
            socket.off("secret-word");
            socket.off("correct-answer");
            socket.off("timer-update");
            socket.off("timer-shortened");
            socket.off("game-over");
            socket.off("echo");
            socket.off("player-joined");
            socket.off("player-left");
            socket.off("update-players");
        }
    }, [socket, id]);

    const draw = (e) => {
        if (gameActive && !isPainter) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        const x2 = (e.clientX - rect.left) * canvas.width / rect.width;
        const y2 = (e.clientY - rect.top) * canvas.height / rect.height;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if(state === "DRAWING") {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeSize;
        }
        if(state === "ERASING") {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = strokeSize*10;
        }
        const x1 = lastPos[0] || x2;
        const y1 = lastPos[1] || y2;
        if(isDrawing) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            socket.emit('draw', {"x1": x1, "y1": y1, "x2": x2, "y2": y2, "color": color, "lineWidth": strokeSize, state: state, "roomId": id});
        }
        setLastPos([x2,y2])
    }

    const drawUser = (data) => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext("2d");
        if(data["state"] === "DRAWING") {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = data["color"];
            ctx.lineWidth = data["lineWidth"];
        }
        if(data["state"] === "ERASING") {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = data["lineWidth"]*10;
        }
        ctx.beginPath();
        ctx.moveTo(data["x1"], data["y1"]);
        ctx.lineTo(data["x2"], data["y2"]);
        ctx.stroke();
    }

    const changeStrokeSize = (size) => {
        const sizes = {sm: 5, md: 10, lg: 15};
        setStrokeSize(sizes[size] || 10);
    }

    const sendMessage = () => {
        if(!msg) return;
        socket.emit("message", { message: msg, roomId: id })
        setMsg("");
        inputRef.current.value = "";
    }

    const startGame = () => {
        socket.emit("start-game", id);
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    return (
        <div className={styles.mainContainer}>

            {/* LEWA KOLUMNA: TYLKO SCOREBOARD */}
            <div className={styles.leftContainer}>
                <div className={styles.upLeftContainer}>
                    <BackArrow roomId={id}></BackArrow>

                    <div className={styles.scoreboardContainer}>
                        <h3 className={styles.scoreTitle}>Scoreboard</h3>
                        <ul className={styles.playerList}>
                            {players.map((p) => (
                                <li key={p.id} className={styles.playerItem}>
                                    <span className={styles.playerName}>
                                        {p.isOwner && "👑"} {p.nickname} {p.isDrawer && "✏️"}
                                    </span>
                                    <span className={styles.playerPoints}>{p.points}</span>
                                </li>
                            ))}
                            {players.length === 0 && <li className={styles.playerItem} style={{justifyContent: 'center', color: '#777'}}>No players</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ŚRODEK */}
            <div className={styles.middleContainer}>

                {/* INFO BAR */}
                <div className={styles.gameInfoBar}>
                    {!gameActive ? (
                        <div className={styles.lobbyInfo}>
                            <h2>Room ID: {id}</h2>
                            {/* LOGIKA: PRZYCISK TYLKO DLA WŁAŚCICIELA */}
                            {isOwner ? (
                                <button className={styles.startBtn} onClick={startGame}>START</button>
                            ) : (
                                <span style={{color: '#aaa', fontStyle: 'italic'}}>Waiting for room owner...</span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.activeGameInfo}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Round</span>
                                <span className={styles.value}>{round}/{maxRounds}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Time left</span>
                                <span className={`${styles.timerValue} ${timeLeft < 30 ? styles.timerRed : ''}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                {isPainter ? (
                                    <>
                                        <span className={styles.label}>Your password</span>
                                        <span className={styles.secretWord}>{secretWord.toUpperCase()}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.label}>Draws</span>
                                        <span className={styles.drawerName}>{painterName}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* CANVAS */}
                <canvas width="1920" height="1080"
                        onMouseMove={draw}
                        onMouseDown={() => setIsDrawing(true)}
                        onMouseUp={() => setIsDrawing(false)}
                        ref={canvasRef}
                        className={styles.mainCanvas}>
                </canvas>

                {/* NARZĘDZIA POD CANVASEM */}
                <div className={styles.toolsContainer} style={{visibility: (isPainter || !gameActive) ? 'visible' : 'hidden'}}>
                    <AnimatedComponent frames={8} totalWidth={768} frameHeight={93} widthPercent={10} heightPercent={80} spriteSheet={cursorSmSprite} timeout={70} onClick={() => changeStrokeSize("sm")} />
                    <AnimatedComponent frames={8} totalWidth={768} frameHeight={93} widthPercent={10} heightPercent={80} spriteSheet={cursorMdSprite} timeout={70} onClick={() => changeStrokeSize("md")} />
                    <AnimatedComponent frames={8} totalWidth={768} frameHeight={93} widthPercent={10} heightPercent={80} spriteSheet={cursorLgSprite} timeout={70} onClick={() => changeStrokeSize("lg")} />
                    <AnimatedComponent frames={8} totalWidth={768} frameHeight={93} widthPercent={10} heightPercent={80} spriteSheet={pencilButtonSprite} timeout={70} onClick={() => setState("DRAWING")} />
                    <AnimatedComponent frames={8} totalWidth={768} frameHeight={93} widthPercent={10} heightPercent={80} spriteSheet={eraserButtonSheet} timeout={70} onClick={() => setState("ERASING")} />
                </div>

                {/* WIADERKA Z BOKU */}
                {(isPainter || !gameActive) && (
                    <div className={styles.middleRightContainer}>
                        <ColorBucket color="black" onClick={setColor}></ColorBucket>
                        <ColorBucket color="brown" onClick={setColor}></ColorBucket>
                        <ColorBucket color="red" onClick={setColor}></ColorBucket>
                        <ColorBucket color="yellow" onClick={setColor}></ColorBucket>
                        <ColorBucket color="green" onClick={setColor}></ColorBucket>
                        <ColorBucket color="blue" onClick={setColor}></ColorBucket>
                    </div>
                )}
            </div>

            {/* PRAWA STRONA (CHAT) */}
            <div className={styles.rightContainer}>
                <ChatComponent className={styles.chatContainer}>
                    {messages.map((data, index) => (
                        <div key={index} className={styles.message}>
                            {data.type === "user-join" ? (
                                <span className={styles.userJoin}>{data.username} joined!</span>
                            ) : data.type === "user-left" ? (
                                <span className={styles.userLeft}>{data.username} left!</span>
                            ) : data.type === "system" ? (
                                <span style={{color: '#FFD700', fontWeight: 'bold'}}>{data.message}</span>
                            ) : (
                                <>
                                    <span className={styles.chatUser}>{data.username}</span>: {data.message}
                                </>
                            )}
                        </div>
                    ))}
                </ChatComponent>

                <div className={styles.underChatContainer}>
                    <div className={styles.inputContainer}>
                        <input ref={inputRef} className={styles.chatInput} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} type={"text"} placeholder={"Answer..."}></input>
                    </div>
                    <AnimatedComponent frames={7} totalWidth={1428} frameHeight={135} widthPercent={50} heightPercent={95} spriteSheet={buttonSprite} timeout={70} onClick = {() => sendMessage()} />
                </div>
            </div>

            <CornerL className={styles.cornerLeft}></CornerL>
            <CornerR className={styles.cornerRight}></CornerR>
        </div>
    )
}

export default CharadesPage;