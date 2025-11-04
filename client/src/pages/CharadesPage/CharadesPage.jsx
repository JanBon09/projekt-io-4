import styles from './CharadesPage.module.css'
import {useEffect, useRef, useState} from "react";
import {useSocket} from "../../context/SocketContext";
import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import BackArrow from "../../components/BackArrow/BackArrow";
import ColorBucket from "../../components/ColorBucket/ColorBucket";
import AnimatedComponent from "../../components/AnimatedComponent/AnimatedComponent";
import buttonSprite from '../../assets/png/send-button-sheet.png';


function CharadesPage() {
    const canvasRef = useRef(null)
    const socket = useSocket();
    const [lastPos, setLastPos] = useState([0,0])
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#000000");



    const drawUser = (data) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(data["x1"], data["y1"]);
        ctx.lineTo(data["x2"], data["y2"]);
        ctx.stroke();
    }

    useEffect(() => {
        socket.on("drawing", (data) => {
          drawUser(data)
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
            ctx.lineWidth = 10;
            ctx.strokeStyle = color;

            const x1 = lastPos[0] || x2;
            const y1 = lastPos[1] || y2;

        if(isDrawing) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            socket.emit('draw', {"x1": x1, "y1": y1, "x2": x2, "y2": y2});
        }
            setLastPos([x2,y2])

    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.upLeftContainer}>
                    <BackArrow></BackArrow>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.scoreboard}>

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

                </div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.chatContainer}>
                </div>
                <div className={styles.underChatContainer}>
                  <AnimatedComponent
                      frames={7}
                      totalWidth={1428}
                      frameHeight={135}
                      widthPercent={50}
                      heightPercent={95}
                      spriteSheet={buttonSprite}
                      timeout={70}/>

                    <div className={styles.inputContainer}>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default CharadesPage;