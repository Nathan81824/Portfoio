import {
Code2,
Rocket,
Sparkles,
GitBranch,
GraduationCap,
ArrowRight,
FolderGit2,
Layers3,
Flame,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useEffect, useRef, useState } from "react";

import myImage from "../../assets/images/my-image.jpg";


const journey = [
{
year: "01",
icon: GraduationCap,
title: "Started Learning",
text: "I started with the fundamentals of web development, learning HTML, CSS, and JavaScript and discovering how websites actually work.",
},
{
year: "02",
icon: Code2,
title: "Moved Into React",
text: "After building with JavaScript, I started learning React and exploring components, props, state, routing, hooks, and modern frontend architecture.",
},
{
year: "03",
icon: GitBranch,
title: "Started Building",
text: "I began turning what I learned into real projects, improving my problem-solving skills and getting more comfortable working with Git and GitHub.",
},
{
year: "04",
icon: Rocket,
title: "Building For The Future",
text: "Now I'm focused on creating polished, responsive, and interactive digital experiences while continuously learning new technologies.",
},
];

const stats = [
{
value: 10,
suffix: "+",
label: "Projects Built",
icon: FolderGit2,
description: "Real things I've created",
},
{
value: 10,
suffix: "+",
label: "Technologies",
icon: Layers3,
description: "Tools in my toolkit",
},
{
value: 100,
suffix: "%",
label: "Curiosity",
icon: Flame,
description: "Always learning",
},
];

function CountingStat({
value,
suffix,
label,
icon: Icon,
description,
delay,
}) {
const [count, setCount] = useState(0);
const hasStarted = useRef(false);

useEffect(() => {
if (hasStarted.current) return;


hasStarted.current = true;

const duration = 1600;
const startTime = performance.now();

const animate = (currentTime) => {
  const progress = Math.min(
    (currentTime - startTime) / duration,
    1
  );

  const easedProgress =
    1 - Math.pow(1 - progress, 3);

  const currentValue = Math.floor(
    value * easedProgress
  );

  setCount(currentValue);

  if (progress < 1) {
    requestAnimationFrame(animate);
  } else {
    setCount(value);
  }
};

requestAnimationFrame(animate);


}, [value]);

return (
<motion.div
className="about-stat"
initial={{ opacity: 0, y: 35, scale: 0.96 }}
whileInView={{ opacity: 1, y: 0, scale: 1 }}
viewport={{ once: true, amount: 0.5 }}
transition={{
duration: 0.6,
delay,
ease: "easeOut",
}}
> <div className="about-stat-glow" />


  <div className="about-stat-top">
    <div className="about-stat-icon">
      <Icon size={21} />
    </div>

    <span className="about-stat-index">
      0{delay === 0 ? 1 : delay === 0.1 ? 2 : 3}
    </span>
  </div>

  <div className="about-stat-number">
    {count}
    <span>{suffix}</span>
  </div>

  <h3>{label}</h3>

  <p>{description}</p>

  <div className="about-stat-line">
    <span />
  </div>
</motion.div>


);
}

function AboutJourney() {
return ( <section className="about-journey" id="about"> <div className="about-journey-container">


    <motion.div
      className="about-journey-heading"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <span className="about-journey-label">
        <Sparkles size={16} />
        MY JOURNEY
      </span>

      <h2>
        From curiosity
        <span> to code.</span>
      </h2>

      <p>
        I'm Nathan, a frontend developer who enjoys turning ideas into
        modern, interactive, and responsive digital experiences.
      </p>
    </motion.div>

    <div className="about-journey-main">

      <motion.div
        className="about-journey-intro"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-journey-image">
          <div className="about-image-glow" />

          <img
            src={myImage}
            alt="Nathan"
          />

          <div className="about-image-badge">
            <Code2 size={18} />
            <span>Frontend Developer</span>
          </div>
        </div>

        <div className="about-journey-description">
          <h3>Building. Learning. Improving.</h3>

          <p>
            I believe the best way to learn development is by actually
            building things. Every project gives me a chance to understand
            something new, solve problems, and improve the way I write code.
          </p>

          <p>
            I'm especially interested in React, modern UI development,
            animations, and creating experiences that feel fast, clean,
            and enjoyable to use.
          </p>

          <Link
            to="projects"
            smooth={true}
            duration={700}
            offset={-80}
            className="about-journey-button"
          >
            Explore my work
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      <div className="about-journey-timeline">

        {journey.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              className="journey-item"
              key={item.year}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
              }}
            >
              <div className="journey-number">
                {item.year}
              </div>

              <div className="journey-line">
                <div className="journey-icon">
                  <Icon size={20} />
                </div>

                {index !== journey.length - 1 && (
                  <span className="journey-connector" />
                )}
              </div>

              <div className="journey-content">
                <span className="journey-small-label">
                  PHASE {item.year}
                </span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>

    <motion.div
      className="about-stats"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {stats.map((stat, index) => (
        <CountingStat
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          icon={stat.icon}
          description={stat.description}
          delay={index * 0.1}
        />
      ))}
    </motion.div>

  </div>
</section>


);
}

export default AboutJourney;
