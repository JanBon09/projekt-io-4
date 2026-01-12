import { useState } from 'react';

function AnimatedComponent(props) {
    const [frame, setFrame] = useState(0);
    const totalFrames = props.frames;
    const frameWidth = props.totalWidth/totalFrames;
    const aspectRatio = props.frameHeight / frameWidth;
    const handleClick = () => {
        props.onClick?.();
        let currentFrame = 0;
        const interval = setInterval(() => {
            currentFrame++;
            setFrame(currentFrame);

            if (currentFrame >= totalFrames - 1) {
                clearInterval(interval);
                setFrame(0);
            }
        }, props.timeout);
    };

    return (
        <button
            onClick={handleClick}
            style={{
                width: `${props.widthPercent}%`,
                height: `${props.heightPercent}%`,
                aspectRatio: `${1/aspectRatio}`,
                background: `url(${props.spriteSheet})`,
                backgroundPosition: `${(frame / (totalFrames - 1)) * -100}% 0`,
                backgroundSize: `${totalFrames * 100}% 100%`,
                imageRendering: "pixelated",
                border: "none",
                cursor: "pointer",
            }}
        />
    );
}

export default AnimatedComponent;