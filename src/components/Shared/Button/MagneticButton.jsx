import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function MagneticButton({
  children,
  strength = 0.25,
  duration = 0.35,

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
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (event) => {
      const rect = button.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;

      gsap.to(button, {
        x: distanceX * strength,
        y: distanceY * strength,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.03,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: duration + 0.1,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);

      gsap.killTweensOf(button);
    };
  }, [strength, duration]);

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    "magnetic-button",
    disabled ? "btn-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="btn-text">{children}</span>

      {Icon && (
        <span className="btn-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2} />
        </span>
      )}
    </>
  );

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    props.onClick?.(event);
  };

  const commonProps = {
    ref: buttonRef,
    className: classes,
    "aria-disabled": disabled ? "true" : undefined,
    onClick: handleClick,
  };

  if (!href) {
    return (
      <button
        {...commonProps}
        type={type}
        disabled={disabled}
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) => key !== "onClick"
          )
        )}
      >
        {content}
      </button>
    );
  }

  if (download) {
    return (
      <a
        {...commonProps}
        href={href}
        download
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) => key !== "onClick"
          )
        )}
      >
        {content}
      </a>
    );
  }

  if (external) {
    return (
      <a
        {...commonProps}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...Object.fromEntries(
          Object.entries(props).filter(
            ([key]) => key !== "onClick"
          )
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      {...commonProps}
      to={href}
      {...Object.fromEntries(
        Object.entries(props).filter(
          ([key]) => key !== "onClick"
        )
      )}
    >
      {content}
    </Link>
  );
}

export default MagneticButton;