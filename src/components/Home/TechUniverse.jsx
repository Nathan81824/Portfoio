import {
Code2,
Sparkles,
Zap,
Globe2,
Database,
Layers3,
} from "lucide-react";

import {
FaReact,
FaJs,
FaHtml5,
FaCss3Alt,
FaGitAlt,
FaGithub,
} from "react-icons/fa";

import {
SiVite,
SiTailwindcss,
SiReactrouter,
} from "react-icons/si";

import {
motion,
useReducedMotion,
} from "framer-motion";


/* =========================================================
TECHNOLOGY DATA
========================================================= */

const technologies = [
{
id: "react",
name: "React",
category: "Frontend",
icon: FaReact,
className: "tech-node-react",
orbit: "orbit-one",
},

{
id: "javascript",
name: "JavaScript",
category: "Language",
icon: FaJs,
className: "tech-node-javascript",
orbit: "orbit-two",
},

{
id: "html",
name: "HTML5",
category: "Structure",
icon: FaHtml5,
className: "tech-node-html",
orbit: "orbit-three",
},

{
id: "css",
name: "CSS3",
category: "Styling",
icon: FaCss3Alt,
className: "tech-node-css",
orbit: "orbit-four",
},

{
id: "tailwind",
name: "Tailwind CSS",
category: "Styling",
icon: SiTailwindcss,
className: "tech-node-tailwind",
orbit: "orbit-five",
},

{
id: "vite",
name: "Vite",
category: "Tooling",
icon: SiVite,
className: "tech-node-vite",
orbit: "orbit-six",
},

{
id: "git",
name: "Git",
category: "Version Control",
icon: FaGitAlt,
className: "tech-node-git",
orbit: "orbit-seven",
},

{
id: "github",
name: "GitHub",
category: "Collaboration",
icon: FaGithub,
className: "tech-node-github",
orbit: "orbit-eight",
},

{
id: "router",
name: "React Router",
category: "Navigation",
icon: SiReactrouter,
className: "tech-node-router",
orbit: "orbit-nine",
},

{
id: "api",
name: "REST APIs",
category: "Integration",
icon: Globe2,
className: "tech-node-api",
orbit: "orbit-ten",
},

{
id: "code",
name: "Clean Code",
category: "Development",
icon: Code2,
className: "tech-node-code",
orbit: "orbit-eleven",
},

{
id: "components",
name: "Components",
category: "Architecture",
icon: Layers3,
className: "tech-node-components",
orbit: "orbit-twelve",
},
];

/* =========================================================
TECH NODE
========================================================= */

function TechNode({
technology,
index,
shouldReduceMotion,
}) {
const Icon = technology.icon;

return (
<motion.div
className={`tech-node ${technology.className}`}
initial={
shouldReduceMotion
? false
: {
opacity: 0,
scale: 0.5,
y: 30,
}
}
whileInView={
shouldReduceMotion
? undefined
: {
opacity: 1,
scale: 1,
y: 0,
}
}
viewport={{
once: true,
amount: 0.2,
}}
transition={{
duration: 0.8,
delay: index * 0.06,
ease: [0.22, 1, 0.36, 1],
}}
whileHover={
shouldReduceMotion
? undefined
: {
scale: 1.12,
y: -6,
zIndex: 20,
}
}
> <div className="tech-node-inner">


    <span className="tech-node-icon">
      <Icon
        size={21}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>

    <span className="tech-node-info">
      <span className="tech-node-name">
        {technology.name}
      </span>

      <span className="tech-node-category">
        {technology.category}
      </span>
    </span>

  </div>
</motion.div>

);
}

/* =========================================================
CONNECTION
========================================================= */

function TechConnection({
className,
shouldReduceMotion,
}) {
return (
<motion.span
className={`tech-connection ${className}`}
initial={
shouldReduceMotion
? false
: {
opacity: 0,
scaleX: 0,
}
}
whileInView={
shouldReduceMotion
? undefined
: {
opacity: 1,
scaleX: 1,
}
}
viewport={{
once: true,
amount: 0.2,
}}
transition={{
duration: 1.1,
ease: [0.22, 1, 0.36, 1],
}}
aria-hidden="true"
/>
);
}

/* =========================================================
FLOATING PARTICLE
========================================================= */

function Particle({
className,
delay,
duration,
shouldReduceMotion,
}) {
return (
<motion.span
className={`tech-particle ${className}`}
animate={
shouldReduceMotion
? undefined
: {
opacity: [0.15, 0.7, 0.15],
scale: [0.8, 1.2, 0.8],
y: [0, -18, 0],
}
}
transition={{
duration,
delay,
repeat: Infinity,
ease: "easeInOut",
}}
aria-hidden="true"
/>
);
}

/* =========================================================
TECH UNIVERSE
========================================================= */

