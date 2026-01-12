import styles from './BackArrow.module.css'
import backArrow from "../../assets/png/back-arrow.png"
import {useNavigate} from "react-router-dom";
import {useSocket} from "../../context/SocketContext";
function BackArrow(props){
    const navigation = useNavigate();
    const socket = useSocket();
    return (
        <button className={styles.backArrow} onClick={() => {
            socket.emit("leave-room", props.roomId)
            navigation("/select")
        }}>
            <img className={styles.arrowImage} src={backArrow} alt="go-back">
            </img>
        </button>
    )
}

export default BackArrow;