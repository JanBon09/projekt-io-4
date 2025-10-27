import {ReactComponent as CornerL} from '../../assets/svg/corner-left.svg'
import {ReactComponent as CornerR} from '../../assets/svg/corner-right.svg'
import styles from "./SelectPage.module.css"
import GradientButton from "../../components/GradientButton/GradientButton";

function SelectPage() {
    return(
        <div className={styles.mainContainer}>
            <h1>Ok</h1>
            <GradientButton label="CHARADES" onClick={() => console.log("CHARADES")}></GradientButton>
            <GradientButton label="GUESS A SONG" onClick={() => console.log("GUESS A SONG")}></GradientButton>
            <CornerL className={styles.cornerL} />
            <CornerR className={styles.cornerR}/>
        </div>
    )
}

export default SelectPage;