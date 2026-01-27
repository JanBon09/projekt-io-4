import styles from './GradientButton.module.css'

function GradientButton(props) {
    return (
        <>
            <button className={styles.button} onClick={props.onClick}>{props.label}</button>
        </>
    )
}

export default GradientButton;