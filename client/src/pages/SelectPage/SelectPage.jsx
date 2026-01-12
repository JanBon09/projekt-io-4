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
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        socket.on("room-joined", (data) => {
            navigate(`/charades/${data.roomId}`);
        })

        socket.on("room-not-found", (data) => {
            console.log("Nie znaleziono pokoju")
        })
    })

    function joinRoom(roomId){
        socket.emit("join-room", roomId);
    }



    return(
        <div className={styles.mainContainer}>
            <h1 className={styles.welcomeText}>welcome, <span className={styles.textLarge}>{localStorage.getItem("username")}</span></h1>
            <div className={styles.selectContainer}>
                <h1 className={styles.textLarge}>CREATE A ROOM</h1>
                <div className={styles.buttonContainer}>
                    <GradientButton label="CHARADES" socket={socket} onClick={() => socket.emit("create-room")}></GradientButton>
                    <GradientButton label="GUESS A SONG" onClick={() => console.log("GUESS A SONG")}></GradientButton>
                </div>
            </div>
            <div className={styles.joinContainer}>
                <h1 className={styles.textMedium}>OR JOIN EXISTING GAME...</h1>
                <input
                    onKeyDown={(e) =>{
                    if(e.key === "Enter")
                        joinRoom(roomId);
                    }}
                    type="text"
                    className={styles.inputBox}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter the room code..."/>
            </div>

            <CornerL className={styles.cornerL} />
            <CornerR className={styles.cornerR}/>
        </div>
    )
}

export default SelectPage;