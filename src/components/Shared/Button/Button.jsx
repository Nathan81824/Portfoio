
export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  href,
  download = false,
  className = "",
  disabled = false,
  ...props
}) {

  /* =======================================================
     BUTTON CLASSES
  ======================================================= */

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
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
        <span className="btn-icon">
          <Icon
            size={18}
            strokeWidth={2}
          />
        </span>
      )}
    </>
  );


  /* =======================================================
     LINK BUTTON
  ======================================================= */

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        download={download}
        aria-disabled={disabled}
        {...props}
      >
        {content}
      </a>
    );
  }


  /* =======================================================
     NORMAL BUTTON
  ======================================================= */

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}