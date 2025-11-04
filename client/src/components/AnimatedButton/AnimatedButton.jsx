import { useState } from 'react';
import spriteSheet from '../../assets/png/start-button-sheet-new.png';

function AnimatedButton({ onClick }) {
    const [frame, setFrame] = useState(0);
    const totalFrames = 8;
    const frameWidth = 1600/totalFrames;

    const handleClick = () => {
        let currentFrame = 0;
        const interval = setInterval(() => {
            currentFrame++;
            setFrame(currentFrame);

            if (currentFrame >= totalFrames - 1) {
                clearInterval(interval);
                setFrame(0);
                onClick?.();
            }
        }, 40);
    };

    return (
        <button
            onClick={handleClick}
            style={{
                width: `${frameWidth}px`,
                height: '80px',
                background: `url(${spriteSheet})`,
                backgroundPosition: `-${frame * frameWidth}px 0`,
                backgroundSize: `${frameWidth * totalFrames}px 80px`,
                imageRendering: 'pixelated',
                border: 'none',
                cursor: 'pointer'
            }}
        />
    );
}

export default AnimatedButton; {}