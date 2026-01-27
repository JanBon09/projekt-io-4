import styles from './GradientButton.module.css'

function GradientButton(props) {
    return (
        <>
            <button style={props.label === "JOIN" ? { width: "100%" } : {}} className={styles.button} onClick={props.onClick}>{props.label}</button>
        </>
    )
}

export default GradientButton;