import { useState } from "react";

import {
  MessageCircle,
  X,
  Send,
  LoaderCircle,
  Check,
  AlertCircle,
} from "lucide-react";

import { personalInfo } from "../../../javascript/data/personal/personal";



export default function FloatingContact() {

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  const [sent, setSent] = useState(false);

  const [error, setError] = useState("");


  /* =========================================================
     RECIPIENT
  ========================================================= */

  const recipientEmail =
    personalInfo?.email || "";


  /* =========================================================
     TOGGLE CONTACT PANEL
  ========================================================= */

  const toggleContact = () => {

    if (sending) return;

    setIsOpen(
      (previous) => !previous
    );

    setError("");

  };


  /* =========================================================
     CLOSE CONTACT PANEL
  ========================================================= */

  const closeContact = () => {

    if (sending) return;

    setIsOpen(false);

    setError("");

  };


  /* =========================================================
     HANDLE SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setSent(false);


    /* =======================================================
       CLEAN VALUES
    ======================================================= */

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim();

    const cleanMessage =
      message.trim();


    /* =======================================================
       VALIDATION
    ======================================================= */

    if (!cleanName) {

      setError(
        "Name is required."
      );

      return;

    }


    if (!cleanEmail) {

      setError(
        "Email is required."
      );

      return;

    }


    if (!cleanMessage) {

      setError(
        "Message is required."
      );

      return;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(
        cleanEmail
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;

    }


    if (!recipientEmail) {

      setError(
        "Contact email is not configured."
      );

      return;

    }


    /* =======================================================
       START SENDING
    ======================================================= */

    setSending(true);


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/contact",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                name:
                  cleanName,

                email:
                  cleanEmail,

                message:
                  cleanMessage,

                recipient:
                  recipientEmail,

              }),

          }
        );


      /* =====================================================
         READ SERVER RESPONSE
      ===================================================== */

      const responseText =
        await response.text();


      let data = {};


      if (
        responseText.trim()
      ) {

        try {

          data =
            JSON.parse(
              responseText
            );

        } catch {

          throw new Error(
            "The server returned an invalid response."
          );

        }

      }


      /* =====================================================
         SERVER ERROR
      ===================================================== */

      if (!response.ok) {

        throw new Error(
          data.message ||
          `Unable to send message right now. (${response.status})`
        );

      }


      /* =====================================================
         SUCCESS
      ===================================================== */

      setName("");

      setEmail("");

      setMessage("");

      setSent(true);


      setTimeout(() => {

        setSent(false);

      }, 4000);


    } catch (err) {

      console.error(
        "Floating contact error:",
        err
      );


      setError(
        err?.message ||
        "Unable to send message right now."
      );


    } finally {

      setSending(false);

    }

  };


  return (

    <div className="floating-contact">


      {/* =====================================================
          CONTACT PANEL
      ===================================================== */}

      {isOpen && (

        <div
          className="floating-contact-panel"

          role="dialog"

          aria-modal="false"

          aria-label="Contact form"
        >


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="floating-contact-header">

            <div className="floating-contact-heading">

              <div className="floating-contact-avatar">

                <MessageCircle
                  size={18}
                  strokeWidth={2}
                />

              </div>


              <div>

                <strong>
                  Let's Talk
                </strong>

                <span className="floating-contact-status">

                  <span
                    className="animate-status"
                    aria-hidden="true"
                  />

                  Available for projects

                </span>

              </div>

            </div>


            <button
              type="button"

              className="floating-contact-close"

              onClick={closeContact}

              disabled={sending}

              aria-label="Close contact form"
            >

              <X
                size={18}
                strokeWidth={2}
              />

            </button>

          </div>


          {/* =================================================
              INTRO
          ================================================= */}

          <div className="floating-contact-intro">

            <p>
              Have a project, idea, or question?
              Send me a message and I'll get back
              to you.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="floating-contact-form"

            onSubmit={handleSubmit}
          >


            {/* ===============================================
                NAME
            =============================================== */}

            <div className="floating-contact-field">

              <label
                htmlFor="floating-contact-name"
              >
                Name
              </label>

              <input
                id="floating-contact-name"

                name="name"

                type="text"

                value={name}

                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }

                placeholder="Your name"

                autoComplete="name"

                maxLength={100}

                disabled={sending}

                required
              />

            </div>


            {/* ===============================================
                EMAIL
            =============================================== */}

            <div className="floating-contact-field">

              <label
                htmlFor="floating-contact-email"
              >
                Email
              </label>

              <input
                id="floating-contact-email"

                name="email"

                type="email"

                value={email}

                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }

                placeholder="your@email.com"

                autoComplete="email"

                maxLength={150}

                disabled={sending}

                required
              />

            </div>


            {/* ===============================================
                MESSAGE
            =============================================== */}

            <div className="floating-contact-field">

              <label
                htmlFor="floating-contact-message"
              >
                Message
              </label>

              <textarea
                id="floating-contact-message"

                name="message"

                value={message}

                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }

                placeholder="Write your message..."

                rows={5}

                maxLength={1000}

                disabled={sending}

                required
              />

            </div>


            {/* ===============================================
                CHARACTER COUNT
            =============================================== */}

            <div className="floating-contact-meta">

              <span>
                {message.length}/1000
              </span>

            </div>


            {/* ===============================================
                ERROR
            =============================================== */}

            {error && (

              <div
                className="floating-contact-error"

                role="alert"
              >

                <AlertCircle
                  size={15}
                  strokeWidth={2}
                />

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* ===============================================
                SUCCESS
            =============================================== */}

            {sent && (

              <div
                className="floating-contact-success"

                role="status"
              >

                <Check
                  size={15}
                  strokeWidth={2}
                />

                <span>
                  Message sent successfully.
                </span>

              </div>

            )}


            {/* ===============================================
                SEND BUTTON
            =============================================== */}

            <button
              type="submit"

              className="floating-contact-send"

              disabled={
                sending ||
                !name.trim() ||
                !email.trim() ||
                !message.trim()
              }
            >

              {sending ? (

                <>

                  <LoaderCircle
                    size={17}
                    strokeWidth={2}

                    className="floating-contact-spinner"
                  />

                  <span>
                    Sending...
                  </span>

                </>

              ) : sent ? (

                <>

                  <Check
                    size={17}
                    strokeWidth={2}
                  />

                  <span>
                    Sent
                  </span>

                </>

              ) : (

                <>

                  <span>
                    Send Message
                  </span>

                  <Send
                    size={17}
                    strokeWidth={2}
                  />

                </>

              )}

            </button>

          </form>

        </div>

      )}


      {/* =====================================================
          FLOATING CONTACT BUTTON
      ===================================================== */}

      <button
        type="button"

        className={`
          floating-contact-button
          ${isOpen ? "is-open" : ""}
        `}

        onClick={toggleContact}

        aria-label={
          isOpen
            ? "Close contact form"
            : "Open contact form"
        }

        aria-expanded={isOpen}
      >

        {isOpen ? (

          <X
            size={22}
            strokeWidth={2}
          />

        ) : (

          <MessageCircle
            size={22}
            strokeWidth={2}
          />

        )}

      </button>

    </div>

  );

}


