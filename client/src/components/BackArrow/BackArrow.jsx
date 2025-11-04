import styles from './BackArrow.module.css'
import backArrow from "../../assets/png/back-arrow.png"
import {useNavigate} from "react-router-dom";
function BackArrow(){
    const navigation = useNavigate();
    return (
        <button className={styles.backArrow} onClick={() => navigation(-1)}>
            <img className={styles.arrowImage} src={backArrow} alt="go-back">
            </img>
        </button>
    )
}

export default BackArrow;