function TechUniverse() {
const shouldReduceMotion = useReducedMotion();

return ( <section
   className="tech-universe"
   id="tech-universe"
   aria-labelledby="tech-universe-title"
 >


  {/* =====================================================
      BACKGROUND
  ===================================================== */}

  <div
    className="tech-universe-background"
    aria-hidden="true"
  />

  <div
    className="tech-universe-grid"
    aria-hidden="true"
  />

  <div
    className="tech-universe-glow tech-universe-glow-one"
    aria-hidden="true"
  />

  <div
    className="tech-universe-glow tech-universe-glow-two"
    aria-hidden="true"
  />


  {/* =====================================================
      PARTICLES
  ===================================================== */}

  <div
    className="tech-particles"
    aria-hidden="true"
  >

    <Particle
      className="particle-one"
      delay={0}
      duration={4}
      shouldReduceMotion={shouldReduceMotion}
    />

    <Particle
      className="particle-two"
      delay={0.8}
      duration={5}
      shouldReduceMotion={shouldReduceMotion}
    />

    <Particle
      className="particle-three"
      delay={1.4}
      duration={4.5}
      shouldReduceMotion={shouldReduceMotion}
    />

    <Particle
      className="particle-four"
      delay={2}
      duration={5.5}
      shouldReduceMotion={shouldReduceMotion}
    />

    <Particle
      className="particle-five"
      delay={2.6}
      duration={4.2}
      shouldReduceMotion={shouldReduceMotion}
    />

    <Particle
      className="particle-six"
      delay={3.1}
      duration={6}
      shouldReduceMotion={shouldReduceMotion}
    />

  </div>


  {/* =====================================================
      HEADER
  ===================================================== */}

  <motion.div
    className="tech-universe-header"
    initial={
      shouldReduceMotion
        ? false
        : {
            opacity: 0,
            y: 40,
          }
    }
    whileInView={
      shouldReduceMotion
        ? undefined
        : {
            opacity: 1,
            y: 0,
          }
    }
    viewport={{
      once: true,
      amount: 0.3,
    }}
    transition={{
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    }}
  >

    <span className="section-eyebrow tech-universe-eyebrow">
      <Sparkles
        size={16}
        strokeWidth={1.8}
      />

      THE TECHNOLOGY UNIVERSE
    </span>

    <h2 id="tech-universe-title">
      Built with{" "}
      <span>modern technology.</span>
    </h2>

    <p>
      The tools, technologies and ideas that power
      the experiences I build.
    </p>

  </motion.div>


  {/* =====================================================
      UNIVERSE
  ===================================================== */}

  <div className="tech-universe-stage">

    {/* ===================================================
        OUTER ORBITS
    =================================================== */}

    <motion.div
      className="tech-orbit tech-orbit-one"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotate: 360,
            }
      }
      transition={{
        duration: 32,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    />

    <motion.div
      className="tech-orbit tech-orbit-two"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotate: -360,
            }
      }
      transition={{
        duration: 42,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    />

    <motion.div
      className="tech-orbit tech-orbit-three"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotate: 360,
            }
      }
      transition={{
        duration: 55,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    />


    {/* ===================================================
        CONNECTION LINES
    =================================================== */}

    <TechConnection
      className="connection-react"
      shouldReduceMotion={shouldReduceMotion}
    />

    <TechConnection
      className="connection-javascript"
      shouldReduceMotion={shouldReduceMotion}
    />

    <TechConnection
      className="connection-html"
      shouldReduceMotion={shouldReduceMotion}
    />

    <TechConnection
      className="connection-css"
      shouldReduceMotion={shouldReduceMotion}
    />

    <TechConnection
      className="connection-vite"
      shouldReduceMotion={shouldReduceMotion}
    />

    <TechConnection
      className="connection-git"
      shouldReduceMotion={shouldReduceMotion}
    />


    {/* ===================================================
        CENTER
    =================================================== */}

    <motion.div
      className="tech-universe-center"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              scale: 0.65,
            }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              scale: 1,
            }
      }
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 1.1,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      <motion.div
        className="tech-center-ring tech-center-ring-one"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="tech-center-ring tech-center-ring-two"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotate: -360,
              }
        }
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
      />

      <div className="tech-center-core">

        <span className="tech-center-icon">
          <Zap
            size={24}
            strokeWidth={1.7}
          />
        </span>

        <strong>
          NATHAN
        </strong>

        <span>
          FRONTEND DEVELOPER
        </span>

      </div>

    </motion.div>


    {/* ===================================================
        TECHNOLOGY NODES
    =================================================== */}

    {technologies.map((technology, index) => (
      <TechNode
        key={technology.id}
        technology={technology}
        index={index}
        shouldReduceMotion={shouldReduceMotion}
      />
    ))}


    {/* ===================================================
        CENTER PARTICLES
    =================================================== */}

    <span
      className="tech-core-particle tech-core-particle-one"
      aria-hidden="true"
    />

    <span
      className="tech-core-particle tech-core-particle-two"
      aria-hidden="true"
    />

    <span
      className="tech-core-particle tech-core-particle-three"
      aria-hidden="true"
    />

  </div>


  {/* =====================================================
      FOOTER MESSAGE
  ===================================================== */}

  <motion.div
    className="tech-universe-footer"
    initial={
      shouldReduceMotion
        ? false
        : {
            opacity: 0,
            y: 35,
          }
    }
    whileInView={
      shouldReduceMotion
        ? undefined
        : {
            opacity: 1,
            y: 0,
          }
    }
    viewport={{
      once: true,
      amount: 0.3,
    }}
    transition={{
      duration: 0.8,
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1],
    }}
  >

    <span className="tech-footer-line" />

    <span className="tech-footer-icon">
      <Database
        size={16}
        strokeWidth={1.7}
      />
    </span>

    <p>
      Every technology has a purpose.
      <strong>
        Every interaction has an intention.
      </strong>
    </p>

    <span className="tech-footer-line" />

  </motion.div>

</section>

);
}

export default TechUniverse;
