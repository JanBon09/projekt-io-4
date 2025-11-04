import {ReactComponent as Flask} from "../../assets/svg/flask.svg";
import {ReactComponent as Bubble} from "../../assets/svg/bubble-lg.svg";
import {ReactComponent as CornerL} from "../../assets/svg/corner-left.svg";
import {ReactComponent as CornerR} from "../../assets/svg/corner-right.svg";
import styles from "./LoginPage.module.css"
import {useSocket} from "../../context/SocketContext";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const socket = useSocket();
    const [username, setUsername] = useState("");

    const sendNickname = () => {
        socket.emit("create-nickname", username);
        navigate("/select", {state: {username}});
    }

    return(
        <div className={styles.mainContainer}>
            <div className={styles.logoContainer}>
                <Flask className={styles.flask}></Flask>
                <Bubble className={styles.bubbleS}></Bubble>
                <Bubble className={styles.bubbleM}></Bubble>
                <Bubble className={styles.bubbleL}></Bubble>
                <div className={styles.logoTextContainer}>
                    <h1>project.io</h1>
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input className={styles.inputName} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="enter your username"/>
                <button className={styles.inputButton} onClick={sendNickname}>Play!</button>
            </div>
            <CornerL className={styles.cornerLeft}></CornerL>
            <CornerR className={styles.cornerRight}></CornerR>
        </div>
    )
}

export default LoginPage;