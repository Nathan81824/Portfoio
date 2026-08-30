import { useState } from "react";

import {
  MessageCircle,
  X,
  Send,
  LoaderCircle,
  Check,
  AlertCircle,
} from "lucide-react";

import "./FloatingContact.css";


/* =========================================================
   FLOATING CONTACT
========================================================= */

export default function FloatingContact() {

  /* =======================================================
     STATE
  ======================================================= */

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     TOGGLE CHAT
  ======================================================= */

  const toggleContact = () => {

    setIsOpen((previous) =>
      !previous
    );

    setError("");

  };


  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  const closeContact = () => {

    if (sending) {
      return;
    }

    setIsOpen(false);

    setError("");

  };


  /* =======================================================
     MESSAGE CHANGE
  ======================================================= */

  const handleMessageChange = (
    event
  ) => {

    setMessage(
      event.target.value
    );

    if (error) {
      setError("");
    }

  };


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    /* =====================================================
       VALIDATION
    ===================================================== */

    const trimmedMessage =
      message.trim();


    if (!trimmedMessage) {

      setError(
        "Please type a message first."
      );

      return;

    }


    if (sending) {
      return;
    }


    /* =====================================================
       START SENDING
    ===================================================== */

    setSending(true);

    setSent(false);

    setError("");


    try {

      /* ===================================================
         SEND TO EXPRESS BACKEND
      =================================================== */

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
                message:
                  trimmedMessage,
              }),
          }
        );


      /* ===================================================
         READ RESPONSE AS TEXT FIRST
         
         This prevents:
         "Unexpected end of JSON input"
      =================================================== */

      const responseText =
        await response.text();


      /* ===================================================
         PARSE JSON SAFELY
      =================================================== */

      let data = {};


      if (responseText.trim()) {

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


      /* ===================================================
         HTTP ERROR
      =================================================== */

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to send your message."
        );

      }


      /* ===================================================
         SUCCESS
      =================================================== */

      setMessage("");

      setSent(true);


      /* ===================================================
         HIDE SUCCESS MESSAGE
      =================================================== */

      setTimeout(() => {

        setSent(false);

      }, 4000);


    } catch (error) {

      console.error(
        "Floating contact error:",
        error
      );


      /* ===================================================
         ERROR MESSAGE
      =================================================== */

      setError(
        error?.message ||
        "Something went wrong. Please try again."
      );


    } finally {

      setSending(false);

    }

  };


  /* =======================================================
     MESSAGE LENGTH
  ======================================================= */

  const characterCount =
    message.length;


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="floating-contact">


      {/* ===================================================
          CHAT BOX
      =================================================== */}

      {isOpen && (

        <div
          className="floating-contact-panel"
          role="dialog"
          aria-label="Contact Nathan"
        >

          {/* ===============================================
              HEADER
          =============================================== */}

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

                <span>

                  <span
                    className="animate-status"
                    aria-hidden="true"
                  />

                  Available for projects

                </span>

              </div>

            </div>


            {/* =============================================
                CLOSE
            ============================================= */}

            <button
              type="button"
              className="floating-contact-close"
              onClick={closeContact}
              disabled={sending}
              aria-label="Close contact box"
            >

              <X
                size={18}
                strokeWidth={2}
              />

            </button>

          </div>


          {/* ===============================================
              INTRO
          =============================================== */}

          <div className="floating-contact-intro">

            <p>
              Have a project or idea?
              Send me a message and I'll
              get back to you.
            </p>

          </div>


          {/* ===============================================
              FORM
          =============================================== */}

          <form
            className="floating-contact-form"
            onSubmit={handleSubmit}
          >

            <label
              htmlFor="floating-contact-message"
              className="floating-contact-label"
            >
              Message
            </label>


            <textarea
              id="floating-contact-message"

              name="message"

              value={message}

              onChange={
                handleMessageChange
              }

              placeholder="Write your message..."
              
              rows={5}

              maxLength={1000}

              disabled={sending}

              autoComplete="off"

              className="floating-contact-textarea"
            />


            {/* =============================================
                CHARACTER COUNT
            ============================================= */}

            <div className="floating-contact-meta">

              <span>

                {characterCount}
                /1000

              </span>

            </div>


            {/* =============================================
                ERROR
            ============================================= */}

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


            {/* =============================================
                SUCCESS
            ============================================= */}

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


            {/* =============================================
                SEND BUTTON
            ============================================= */}

            <button
              type="submit"
              className="floating-contact-send"

              disabled={
                sending ||
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


      {/* ===================================================
          FLOATING BUTTON
      =================================================== */}

      <button
        type="button"

        className={
          `floating-contact-button ${
            isOpen
              ? "is-open"
              : ""
          }`
        }

        onClick={toggleContact}

        aria-label={
          isOpen
            ? "Close contact"
            : "Open contact"
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