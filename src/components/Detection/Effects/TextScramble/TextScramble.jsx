import { useEffect, useRef, useState } from "react";

function TextScramble({
  text,
  duration = 900,
  characters = "!<>-_\\/[]{}—=+*^?#",
  delay = 0,
  className = "",
  trigger = true,
}) {
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    if (!trigger) {
      setDisplayText(text);
      return;
    }

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime - delay;

      if (elapsed < 0) {
        animationRef.current =
          requestAnimationFrame(animate);

        return;
      }

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const revealedCharacters = Math.floor(
        progress * text.length
      );

      let scrambledText = "";

      for (
        let index = 0;
        index < text.length;
        index++
      ) {
        if (index < revealedCharacters) {
          scrambledText += text[index];
        } else if (text[index] === " ") {
          scrambledText += " ";
        } else {
          const randomIndex = Math.floor(
            Math.random() * characters.length
          );

          scrambledText +=
            characters[randomIndex];
        }
      }

      setDisplayText(scrambledText);

      if (progress < 1) {
        animationRef.current =
          requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [
    text,
    duration,
    characters,
    delay,
    trigger,
  ]);

  return (
    <span
      className={className}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}

export default TextScramble;