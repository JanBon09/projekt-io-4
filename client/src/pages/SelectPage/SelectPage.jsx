import {ReactComponent as CornerL} from '../../assets/svg/corner-left.svg'
import {ReactComponent as CornerR} from '../../assets/svg/corner-right.svg'
import styles from "./SelectPage.module.css"
import GradientButton from "../../components/GradientButton/GradientButton";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSocket} from "../../context/SocketContext";

function SelectPage() {
    const navigate = useNavigate();
    const socket = useSocket();
    const [roomId, setRoomId] = useState("");


    useEffect(() => {
        socket.on("room-joined", (data) => {
            if (data.gameType === 'music') {
                navigate(`/guess-song/${data.roomId}`);
            } else {
                navigate(`/charades/${data.roomId}`);
            }
        })

        const handleRoomNotFound = (data) => {
            console.log("Nie znaleziono pokoju");
        };

        socket.on("room-not-found", handleRoomNotFound);

        return () => {
            socket.off("room-joined");
            socket.off("room-not-found", handleRoomNotFound);
        };
    }, [socket, navigate]);

    function joinRoom(id){
        if(id) socket.emit("join-room", id);
    }

    return(
        <div className={styles.mainContainer}>
            <h1 className={styles.welcomeText}>welcome, <span className={styles.textLarge}>{localStorage.getItem("username")}</span></h1>
            
            <div className={styles.selectContainer}>
                <h1 className={styles.textLarge}>CREATE A ROOM</h1>
                <div className={styles.buttonContainer}>
                    <GradientButton label="CHARADES" socket={socket} onClick={() => socket.emit("create-room", {gameType: 'charades'})}></GradientButton>
                    <GradientButton label="GUESS A SONG" socket={socket} onClick={() => socket.emit("create-room", {gameType: 'music'})}></GradientButton>
                </div>
            </div>

            <div className={styles.joinContainer}>
                <h1 className={styles.textMedium}>OR JOIN EXISTING GAME...</h1>
                
                <input
                    onKeyDown={(e) =>{
                        if(e.key === "Enter") joinRoom(roomId);
                    }}
                    type="text"
                    className={styles.inputBox}
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId}
                    placeholder="Enter the room code..."
                />

                <div style={{ marginTop: '20px' }}>
                    <GradientButton 
                        label="JOIN" 
                        onClick={() => joinRoom(roomId)} 
                        style={{ width: "25vh", height: "auto", minHeight: "50px" }}
                    />
                </div>
            </div>

            <CornerL className={styles.cornerL} />
            <CornerR className={styles.cornerR}/>
        </div>
    )
}

export default SelectPage;
