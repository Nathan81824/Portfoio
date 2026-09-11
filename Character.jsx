import { useState, useEffect, useRef } from "react";

// Example: pressing SPACEBAR changes the character's movement/animation state.
// Swap the div-based character below for your sprite <img>/<canvas> later.
export default function Character() {
  const [state, setState] = useState("idle"); // "idle" | "jump" | "run"
  const [x, setX] = useState(50); // horizontal position for movement demo
  const keysPressed = useRef({});

  useEffect(() => {
    function handleKeyDown(e) {
      keysPressed.current[e.code] = true;

      if (e.code === "Space") {
        e.preventDefault(); // stop page from scrolling
        if (state !== "jump") {
          setState("jump");
          // return to idle/run after the jump animation finishes
          setTimeout(() => {
            setState((prev) => (prev === "jump" ? "idle" : prev));
          }, 500);
        }
      }

      if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        setState((prev) => (prev === "jump" ? prev : "run"));
      }
    }

    function handleKeyUp(e) {
      keysPressed.current[e.code] = false;
      if (
        (e.code === "ArrowRight" || e.code === "ArrowLeft") &&
        state !== "jump"
      ) {
        setState("idle");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state]);

  // simple left/right movement loop while arrow keys are held
  useEffect(() => {
    const interval = setInterval(() => {
      if (keysPressed.current["ArrowRight"]) setX((prev) => prev + 5);
      if (keysPressed.current["ArrowLeft"]) setX((prev) => prev - 5);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", height: 300, background: "#dff" }}>
      <div
        className={`character ${state}`}
        style={{
          position: "absolute",
          left: x,
          bottom: state === "jump" ? 120 : 20,
          width: 40,
          height: 60,
          background: state === "jump" ? "orange" : state === "run" ? "green" : "gray",
          transition: "bottom 0.25s ease, background 0.2s",
        }}
      />
      <p style={{ position: "absolute", bottom: 0 }}>
        State: {state} — press Space to jump, arrows to move
      </p>
    </div>
  );
}
