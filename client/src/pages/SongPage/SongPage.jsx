import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import BackArrow from "../../components/BackArrow/BackArrow";
import ChatComponent from "../../components/ChatComponent/ChatComponent";
import AnimatedComponent from "../../components/AnimatedComponent/AnimatedComponent";
import buttonSprite from "../../assets/png/send-button-sheet.png";
import { ReactComponent as CornerL } from "../../assets/svg/corner-left.svg";
import { ReactComponent as CornerR } from "../../assets/svg/corner-right.svg";
import { useParams } from "react-router-dom";
import styles from "./SongPage.module.css";

function GuessSongPage() {
  const { id } = useParams();
  const inputRef = useRef(null);
  const socket = useSocket();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const [gameActive, setGameActive] = useState(false);
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [players, setPlayers] = useState([]);

  const [hintWord, setHintWord] = useState("");
  const [clueText, setClueText] = useState("");
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(0.2);

  // Stany animacji
  const [showReveal, setShowReveal] = useState(false);
  const [summary, setSummary] = useState({
    title: "",
    cover: "",
    artist: "",
    album: "",
    year: "",
    roundWinners: [],
  });

  const isOwner = players.find((p) => p.id === socket?.id)?.isOwner || false;
  const audioRef = useRef(new Audio());

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (!socket) return;

    socket.emit("sync-game", id);

    socket.on("echo", (data) => {
      setMessages((prev) => [
        ...prev,
        { username: data["sender"], message: data["message"], type: "normal" },
      ]);
    });
    socket.on("player-joined", (data) => {
      setMessages((prev) => [
        ...prev,
        { username: data.nickname, type: "user-join" },
      ]);
      socket.emit("sync-game", id);
    });
    socket.on("player-left", (data) => {
      setMessages((prev) => [
        ...prev,
        { username: data.nickname, type: "user-left" },
      ]);
    });

    socket.on("new-round", (data) => {
      setShowReveal(false);
      setClueText("");
      setHintWord("");
      setGameActive(true);
      setRound(data.round);
      setMaxRounds(data.maxRounds);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const songUrl = data.songUrl;
      if (songUrl) {
        audioRef.current.src = songUrl;
        audioRef.current.load();
        audioRef.current.play().catch((e) => {
          console.warn("Autoplay blocked");
        });
      }

      setTimeLeft(data.timeLeft || 30);
      setHintWord(data.hint || "");
      setClueText(data.clue || "");

      setMessages((prev) => [
        ...prev,
        {
          username: "SYSTEM",
          message: `Runda ${data.round} / ${data.maxRounds}!`,
          type: "system",
        },
      ]);
    });

    socket.on("update-players", (playerList) => setPlayers(playerList));
    socket.on("timer-update", (data) => setTimeLeft(data.timeLeft));

    socket.on("time-up", (data) => {
      if (audioRef.current) audioRef.current.pause();

      setSummary({
        title: data.answer,
        cover: data.cover,
        artist: data.artist,
        album: data.album,
        year: data.year,
        roundWinners: data.roundWinners || [],
      });

      setShowReveal(true);
      setMessages((prev) => [
        ...prev,
        { username: "SYSTEM", message: data["message"], type: "system" },
      ]);
    });

    socket.on("correct-answer", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          username: "SUKCES",
          message: `${data.winner} zgadł! (+${data.pointsAdded} pkt)`,
          type: "system",
        },
      ]);
    });

    socket.on("game-over", (data) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setGameActive(false);
      setMessages((prev) => [
        ...prev,
        { username: "SYSTEM", message: data.message, type: "system" },
      ]);
    });

    return () => {
      socket.off("new-round");
      socket.off("correct-answer");
      socket.off("timer-update");
      socket.off("game-over");
      socket.off("echo");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("update-players");
      socket.off("time-up");
    };
  }, [socket, id]);

  const sendMessage = () => {
    if (!msg) return;
    socket.emit("message", { message: msg, roomId: id });
    setMsg("");
    inputRef.current.value = "";
  };

  const startGame = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
        })
        .catch(() => {});
    }
    setStarted(true);
    socket.emit("start-game", id);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.upLeftContainer}>
          <BackArrow
            roomId={id}
            callback={started ? pauseSong : null}></BackArrow>
          <div className={styles.volumeContainer}>
            <span className={styles.volumeIcon}>
              {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </span>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
            />
            <span className={styles.volumePercent}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <div className={styles.scoreboardContainer}>
            <h3 className={styles.scoreTitle}>Wyniki</h3>
            <ul className={styles.playerList}>
              {players.map((p) => (
                <li key={p.id} className={styles.playerItem}>
                  <span className={styles.playerName}>
                    {p.isOwner && "👑"} {p.nickname}
                  </span>
                  <span className={styles.playerPoints}>{p.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.middleContainer}>
        <div className={styles.gameInfoBar}>
          {!gameActive ? (
            <div className={styles.lobbyInfo}>
              <h2>Pokój: {id}</h2>
              {isOwner ? (
                <button className={styles.startBtn} onClick={startGame}>
                  START
                </button>
              ) : (
                <span style={{ color: "#aaa", fontStyle: "italic" }}>
                  Czekanie na właściciela...
                </span>
              )}
            </div>
          ) : (
            <div className={styles.activeGameInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Runda</span>
                <span className={styles.value}>
                  {round}/{maxRounds}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Czas</span>
                <span
                  className={`${styles.timerValue} ${timeLeft < 10 ? styles.timerRed : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tytuł</span>
                <span
                  className={styles.secretWord}
                  style={{ letterSpacing: "3px", whiteSpace: "pre-wrap" }}>
                  {hintWord}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mainCanvas}>
          {showReveal ? (
            <div className={styles.revealContainer}>
              {/* --- LEWA STRONA: LISTA ZWYCIĘZCÓW --- */}
              <div className={styles.revealLeft}>
                <h3 className={styles.winnersTitle}>Najszybsi:</h3>
                <ul className={styles.winnersList}>
                  {summary.roundWinners.length > 0 ? (
                    summary.roundWinners.map((winner, index) => (
                      <li
                        key={index}
                        className={styles.winnerItem}
                        style={{ animationDelay: `${index * 0.1}s` }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className={styles.winnerRank}>
                            {index === 0
                              ? "🥇"
                              : index === 1
                                ? "🥈"
                                : index === 2
                                  ? "🥉"
                                  : `${index + 1}.`}
                          </span>
                          <span className={styles.winnerName}>
                            {winner.nickname}
                          </span>
                        </div>
                        <span className={styles.winnerPoints}>
                          +{winner.points}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noWinners}>Nikt nie zgadł...</li>
                  )}
                </ul>
              </div>

              {/* --- PRAWA STRONA: ALBUM INFO --- */}
              <div className={styles.revealRight}>
                {summary.cover && (
                  <img
                    src={summary.cover}
                    alt='Album Art'
                    className={styles.revealImage}
                  />
                )}
                <h2 className={styles.revealTitle}>{summary.title}</h2>
                <h3 className={styles.revealArtist}>{summary.artist}</h3>
                <div className={styles.revealMeta}>
                  <span className={styles.revealAlbum}>{summary.album}</span>
                  {summary.album && summary.year && (
                    <span className={styles.separator}>•</span>
                  )}
                  <span className={styles.revealYear}>{summary.year}</span>
                </div>
              </div>
            </div>
          ) : gameActive ? (
            <div className={styles.clueText}>"{clueText}"</div>
          ) : (
            <div style={{ color: "#555" }}>
              Tu pojawi się fragment piosenki...
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightContainer}>
        <ChatComponent className={styles.chatContainer}>
          {messages.map((data, index) => (
            <div key={index} className={styles.message}>
              {data.type === "user-join" ? (
                <span className={styles.userJoin}>
                  {data.username} dołączył!
                </span>
              ) : data.type === "user-left" ? (
                <span className={styles.userLeft}>
                  {data.username} wyszedł!
                </span>
              ) : data.type === "system" ? (
                <span style={{ color: "#FFD700", fontWeight: "bold" }}>
                  {data.message}
                </span>
              ) : (
                <>
                  <span className={styles.chatUser}>{data.username}</span>:
                  {data.message}
                </>
              )}
            </div>
          ))}
        </ChatComponent>
        <div className={styles.underChatContainer}>
          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              className={styles.chatInput}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type={"text"}
              placeholder={"Zgaduj..."}></input>
          </div>
          <AnimatedComponent
            frames={7}
            totalWidth={1428}
            frameHeight={135}
            widthPercent={50}
            heightPercent={95}
            spriteSheet={buttonSprite}
            timeout={70}
            onClick={() => sendMessage()}
          />
        </div>
      </div>

      <CornerL className={styles.cornerLeft}></CornerL>
      <CornerR className={styles.cornerRight}></CornerR>
    </div>
  );
}

export default GuessSongPage;
