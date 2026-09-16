import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";

function ContactCTA() {
  const navigate = useNavigate();

  return (
    <section className="contact-cta" id="contact-cta">
      <div className="contact-cta-grid" />

      <div className="contact-cta-glow contact-cta-glow-one" />
      <div className="contact-cta-glow contact-cta-glow-two" />

      <motion.div
        className="contact-cta-floating contact-cta-floating-one"
        initial={{ opacity: 0, y: 20, rotate: -8 }}
        whileInView={{ opacity: 1, y: 0, rotate: -8 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <Code2 size={20} />
      </motion.div>

      <motion.div
        className="contact-cta-floating contact-cta-floating-two"
        initial={{ opacity: 0, y: -20, rotate: 8 }}
        whileInView={{ opacity: 1, y: 0, rotate: 8 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <Sparkles size={18} />
      </motion.div>

      <motion.div
        className="contact-cta-floating contact-cta-floating-three"
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.25 }}
      >
        <Zap size={18} />
      </motion.div>

      <div className="contact-cta-inner">
        <motion.div
          className="contact-cta-eyebrow"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <span className="contact-cta-eyebrow-line" />
          <span>LET'S BUILD SOMETHING</span>
          <span className="contact-cta-eyebrow-line" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          Your next idea
          <span>starts here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          Have an idea for a website, web app, or digital experience?
          Let's turn it into something real, thoughtful, and built to last.
        </motion.p>

        <motion.div
          className="contact-cta-actions"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <Link
            to="contact"
            smooth
            duration={900}
            offset={-80}
            className="contact-cta-primary"
          >
            <span>Start a conversation</span>
            <ArrowRight size={18} />
          </Link>

          <button
            type="button"
            className="contact-cta-secondary"
            onClick={() => navigate("/projects")}
          >
            <span>View my projects</span>
            <ArrowRight size={17} />
          </button>
        </motion.div>

        <motion.div
          className="contact-cta-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="contact-cta-dot" />
          <span>Available for new projects</span>
        </motion.div>
      </div>

      <div className="contact-cta-corner contact-cta-corner-top-left" />
      <div className="contact-cta-corner contact-cta-corner-top-right" />
      <div className="contact-cta-corner contact-cta-corner-bottom-left" />
      <div className="contact-cta-corner contact-cta-corner-bottom-right" />
    </section>
  );
}

export default ContactCTA;