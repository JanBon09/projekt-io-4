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
    const [strokeSize, setStrokeSize] = useState(0);
    const [state, setState] = useState("DRAWING");
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log(id);
        if (!canvasRef.current) return;
        socket.on("drawing", (data) => {
          drawUser(data)
        })
            socket.on("echo", (data) => {
                setMessages((prev) => [...prev, {username: data["sender"], message: data["message"], type: "normal"}]);
            })

            socket.on("player-joined", (data) => {
                setMessages((prev) => [...prev, {username: data.nickname, type: "user-join"}]);
            })

        socket.on("player-left", (data) => {
            setMessages((prev) => [...prev, {username: data.nickname, type: "user-left"}]);
        })
        },
        [socket])


    const draw = (e) =>{

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
        if(!ctx) return;



        if(data["state"] === "DRAWING") {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = data["color"];
            ctx.lineWidth = data["lineWidth"];
            ctx.beginPath();
            ctx.moveTo(data["x1"], data["y1"]);
            ctx.lineTo(data["x2"], data["y2"]);
            ctx.stroke();
        }
        if(data["state"] === "ERASING") {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = data["lineWidth"]*10;
            ctx.beginPath();
            ctx.moveTo(data["x1"], data["y1"]);
            ctx.lineTo(data["x2"], data["y2"]);
            ctx.stroke();
        }

    }

    const changeStrokeSize = (size) => {
        switch (size) {
            case "sm":
                setStrokeSize(5);
                break;
            case "md":
                setStrokeSize(10);
                break;
            case "lg":
                setStrokeSize(15);
                break;
            default:
                setStrokeSize(10);
                break;
        }
    }

    const sendMessage = () => {
        socket.emit("message", {
            message: msg,
            roomId: id,
        })
        setMsg("");
        inputRef.current.value = "";

    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.upLeftContainer}>
                    <BackArrow roomId={id}></BackArrow>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.scoreboard}>
                        <h1>{id}</h1>
                    </div>
                    <canvas width="1920" height="1080"
                            onMouseMove={draw}
                            onMouseDown={() => setIsDrawing(true)}
                            onMouseUp={() => setIsDrawing(false)}
                            ref={canvasRef}
                            className={styles.mainCanvas}>
                    </canvas>
                    <div className={styles.middleRightContainer}>
                        <ColorBucket color="black" onClick={setColor}></ColorBucket>
                        <ColorBucket color="brown" onClick={setColor}></ColorBucket>
                        <ColorBucket color="red" onClick={setColor}></ColorBucket>
                        <ColorBucket color="yellow" onClick={setColor}></ColorBucket>
                        <ColorBucket color="green" onClick={setColor}></ColorBucket>
                        <ColorBucket color="blue" onClick={setColor}></ColorBucket>
                    </div>
                </div>
                <div className={styles.downLeftContainer}>
                    <AnimatedComponent
                        frames={8}
                        totalWidth={768}
                        frameHeight={93}
                        widthPercent={10}
                        heightPercent={80}
                        spriteSheet={cursorSmSprite}
                        timeout={70}
                        onClick={() => changeStrokeSize("sm")}
                    />
                    <AnimatedComponent
                        frames={8}
                        totalWidth={768}
                        frameHeight={93}
                        widthPercent={10}
                        heightPercent={80}
                        spriteSheet={cursorMdSprite}
                        timeout={70}
                        onClick={() => changeStrokeSize("md")}
                    />
                    <AnimatedComponent
                        frames={8}
                        totalWidth={768}
                        frameHeight={93}
                        widthPercent={10}
                        heightPercent={80}
                        spriteSheet={cursorLgSprite}
                        timeout={70}
                        onClick={() => changeStrokeSize("lg")}
                    />
                    <AnimatedComponent
                        frames={8}
                        totalWidth={768}
                        frameHeight={93}
                        widthPercent={10}
                        heightPercent={80}
                        spriteSheet={pencilButtonSprite}
                        timeout={70}
                        onClick={() => setState("DRAWING")}
                    />
                    <AnimatedComponent
                        frames={8}
                        totalWidth={768}
                        frameHeight={93}
                        widthPercent={10}
                        heightPercent={80}
                        spriteSheet={eraserButtonSheet}
                        timeout={70}
                        onClick={() => setState("ERASING")}
                    />
                </div>
            </div>
            <div className={styles.rightContainer}>
                <ChatComponent className={styles.chatContainer}>
                    {messages.map((data, index) => (
                        <div key={index} className={styles.message}>
                            {data.type === "user-join" ? (
                                <span className={styles.userJoin}>{data.username} joined the room!</span>
                                ) : data.type === "user-left" ? (
                                    <span className={styles.userLeft}>{data.username} left the room!</span>
                                ) :
                                <>
                                    <span className={styles.chatUser}>{data.username}</span>: {data.message}
                                </>
                            }
                        </div>
                    ))}
                </ChatComponent>

                <div className={styles.underChatContainer}>
                  <AnimatedComponent
                      frames={7}
                      totalWidth={1428}
                      frameHeight={135}
                      widthPercent={50}
                      heightPercent={95}
                      spriteSheet={buttonSprite}
                      timeout={70}
                      onClick = {() => sendMessage()}
                  />
                    <div className={styles.inputContainer}>
                        <input
                            ref={inputRef}
                            className={styles.chatInput}
                            onChange={(e) => setMsg(e.target.value)}
                            type={"text"} placeholder={"Type an answer..."}>
                        </input>
                    </div>
                </div>

            </div>
            <CornerL className={styles.cornerLeft}></CornerL>
            <CornerR className={styles.cornerRight}></CornerR>
        </div>
    )
}

export default CharadesPage;