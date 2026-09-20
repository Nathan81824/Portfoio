/* =========================================================
   LAZY IMAGE
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/UI/Media/LazyImage.jsx

   Uses:
   - react-lazy-load-image-component
   - Centralized media
   - Smooth loading animation
   - Blur effect
   - Reduced motion support
========================================================= */


/* =========================================================
   REACT
========================================================= */

import {
  useEffect,
  useState,
} from "react";


/* =========================================================
   LAZY LOAD IMAGE
========================================================= */

import {
  LazyLoadImage,
} from "react-lazy-load-image-component";


/* =========================================================
   CSS
========================================================= */




/* =========================================================
   LAZY IMAGE
========================================================= */

export default function LazyImage({

  src,

  alt,

  className = "",

  wrapperClassName = "",

  threshold = 300,

}) {


  /* =======================================================
     LOADING STATE
  ======================================================= */

  const [
    isLoaded,
    setIsLoaded,
  ] = useState(false);


  /* =======================================================
     RESET WHEN SOURCE CHANGES
  ======================================================= */

  useEffect(() => {

    setIsLoaded(false);

  }, [src]);


  /* =======================================================
     IMAGE LOADED
  ======================================================= */

  const handleLoad = () => {

    setIsLoaded(true);

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className={`
        lazy-image-wrapper
        ${wrapperClassName}
        ${isLoaded ? "is-loaded" : "is-loading"}
      `}
    >


      {/* ===================================================
          LOADING EFFECT
      =================================================== */}

      {!isLoaded && (

        <div
          className="lazy-image-loading"
          aria-hidden="true"
        />

      )}


      {/* ===================================================
          IMAGE
      =================================================== */}

      <LazyLoadImage

        src={src}

        alt={alt}

        threshold={threshold}

        effect="blur"

        afterLoad={handleLoad}

        className={`
          lazy-image
          ${isLoaded ? "loaded" : ""}
          ${className}
        `}

        wrapperClassName="lazy-image-component"

        loading="lazy"

      />


    </div>

  );

}