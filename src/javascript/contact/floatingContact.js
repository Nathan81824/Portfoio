import { useState } from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  MessageCircle,
  X,
  Send,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  saveContactMessage,
} from "../../javascript/contact/contactStorage.js";

import {
  notifyNewContact,
} from "../../javascript/data/notification/notification.js";

import "./floatcontact.css";


/* =========================================================
   FLOATING CONTACT
========================================================= */

export default function FloatingContact() {

  /* =======================================================
     STATE
  ======================================================= */

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const [error, setError] = useState("");


  /* =======================================================
     TOGGLE CONTACT
  ======================================================= */

  const toggleContact = () => {

    setOpen((previous) => !previous);

    setError("");

  };


  /* =======================================================
     CLOSE CONTACT
  ======================================================= */

  const closeContact = () => {

    setOpen(false);

    setError("");

  };


  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));


    if (status !== "idle") {

      setStatus("idle");

    }


    if (error) {

      setError("");

    }

  };


  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const message =
      formData.message.trim();


    /* =====================================================
       NAME
    ===================================================== */

    if (!name) {

      return "Please enter your name.";

    }


    /* =====================================================
       EMAIL
    ===================================================== */

    if (!email) {

      return "Please enter your email.";

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

      return "Please enter a valid email.";

    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    if (!message) {

      return "Please enter your message.";

    }


    if (message.length > 1000) {

      return "Your message is too long.";

    }


    return "";

  };


  /* =======================================================
     CREATE MESSAGE
  ======================================================= */

  const createContactMessage = () => {

    const now = new Date();

    return {

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,

      name:
        formData.name.trim(),

      email:
        formData.email.trim(),

      message:
        formData.message.trim(),

      createdAt:
        now.toISOString(),

      read:
        false,

    };

  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {

    event.preventDefault();

    setError("");


    /* =====================================================
       VALIDATE
    ===================================================== */

    const validationError =
      validateForm();


    if (validationError) {

      setError(validationError);

      setStatus("error");

      return;

    }


    /* =====================================================
       CREATE MESSAGE
    ===================================================== */

    const contactMessage =
      createContactMessage();


    try {

      /* ===================================================
         SAVE MESSAGE
      =================================================== */

      saveContactMessage(
        contactMessage
      );


      /* ===================================================
         BROWSER NOTIFICATION
      =================================================== */

      try {

        notifyNewContact(
          contactMessage
        );

      } catch (notificationError) {

        console.warn(
          "Browser notification failed:",
          notificationError
        );

      }


      /* ===================================================
         NOTIFY OTHER COMPONENTS
      =================================================== */

      window.dispatchEvent(
        new CustomEvent(
          "contact:new",
          {
            detail:
              contactMessage,
          }
        )
      );


      /* ===================================================
         CLEAR FORM
      =================================================== */

      setFormData({
        name: "",
        email: "",
        message: "",
      });


      /* ===================================================
         SUCCESS
      =================================================== */

      setStatus("success");


      /*
        Keep the success message visible
        for 10 seconds.
      */

      window.setTimeout(() => {

        setStatus("idle");

      }, 10000);


    } catch (submissionError) {

      console.error(
        "Floating contact submission error:",
        submissionError
      );


      setError(
        "Unable to save your message. Please try again."
      );

      setStatus("error");

    }

  };


  /* =======================================================
     CHARACTER COUNT
  ======================================================= */

  const characterCount =
    formData.message.length;


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          FLOATING BUTTON
      =================================================== */}

      <motion.button
        type="button"

        className={
          open
            ? "floating-contact__button floating-contact__button--open"
            : "floating-contact__button"
        }

        onClick={toggleContact}

        whileHover={{
          scale: 1.05,
        }}

        whileTap={{
          scale: 0.94,
        }}

        aria-label={
          open
            ? "Close contact form"
            : "Open contact form"
        }

        aria-expanded={open}
      >

        <AnimatePresence
          mode="wait"
          initial={false}
        >

          {open ? (

            <motion.span
              key="close"

              initial={{
                opacity: 0,
                rotate: -90,
                scale: 0.7,
              }}

              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}

              exit={{
                opacity: 0,
                rotate: 90,
                scale: 0.7,
              }}
            >

              <X
                size={22}
                strokeWidth={1.8}
              />

            </motion.span>

          ) : (

            <motion.span
              key="message"

              initial={{
                opacity: 0,
                scale: 0.7,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              exit={{
                opacity: 0,
                scale: 0.7,
              }}
            >

              <MessageCircle
                size={22}
                strokeWidth={1.8}
              />

            </motion.span>

          )}

        </AnimatePresence>


        {/* =================================================
            NOTIFICATION DOT
        ================================================= */}

        {!open && (

          <span
            className="floating-contact__dot"
            aria-hidden="true"
          />

        )}

      </motion.button>


      {/* ===================================================
          CONTACT CARD
      =================================================== */}

      <AnimatePresence>

        {open && (

          <motion.aside
            className="floating-contact__card"

            initial={{
              opacity: 0,
              y: 25,
              scale: 0.96,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}

            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}

            aria-label="Contact form"
          >

            {/* =============================================
                HEADER
            ============================================= */}

            <div
              className="floating-contact__header"
            >

              <div>

                <span
                  className="floating-contact__eyebrow"
                >
                  CONTACT
                </span>


                <h2>
                  Let's talk.
                </h2>


                <p>
                  Send me a message and I'll
                  get back to you.
                </p>

              </div>


              <button
                type="button"

                className="floating-contact__close"

                onClick={closeContact}

                aria-label="Close contact form"
              >

                <X
                  size={17}
                  strokeWidth={1.8}
                />

              </button>

            </div>


            {/* =============================================
                SUCCESS MESSAGE
            ============================================= */}

            {status === "success" && (

              <motion.div
                className="floating-contact__success"

                initial={{
                  opacity: 0,
                  y: 10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                role="status"
              >

                <CheckCircle2
                  size={21}
                  strokeWidth={1.8}
                />


                <div>

                  <strong>
                    Message received
                  </strong>

                  <span>
                    Thanks! Your message has
                    been saved successfully.
                  </span>

                </div>

              </motion.div>

            )}


            {/* =============================================
                ERROR
            ============================================= */}

            {status === "error" && error && (

              <motion.div
                className="floating-contact__error"

                initial={{
                  opacity: 0,
                  y: 8,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                role="alert"
              >

                <AlertCircle
                  size={18}
                  strokeWidth={1.8}
                />


                <span>
                  {error}
                </span>

              </motion.div>

            )}


            {/* =============================================
                FORM
            ============================================= */}

            <form
              className="floating-contact__form"

              onSubmit={handleSubmit}

              noValidate
            >

              {/* =========================================
                  NAME
              ========================================= */}

              <div
                className="floating-contact__field"
              >

                <label
                  htmlFor="floating-contact-name"
                >
                  Name
                </label>


                <div
                  className="floating-contact__input"
                >

                  <User
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />


                  <input
                    id="floating-contact-name"

                    name="name"

                    type="text"

                    value={
                      formData.name
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Your name"

                    autoComplete="name"

                    maxLength={80}

                    required
                  />

                </div>

              </div>


              {/* =========================================
                  EMAIL
              ========================================= */}

              <div
                className="floating-contact__field"
              >

                <label
                  htmlFor="floating-contact-email"
                >
                  Email
                </label>


                <div
                  className="floating-contact__input"
                >

                  <Mail
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />


                  <input
                    id="floating-contact-email"

                    name="email"

                    type="email"

                    value={
                      formData.email
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="you@example.com"

                    autoComplete="email"

                    maxLength={120}

                    required
                  />

                </div>

              </div>


              {/* =========================================
                  MESSAGE
              ========================================= */}

              <div
                className="floating-contact__field"
              >

                <div
                  className="floating-contact__label-row"
                >

                  <label
                    htmlFor="floating-contact-message"
                  >
                    Message
                  </label>


                  <span>
                    {characterCount}/1000
                  </span>

                </div>


                <div
                  className="floating-contact__textarea"
                >

                  <textarea
                    id="floating-contact-message"

                    name="message"

                    value={
                      formData.message
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Write your message..."

                    rows={4}

                    maxLength={1000}

                    required
                  />

                </div>

              </div>


              {/* =========================================
                  SUBMIT
              ========================================= */}

              <motion.button
                type="submit"

                className="floating-contact__submit"

                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.98,
                }}
              >

                <span>
                  Send Message
                </span>


                <Send
                  size={16}
                  strokeWidth={1.8}
                />

              </motion.button>

            </form>


            {/* =============================================
                FOOTER
            ============================================= */}

            <div
              className="floating-contact__footer"
            >

              <span>
                Your message is stored locally.
              </span>


              <ArrowRight
                size={13}
                strokeWidth={1.7}
              />

            </div>

          </motion.aside>

        )}

      </AnimatePresence>
    </>
  );
}

