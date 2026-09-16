import { useEffect, useRef } from "react";
import gsap from "gsap";

import useAnimationStore from "../../../store/animationStore";

import { portfolioCheck } from "../../../javascript/index.js";


function Loader({ children }) {
  const screenRef = useRef(null);
  const progressRef = useRef(null);

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


    const updateProgress = (value) => {

      if (cancelled) {
        return;
      }


      const safeValue = Math.min(
        100,
        Math.max(0, Math.round(value))
      );


      setProgress(safeValue);


      if (progressRef.current) {

        gsap.to(progressRef.current, {
          width: `${safeValue}%`,
          duration: 0.4,
          ease: "power2.out",
        });

      }

    };


    const wait = (milliseconds) => {
      return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
      });
    };


    const runChecks = async () => {

      try {

        updateProgress(5);


        /*
          Run the portfolio checker.

          The checker is allowed to fail.
          The portfolio will still continue loading.
        */

        let checkResult = null;


        try {

          checkResult = await portfolioCheck();

        } catch (error) {

          console.warn(
            "Portfolio check encountered an issue. Continuing anyway:",
            error
          );

        }


        if (cancelled) {
          return;
        }


        updateProgress(20);

        await wait(200);


        if (cancelled) {
          return;
        }


        updateProgress(40);

        await wait(200);


        if (cancelled) {
          return;
        }


        updateProgress(60);

        await wait(200);


        if (cancelled) {
          return;
        }


        updateProgress(80);

        await wait(200);


        if (cancelled) {
          return;
        }


        /*
          Checker errors are only logged.

          NEVER redirect.
          NEVER navigate to /server-error.
          NEVER stop the portfolio.
        */

        if (
          checkResult &&
          Array.isArray(checkResult.errors) &&
          checkResult.errors.length > 0
        ) {

          console.warn(
            "Some portfolio checks failed, but the portfolio will continue:",
            checkResult.errors
          );

        }


        updateProgress(100);


        if (progressRef.current) {

          gsap.to(progressRef.current, {
            width: "100%",
            duration: 0.5,
            ease: "power2.out",
          });

        }


        window.setTimeout(() => {

          if (!cancelled) {
            finishLoading();
          }

        }, 500);

      } catch (error) {

        /*
          Absolute fallback.

          Even if something unexpected happens,
          the portfolio continues loading.
        */

        console.warn(
          "Unexpected portfolio startup issue. Continuing anyway:",
          error
        );


        if (cancelled) {
          return;
        }


        updateProgress(100);


        if (progressRef.current) {

          gsap.to(progressRef.current, {
            width: "100%",
            duration: 0.5,
            ease: "power2.out",
          });

        }


        window.setTimeout(() => {

          if (!cancelled) {
            finishLoading();
          }

        }, 500);

      }

    };


    runChecks();


    return () => {

      cancelled = true;

      ctx.revert();

    };

  }, [setProgress, finishLoading]);


  if (!isLoading) {
    return children;
  }


  return (
    <main
      ref={screenRef}
      className="loading-screen"
      aria-label="Loading portfolio"
      aria-live="polite"
    >

      <div
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
          Preparing portfolio
        </span>

      </div>

    </main>
  );
}


export default Loader;