import {ReactComponent as CornerL} from '../../assets/svg/corner-left.svg'
import {ReactComponent as CornerR} from '../../assets/svg/corner-right.svg'
import styles from "./SelectPage.module.css"
import GradientButton from "../../components/GradientButton/GradientButton";
import {useLocation, useNavigate} from "react-router-dom";

function SelectPage() {
    const location = useLocation();
    const navigate = useNavigate();
    return(
        <div className={styles.mainContainer}>
            <h1 className={styles.welcomeText}>welcome, <span className={styles.textLarge}>{location.state.username}</span></h1>
            <div className={styles.selectContainer}>
                <h1 className={styles.textLarge}>CREATE A ROOM</h1>
                <div className={styles.buttonContainer}>
                    <GradientButton label="CHARADES" onClick={() => navigate("/charades")}></GradientButton>
                    <GradientButton label="GUESS A SONG" onClick={() => console.log("GUESS A SONG")}></GradientButton>
                </div>
            </div>
            <div className={styles.joinContainer}>
                <h1 className={styles.textMedium}>OR JOIN EXISTING GAME...</h1>
                <input type="text" className={styles.inputBox} placeholder="Enter the room code..."/>
            </div>

            <CornerL className={styles.cornerL} />
            <CornerR className={styles.cornerR}/>
        </div>
    )
}

export default SelectPage;