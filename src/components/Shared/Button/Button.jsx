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
========================================================= */

import {
  Link,
} from "react-router-dom";


/* =========================================================
   BUTTON
========================================================= */

export default function Button({
  children,

  variant = "primary",

  size = "md",

  icon: Icon,

  href,

  download = false,

  external = false,

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
     NO HREF
     → NORMAL BUTTON
  ======================================================= */

  if (!href) {

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
     → NORMAL ANCHOR
  ======================================================= */

  if (download) {

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
        onClick={
          disabled
            ? (event) => {
                event.preventDefault();
              }
            : props.onClick
        }
        {...(
          disabled
            ? Object.fromEntries(
                Object.entries(props)
                  .filter(
                    ([key]) =>
                      key !== "onClick"
                  )
              )
            : props
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
        onClick={
          disabled
            ? (event) => {
                event.preventDefault();
              }
            : props.onClick
        }
        {...(
          disabled
            ? Object.fromEntries(
                Object.entries(props)
                  .filter(
                    ([key]) =>
                      key !== "onClick"
                  )
              )
            : props
        )}
      >

        {content}

      </a>

    );

  }


  /* =======================================================
     INTERNAL ROUTE
     → REACT ROUTER LINK
  ======================================================= */

  return (

    <Link
      to={href}
      className={classes}
      aria-disabled={
        disabled
          ? "true"
          : undefined
      }
      onClick={
        disabled
          ? (event) => {
              event.preventDefault();
            }
          : props.onClick
      }
      {...(
        disabled
          ? Object.fromEntries(
              Object.entries(props)
                .filter(
                  ([key]) =>
                    key !== "onClick"
                )
            )
          : props
      )}
    >

      {content}

    </Link>

  );

}