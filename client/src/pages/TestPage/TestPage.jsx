import {useEffect, useState} from "react";
import styles from './TestPage.module.css';
import {useSocket} from "../../context/SocketContext";
const TestPage = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        socket.on("echo", message => {
            setMessages((prevMessages) => [...prevMessages, {"sender": message.sender, "data": message.data}]);
        })
    }, [])

    return(
        <div className={styles.testContainer}>
            <h1>Test Page</h1>
            <input type="text" onChange={(e) => setMessage(e.target.value)} />
            <button onClick={() => socket.emit("message", message)}>Naduś</button>
            <div>
                {messages.map((message, index) => (
                    <h1>{message.sender} : {message.data}</h1>
                ))}
            </div>
        </div>
    )
}

export default TestPage;