import {
Code2,
Sparkles,
Smartphone,
Gauge,
} from "lucide-react";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function WhatIDo({ data }) {
const sectionRef = useRef(null);

const services = [
{
number: "01",
icon: Code2,
title: "Frontend Development",
description:
"Building responsive and reusable interfaces with modern frontend technologies.",
},
{
number: "02",
icon: Sparkles,
title: "Interactive Experiences",
description:
"Creating smooth interactions and animations that make digital experiences feel alive.",
},
{
number: "03",
icon: Smartphone,
title: "Responsive Design",
description:
"Designing interfaces that adapt beautifully across desktop, tablet and mobile devices.",
},
{
number: "04",
icon: Gauge,
title: "Performance & UX",
description:
"Keeping interfaces fast, intuitive and enjoyable while maintaining a clean user experience.",
},
];

useLayoutEffect(() => {
const section = sectionRef.current;


if (!section) return;

const ctx = gsap.context(() => {

  /* =====================================================
     HEADER
     
     Fade only.
     
     It does NOT move up anymore.

     Scroll down → fade in
     Scroll up → fade out
     Scroll down again → fade in
  ===================================================== */

  const header = section.querySelector(
    ".what-i-do-header"
  );

  if (header) {
    gsap.fromTo(
      header,
      {
        opacity: 0,
      },
      {
        opacity: 1,

        duration: 1.2,

        ease: "power2.out",

        scrollTrigger: {
          trigger: header,

          start: "top 88%",
          end: "bottom 15%",

          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  }

  /* =====================================================
     CARDS
     
     Card 1 → LEFT
     Card 2 → RIGHT
     Card 3 → LEFT
     Card 4 → RIGHT

     Every card has its own ScrollTrigger.
     
     They do NOT animate together.
  ===================================================== */

  const cards =
    section.querySelectorAll(
      ".what-i-do-card"
    );

  cards.forEach((card, index) => {
    const fromLeft =
      index % 2 === 0;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: fromLeft
          ? -120
          : 120,
      },
      {
        opacity: 1,
        x: 0,

        duration: 1.1,

        ease: "power3.out",

        scrollTrigger: {
          trigger: card,

          start: "top 88%",
          end: "bottom 15%",

          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  });

  /* =====================================================
     CARD HOVER
  ===================================================== */

  cards.forEach((card) => {
    const icon =
      card.querySelector(
        ".what-i-do-card-icon"
      );

    const arrow =
      card.querySelector(
        ".what-i-do-card-arrow"
      );

    const enter = () => {
      gsap.to(card, {
        y: -8,

        duration: 0.65,

        ease: "power3.out",
      });

      if (icon) {
        gsap.to(icon, {
          rotate: 8,
          scale: 1.08,

          duration: 0.65,

          ease: "power3.out",
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          x: 6,

          duration: 0.65,

          ease: "power3.out",
        });
      }
    };

    const leave = () => {
      gsap.to(card, {
        y: 0,

        duration: 0.65,

        ease: "power3.out",
      });

      if (icon) {
        gsap.to(icon, {
          rotate: 0,
          scale: 1,

          duration: 0.65,

          ease: "power3.out",
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          x: 0,

          duration: 0.65,

          ease: "power3.out",
        });
      }
    };

    card.addEventListener(
      "mouseenter",
      enter
    );

    card.addEventListener(
      "mouseleave",
      leave
    );

    card._whatIDoEnter = enter;
    card._whatIDoLeave = leave;
  });

  /* =====================================================
     BACKGROUND GLOW ONE
  ===================================================== */

  const glowOne =
    section.querySelector(
      ".what-i-do-glow-one"
    );

  if (glowOne) {
    gsap.to(glowOne, {
      x: -80,
      y: 50,
      scale: 1.1,

      duration: 7,

      ease: "sine.inOut",

      repeat: -1,

      yoyo: true,
    });
  }

  /* =====================================================
     BACKGROUND GLOW TWO
  ===================================================== */

  const glowTwo =
    section.querySelector(
      ".what-i-do-glow-two"
    );

  if (glowTwo) {
    gsap.to(glowTwo, {
      x: 80,
      y: -40,
      scale: 1.08,

      duration: 8,

      ease: "sine.inOut",

      repeat: -1,

      yoyo: true,
    });
  }

}, section);

/* =======================================================
   CLEANUP
======================================================= */

return () => {
  const cards =
    section.querySelectorAll(
      ".what-i-do-card"
    );

  cards.forEach((card) => {

    if (card._whatIDoEnter) {
      card.removeEventListener(
        "mouseenter",
        card._whatIDoEnter
      );
    }

    if (card._whatIDoLeave) {
      card.removeEventListener(
        "mouseleave",
        card._whatIDoLeave
      );
    }

  });

  ctx.revert();
};


}, []);

return ( <section
   ref={sectionRef}
   className="what-i-do"
   id="what-i-do"
 >


  {/* ===================================================
      BACKGROUND
  =================================================== */}

  <div
    className="what-i-do-background"
    aria-hidden="true"
  >

    <div className="what-i-do-grid" />

    <div className="what-i-do-glow-one" />

    <div className="what-i-do-glow-two" />

  </div>

  {/* ===================================================
      CONTENT
  =================================================== */}

  <div className="what-i-do-container">

    {/* =================================================
        HEADER
    ================================================= */}

    <div className="what-i-do-header">

      <span className="what-i-do-eyebrow">

        <span className="what-i-do-eyebrow-line" />

        What I Do

      </span>

      <h2>
        Turning ideas into

        <span>
          digital experiences.
        </span>
      </h2>

      <p>
        I build modern interfaces that combine
        clean design, thoughtful interactions and
        solid frontend development.
      </p>

    </div>

    {/* =================================================
        CARDS
    ================================================= */}

    <div className="what-i-do-grid-cards">

      {services.map(
        (service, index) => {

          const Icon =
            service.icon;

          const direction =
            index % 2 === 0
              ? "what-i-do-card-left"
              : "what-i-do-card-right";

          return (
            <article
              key={service.number}
              className={`what-i-do-card ${direction}`}
            >

              {/* CARD TOP */}

              <div className="what-i-do-card-top">

                <span className="what-i-do-number">
                  {service.number}
                </span>

                <div className="what-i-do-card-icon">

                  <Icon
                    size={24}
                    strokeWidth={1.8}
                  />

                </div>

              </div>

              {/* CARD CONTENT */}

              <div className="what-i-do-card-content">

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.description}
                </p>

              </div>

              {/* CARD BOTTOM */}

              <div className="what-i-do-card-bottom">

                <span>
                  Explore
                </span>

                <span className="what-i-do-card-arrow">
                  →
                </span>

              </div>

            </article>
          );
        }
      )}

    </div>

  </div>

</section>


);
}

export default WhatIDo;
