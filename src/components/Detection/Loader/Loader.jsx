import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAnimationStore from "../../../store/animationStore";
import portfolioCheck from "../../../javascript/utils/portfolioCheck";

function Loader({ children }) {
const screenRef = useRef(null);
const progressRef = useRef(null);
const navigate = useNavigate();

const isLoading = useAnimationStore(
(state) => state.isLoading
);

const progress = useAnimationStore(
(state) => state.progress
);

const setProgress = useAnimationStore(
(state) => state.setProgress
);

const finishLoading = useAnimationStore(
(state) => state.finishLoading
);

useEffect(() => {
let cancelled = false;


const screen = screenRef.current;

if (!screen) {
  return;
}

const ctx = gsap.context(() => {
  gsap.from(".loading-logo", {
    opacity: 0,
    y: 25,
    scale: 0.85,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from(".loading-message", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.2,
    ease: "power3.out",
  });

  gsap.from(".loading-progress-wrapper", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.3,
    ease: "power3.out",
  });

  gsap.from(".loading-status", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    delay: 0.4,
    ease: "power3.out",
  });

  gsap.to(".loading-glow-one", {
    x: 50,
    y: -30,
    scale: 1.08,
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".loading-glow-two", {
    x: -45,
    y: 35,
    scale: 1.08,
    duration: 7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".loading-logo", {
    y: -4,
    scale: 1.02,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}, screen);

const runChecks = async () => {
  try {
    setProgress(5);

    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "5%",
        duration: 0.3,
      });
    }

    const checkResult = await portfolioCheck();

    if (cancelled) {
      return;
    }

    const totalChecks = checkResult.results.length;

    let completedChecks = 0;

    for (const result of checkResult.results) {
      if (cancelled) {
        return;
      }

      completedChecks += 1;

      const calculatedProgress = Math.round(
        (completedChecks / totalChecks) * 100
      );

      setProgress(calculatedProgress);

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          width: `${calculatedProgress}%`,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      await new Promise((resolve) =>
        window.setTimeout(resolve, 120)
      );
    }

    if (cancelled) {
      return;
    }

    if (!checkResult.success) {
      console.error(
        "Portfolio startup check failed:",
        checkResult.failedChecks
      );

      setProgress(100);

      window.setTimeout(() => {
        if (!cancelled) {
          navigate("/server-error", {
            replace: true,
            state: {
              errors: checkResult.failedChecks,
            },
          });
        }
      }, 500);

      return;
    }

    setProgress(100);

    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "100%",
        duration: 0.4,
        ease: "power2.out",
      });
    }

    window.setTimeout(() => {
      if (!cancelled) {
        finishLoading();
      }
    }, 500);
  } catch (error) {
    console.error(
      "Unexpected portfolio startup error:",
      error
    );

    if (!cancelled) {
      navigate("/server-error", {
        replace: true,
        state: {
          errors: [
            {
              type: "startup",
              success: false,
              error:
                error?.message ||
                "An unexpected startup error occurred.",
            },
          ],
        },
      });
    }
  }
};

runChecks();

return () => {
  cancelled = true;
  ctx.revert();
};


}, [navigate, setProgress, finishLoading]);

if (!isLoading) {
return children;
}

return ( <main
   ref={screenRef}
   className="loading-screen"
   aria-label="Loading portfolio"
   aria-live="polite"
 > <div
     className="loading-glow loading-glow-one"
     aria-hidden="true"
   />


  <div
    className="loading-glow loading-glow-two"
    aria-hidden="true"
  />

  <div className="loading-content">
    <div className="loading-logo">
      <div className="loading-logo-circle">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Nathan logo"
          className="loading-logo-image"
        />
      </div>
    </div>

    <p className="loading-message">
      Preparing your experience...
    </p>

    <div className="loading-progress-wrapper">
      <div
        className="loading-progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
        aria-label="Portfolio loading progress"
      >
        <div
          ref={progressRef}
          className="loading-progress"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <span className="loading-percentage">
        {progress}%
      </span>
    </div>

    <span className="loading-status">
      Checking portfolio services
    </span>
  </div>
</main>

);
}

export default Loader;
