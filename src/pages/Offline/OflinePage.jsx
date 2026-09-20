import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import OfflineCharacterVideo from "../../assets/videos/oflline-avatar-viedio.mp4";

export default function OflinePage() {
  const [showButtons, setShowButtons] = useState(false);
  const [gameStarting, setGameStarting] = useState(false);

  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setShowButtons(true);
    }, 1700);

    const video = videoRef.current;

    if (video) {
      video.play().catch((error) => {
        console.warn("Video autoplay blocked:", error);
      });
    }

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";

      if (video) {
        video.pause();
      }
    };
  }, []);

  const handleKeepWaiting = () => {
    setShowButtons(false);

    window.setTimeout(() => {
      setShowButtons(true);
    }, 3000);
  };

  const handlePlayGame = () => {
    if (gameStarting) {
      return;
    }

    setGameStarting(true);

    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    window.setTimeout(() => {
      navigate("/offline-game");
    }, 350);
  };

  return (
    <main className="offline-page">
      <div className="offline-card">
        <div className="offline-video-container">
          <video
            ref={videoRef}
            className="offline-character-video"
            src={OfflineCharacterVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          <div className="offline-video-overlay" />
        </div>

        {showButtons && (
          <div className="offline-actions">
            <button
              type="button"
              onClick={handleKeepWaiting}
              disabled={gameStarting}
            >
              Keep Waiting
            </button>

            <button
              type="button"
              onClick={handlePlayGame}
              disabled={gameStarting}
            >
              {gameStarting ? "Starting Game..." : "Play a Game"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}