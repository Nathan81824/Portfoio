import {
  Search,
  Palette,
  Code2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";



const processSteps = [
  {
    number: "01",
    title: "DISCOVER",
    description:
      "We start by understanding your idea, goals, audience, and what the project needs to achieve.",
    icon: Search,
  },
  {
    number: "02",
    title: "DESIGN",
    description:
      "We shape the visual direction, user experience, structure, and interactions before development.",
    icon: Palette,
  },
  {
    number: "03",
    title: "BUILD",
    description:
      "Your idea becomes a responsive, functional web experience built with modern technologies.",
    icon: Code2,
  },
  {
    number: "04",
    title: "REFINE",
    description:
      "Everything gets tested, polished, optimized, and refined until the experience feels right.",
    icon: Sparkles,
  },
];


function ContactProcess() {
  return (
    <section className="contact-process" id="contact-process">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <motion.div
        className="contact-process-header"
        initial={{
          opacity: 0,
          y: 45,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      >

        <div className="contact-process-eyebrow">
          <span>THE PROCESS</span>
        </div>

        <h2>
          From idea
          <span>to reality.</span>
        </h2>

        <p>
          Every project starts with an idea. I turn that idea into a
          thoughtful, functional, and modern digital experience.
        </p>

      </motion.div>


      {/* =====================================================
          PROCESS GRID
      ===================================================== */}

      <div className="contact-process-grid">

        {processSteps.map((step, index) => {

          const Icon = step.icon;

          return (
            <motion.article
              className="contact-process-card"
              key={step.number}
              initial={{
                opacity: 0,
                y: 60,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.76, 0, 0.24, 1],
              }}
            >

              {/* CARD NUMBER */}

              <div className="contact-process-number">
                {step.number}
              </div>


              {/* ICON */}

              <div className="contact-process-icon">
                <Icon size={24} strokeWidth={1.7} />
              </div>


              {/* CONTENT */}

              <div className="contact-process-card-content">

                <span className="contact-process-step">
                  STEP {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </div>


              {/* BOTTOM ARROW */}

              <div className="contact-process-arrow">
                <ArrowRight size={17} />
              </div>


              {/* CONNECTOR */}

              {index < processSteps.length - 1 && (
                <div className="contact-process-connector">
                  <span />
                </div>
              )}

            </motion.article>
          );
        })}

      </div>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <motion.div
        className="contact-process-cta"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease: [0.76, 0, 0.24, 1],
        }}
      >

        <div className="contact-process-cta-content">

          <span>
            READY WHEN YOU ARE
          </span>

          <h3>
            Good ideas deserve
            <strong>great execution.</strong>
          </h3>

        </div>


        <Link
          to="contact"
          smooth={true}
          duration={900}
          offset={-80}
          className="contact-process-cta-button"
        >
          <span>Start a conversation</span>

          <ArrowRight size={18} />

        </Link>

      </motion.div>

    </section>
  );
}


export default ContactProcess;
