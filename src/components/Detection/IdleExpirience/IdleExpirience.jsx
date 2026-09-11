import { useEffect, useRef, useState } from "react";
import {
  Code2,
  MousePointer2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

function IdleExperience() {
  // =====================================================
  // SETTINGS
  // =====================================================

  const IDLE_TIME = 60 * 1000;

  // =====================================================
  // STATE
  // =====================================================

  const [isIdle, setIsIdle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const idleTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  // =====================================================
  // IDLE MESSAGES
  // =====================================================

  const messages = [
    "The portfolio went into sleep mode.",
    "Even websites need a little rest.",
    "Still exploring?",
    "The code is taking a tiny break.",
    "You found the idle experience.",
  ];

  // =====================================================
  // CLEAR TIMERS
  // =====================================================

  const clearTimers = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // =====================================================
  // ENTER IDLE MODE
  // =====================================================

  const enterIdleMode = () => {
    if (isIdle) return;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    const randomIndex = Math.floor(
      Math.random() * messages.length
    );

    setMessageIndex(randomIndex);
    setIsIdle(true);

    window.requestAnimationFrame(() => {
      setIsVisible(true);
    });
  };

  // =====================================================
  // START IDLE TIMER
  // =====================================================

  const startIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      enterIdleMode();
    }, IDLE_TIME);
  };

  // =====================================================
  // WAKE PORTFOLIO
  // =====================================================

  const wakePortfolio = () => {
    if (!isIdle) {
      startIdleTimer();
      return;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    setIsVisible(false);

    hideTimerRef.current = setTimeout(() => {
      setIsIdle(false);
      hideTimerRef.current = null;

      startIdleTimer();
    }, 650);
  };

  // =====================================================
  // ACTIVITY DETECTION
  // =====================================================

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    const handleActivity = () => {
      if (isIdle) {
        wakePortfolio();
        return;
      }

      startIdleTimer();
    };

    events.forEach((event) => {
      window.addEventListener(
        event,
        handleActivity,
        {
          passive: true,
        }
      );
    });

    startIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(
          event,
          handleActivity
        );
      });

      clearTimers();
    };
  }, [isIdle]);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        isIdle
      ) {
        wakePortfolio();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isIdle]);

  // =====================================================
  // DO NOT RENDER UNTIL IDLE
  // =====================================================

  if (!isIdle) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`idle-experience ${
        isVisible
          ? "idle-visible"
          : "idle-hidden"
      }`}
      onMouseMove={wakePortfolio}
      onMouseDown={wakePortfolio}
      onClick={wakePortfolio}
      onTouchStart={wakePortfolio}
      role="dialog"
      aria-label="Portfolio idle experience"
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="idle-background"
        aria-hidden="true"
      >
        <div className="idle-grid" />

        <div className="idle-glow idle-glow-one" />
        <div className="idle-glow idle-glow-two" />
        <div className="idle-glow idle-glow-three" />

        <div className="idle-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* =================================================
          TOP STATUS
      ================================================= */}

      <div className="idle-status">
        <span className="idle-status-dot" />

        <span>
          SYSTEM IDLE
        </span>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="idle-content">

        {/* ICON */}

        <div className="idle-icon-wrapper">
          <div className="idle-icon-ring idle-ring-one" />
          <div className="idle-icon-ring idle-ring-two" />

          <div className="idle-icon">
            <Code2
              size={34}
              strokeWidth={1.6}
            />
          </div>
        </div>

        {/* EYEBROW */}

        <span className="idle-eyebrow">
          <Sparkles
            size={15}
            strokeWidth={1.8}
          />

          Idle Experience
        </span>

        {/* HEADING */}

        <h1>
          The portfolio
          <span>
            is taking a break.
          </span>
        </h1>

        {/* MESSAGE */}

        <p className="idle-message">
          {messages[messageIndex]}
        </p>

        {/* TERMINAL */}

        <div className="idle-terminal">

          <div className="idle-terminal-header">

            <div className="idle-terminal-dots">
              <span />
              <span />
              <span />
            </div>

            <span>
              portfolio.exe
            </span>

            <Terminal
              size={15}
              strokeWidth={1.7}
            />

          </div>

          <div className="idle-terminal-body">

            <p>
              <span className="idle-terminal-symbol">
                $
              </span>

              checking activity...
            </p>

            <p>
              <span className="idle-terminal-success">
                ✓
              </span>

              no activity detected
            </p>

            <p>
              <span className="idle-terminal-symbol">
                $
              </span>

              entering idle mode...
            </p>

            <p className="idle-terminal-cursor">
              _
            </p>

          </div>

        </div>

        {/* =================================================
            WAKE BUTTON
        ================================================= */}

        <button
          type="button"
          className="idle-wake-button"
          onClick={(event) => {
            event.stopPropagation();
            wakePortfolio();
          }}
        >
          <MousePointer2
            size={18}
            strokeWidth={1.8}
          />

          <span>
            Move to wake
          </span>

          <Zap
            size={16}
            strokeWidth={1.8}
          />
        </button>

        {/* =================================================
            HINT
        ================================================= */}

        <p className="idle-hint">
          Move your mouse, scroll, click, or press any key
        </p>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="idle-footer">

        <span>
          NATHAN // PORTFOLIO
        </span>

        <span>
          <span className="idle-footer-line" />
          SYSTEM PAUSED
        </span>

      </div>
    </div>
  );
}

export default IdleExperience;