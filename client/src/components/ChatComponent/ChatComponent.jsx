import {useEffect, useRef} from "react";
import styles from "./ChatComponent.module.css";

function ChatComponent({children}){
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const outerHeight = outerRef.current.clientHeight;
        const innerHeight = innerRef.current.clientHeight;

        outerRef.current.scrollTo({top: innerHeight - outerHeight, left:0});
    }, [])

    useEffect(() => {
        const outerHeight = outerRef.current.clientHeight;
        const innerHeight = innerRef.current.clientHeight;

        outerRef.current.scrollTo({
            top: innerHeight - outerHeight,
            left: 0,
            behavior: "smooth"
        });
    }, [children]);

    return (
        <div
            ref={outerRef}
            className={styles.myScroll}
            style={{
                position: "relative",
                height: "80%",
                width: "80%",
                overflow: "scroll",
                backgroundColor: "#201D1D",
                overflowX: "hidden",
                zIndex: 1,
            }}
        >
            <div
                ref={innerRef}
                style={{
                    position: "relative"
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default ChatComponent