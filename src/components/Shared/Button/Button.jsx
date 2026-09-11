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
    disabled ? "btn-disabled" : "",
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
     MAGNETIC WRAPPER
     Only used when magnetic={true}
  ======================================================= */

  const renderMagnetic = ({
    children: magneticChildren,
    ...elementProps
  }) => (
    <MagneticButton
      {...magneticProps}
      {...elementProps}
    >
      {magneticChildren}
    </MagneticButton>
  );


  /* =======================================================
     NORMAL BUTTON
  ======================================================= */

  if (!href) {

    const buttonProps = {
      type,
      className: classes,
      disabled,
      ...props,
    };


    if (magnetic) {
      return renderMagnetic({
        ...buttonProps,
        disabled,
        type,
      });
    }


    return (
      <button
        {...buttonProps}
      >
        {content}
      </button>
    );
  }


  /* =======================================================
     DOWNLOAD
  ======================================================= */

  if (download) {

    const handleClick = (event) => {

      if (disabled) {
        event.preventDefault();
      }

      props.onClick?.(event);
    };


    const anchorProps = {
      as: "a",
      href,
      className: classes,
      download,
      "aria-disabled": disabled
        ? "true"
        : undefined,
      onClick: handleClick,
      ...Object.fromEntries(
        Object.entries(props).filter(
          ([key]) => key !== "onClick"
        )
      ),
    };


    if (magnetic) {
      return renderMagnetic(anchorProps);
    }


    return (
      <a
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
      </a>
    );
  }


  /* =======================================================
     EXTERNAL LINK
  ======================================================= */

  if (external) {

    const handleClick = (event) => {

      if (disabled) {
        event.preventDefault();
      }

      props.onClick?.(event);
    };


    const externalProps = {
      as: "a",
      href,
      className: classes,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-disabled": disabled
        ? "true"
        : undefined,
      onClick: handleClick,
      ...Object.fromEntries(
        Object.entries(props).filter(
          ([key]) => key !== "onClick"
        )
      ),
    };


    if (magnetic) {
      return renderMagnetic(externalProps);
    }


    return (
      <a
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
      </a>
    );
  }


  /* =======================================================
     INTERNAL ROUTE
     REACT ROUTER LINK
  ======================================================= */

  const handleLinkClick = (event) => {

    if (disabled) {
      event.preventDefault();
    }

    props.onClick?.(event);
  };


  const linkProps = {
    as: Link,
    to: href,
    className: classes,
    "aria-disabled": disabled
      ? "true"
      : undefined,
    onClick: handleLinkClick,
    ...Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          key !== "onClick"
      )
    ),
  };


  if (magnetic) {
    return renderMagnetic(linkProps);
  }


  return (
    <Link
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
    </Link>
  );
}


/* =========================================================
   EXPORTS
========================================================= */

export {
  MagneticButton,
};

export default Button;