import styles from "./ColorBucket.module.css"
import bucketBlack from "../../assets/png/bucket-black.png"
import bucketRed from "../../assets/png/bucket-red.png"
import bucketBlue from "../../assets/png/bucket-blue.png"
import bucketYellow from "../../assets/png/bucket-yellow.png"
import bucketBrown from "../../assets/png/bucket-brown.png"
import bucketGreen from "../../assets/png/bucket-green.png"

function ColorBucket(props) {

    const bucketImages = {
        black: bucketBlack,
        red: bucketRed,
        green: bucketGreen,
        blue: bucketBlue,
        yellow: bucketYellow,
        brown: bucketBrown
    }

    const colors = {
        black: "#000000",
        red: "#ac3232",
        green: "#6abe30",
        blue: "#5b6ee1",
        yellow: "#ffc107",
        brown: "#6F4E37",
    }

    return (
        <button className={styles.bucketButton} onClick={() => props.onClick(colors[props.color])}>
            <img className={styles.bucketImage} src={bucketImages[props.color]} alt={`bucket-${props.color}`} >
            </img>
        </button>
    )
}

export default ColorBucket;