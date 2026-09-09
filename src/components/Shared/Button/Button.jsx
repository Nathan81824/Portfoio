/* =========================================================
   BUTTON
   Nathan — Frontend Developer Portfolio

   Reusable button component.

   Supports:
   - Primary / secondary / ghost variants
   - Small / medium / large sizes
   - Optional Lucide/icon component
   - Normal buttons
   - Internal React Router links
   - External links
   - Downloads
   - Disabled state
   - Optional magnetic effect
========================================================= */

import {
  Link,
} from "react-router-dom";

import MagneticButton from "./MagneticButton.jsx";


/* =========================================================
   BUTTON
========================================================= */

function Button({
  children,

  variant = "primary",

  size = "md",

  icon: Icon,

  href,

  download = false,

  external = false,

  magnetic = false,

  magneticStrength = 0.25,

  magneticDuration = 0.35,

  className = "",

  disabled = false,

  type = "button",

  ...props
}) {

  /* =======================================================
     BUTTON CLASSES
  ======================================================= */

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    disabled
      ? "btn-disabled"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");


  /* =======================================================
     BUTTON CONTENT
  ======================================================= */

  const content = (
    <>
      <span className="btn-text">
        {children}
      </span>

      {Icon && (
        <span
          className="btn-icon"
          aria-hidden="true"
        >
          <Icon
            size={18}
            strokeWidth={2}
          />
        </span>
      )}
    </>
  );


  /* =======================================================
     MAGNETIC PROPS
  ======================================================= */

  const magneticProps = {
    strength: magneticStrength,
    duration: magneticDuration,
  };


  /* =======================================================
     NORMAL BUTTON
  ======================================================= */

  if (!href) {

    if (magnetic) {
      return (
        <MagneticButton
          {...magneticProps}
          className={classes}
          disabled={disabled}
          type={type}
          {...props}
        >
          {content}
        </MagneticButton>
      );
    }

    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {content}
      </button>
    );
  }


  /* =======================================================
     DOWNLOAD
     → ANCHOR
  ======================================================= */

  if (download) {

    const handleClick = (event) => {
      if (disabled) {
        event.preventDefault();
      }

      props.onClick?.(event);
    };


    return (
      <MagneticButton
        {...magneticProps}
        as="a"
        href={href}
        className={classes}
        download
        aria-disabled={
          disabled
            ? "true"
            : undefined
        }
        onClick={handleClick}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) =>
              key !== "onClick"
          )
        )}
      >
        {content}
      </MagneticButton>
    );
  }


  /* =======================================================
     EXTERNAL LINK
     → ANCHOR
  ======================================================= */

  if (external) {

    const handleClick = (event) => {
      if (disabled) {
        event.preventDefault();
      }

      props.onClick?.(event);
    };


    return (
      <MagneticButton
        {...magneticProps}
        as="a"
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={
          disabled
            ? "true"
            : undefined
        }
        onClick={handleClick}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) =>
              key !== "onClick"
          )
        )}
      >
        {content}
      </MagneticButton>
    );
  }


  /* =======================================================
     INTERNAL ROUTE
     → REACT ROUTER LINK
  ======================================================= */

  const handleLinkClick = (event) => {
    if (disabled) {
      event.preventDefault();
    }

    props.onClick?.(event);
  };


  return (
    <MagneticButton
      {...magneticProps}
      as={Link}
      to={href}
      className={classes}
      aria-disabled={
        disabled
          ? "true"
          : undefined
      }
      onClick={handleLinkClick}
      {...Object.fromEntries(
        Object.entries(props).filter(
          ([key]) =>
            key !== "onClick"
        )
      )}
    >
      {content}
    </MagneticButton>
  );
}


/* =========================================================
   EXPORTS
========================================================= */

export {
  MagneticButton,
};

export default Button;