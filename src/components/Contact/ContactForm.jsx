
import { useState } from "react";

import {
  Send,
  User,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import dataStorage from "../../javascript/data/dataStorage.js";

import {
  notifyNewContact,
} from "../../javascript/data/notification/notification.js";


/* =========================================================
   CONTACT FORM
========================================================= */

export default function ContactForm({
  onSubmitted,
}) {

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });


  /* =======================================================
     STATUS
  ======================================================= */

  const [status, setStatus] =
    useState("idle");


  const [error, setError] =
    useState("");


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


    if (!name) {
      return "Please enter your name.";
    }


    if (!email) {
      return "Please enter your email.";
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }


    if (!message) {
      return "Please enter a message.";
    }


    if (message.length > 1000) {
      return "Your message must be 1000 characters or less.";
    }


    return "";

  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {

    event.preventDefault();

    setError("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(
        validationError
      );

      setStatus("error");

      return;

    }


    /* =====================================================
       CREATE CONTACT MESSAGE
    ===================================================== */

    const now =
      new Date();


    const contactMessage = {

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


    try {

      /* ===================================================
         SAVE MESSAGE
      =================================================== */

      if (
        !dataStorage ||
        typeof dataStorage.save !==
          "function"
      ) {

        throw new Error(
          "Contact message storage is unavailable."
        );

      }


      dataStorage.save(
        contactMessage
      );


      /* ===================================================
         NOTIFICATION
      =================================================== */

      try {

        notifyNewContact(
          contactMessage
        );

      } catch (
        notificationError
      ) {

        console.warn(
          "Browser notification could not be created:",
          notificationError
        );

      }


      /* ===================================================
         UPDATE INBOX
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

      setStatus(
        "success"
      );


      if (
        typeof onSubmitted ===
        "function"
      ) {

        onSubmitted(
          contactMessage
        );

      }

    } catch (
      submissionError
    ) {

      console.error(
        "Contact form error:",
        submissionError
      );


      setError(
        "Something went wrong while saving your message. Please try again."
      );


      setStatus(
        "error"
      );

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

    <section
      className="contact-form"
      aria-label="Contact form"
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="contact-form__header">

        <span className="contact-form__eyebrow">
          GET IN TOUCH
        </span>


        <h2>
          Send a message
        </h2>


        <p>
          Have a project, question, or idea?
          Send me a message and I'll get back
          to you.
        </p>

      </div>


      {/* ===================================================
          SUCCESS MESSAGE
      =================================================== */}

      {status === "success" && (

        <div
          className="
            contact-form__status
            contact-form__status--success
          "
          role="status"
        >

          <CheckCircle2
            size={19}
            strokeWidth={1.8}
          />

          <div>

            <strong>
              Message sent
            </strong>

            <span>
              Your message has been saved successfully.
            </span>

          </div>

        </div>

      )}


      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      {status === "error" && error && (

        <div
          className="
            contact-form__status
            contact-form__status--error
          "
          role="alert"
        >

          <AlertCircle
            size={19}
            strokeWidth={1.8}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ===================================================
          FORM
      =================================================== */}

      <form
        className="contact-form__body"
        onSubmit={handleSubmit}
        noValidate
      >

        {/* =================================================
            NAME
        ================================================= */}

        <div className="contact-form__field">

          <label
            htmlFor="contact-name"
          >
            Name
          </label>


          <div className="contact-form__input-wrap">

            <User
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />


            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              maxLength={80}
              required
            />

          </div>

        </div>


        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="contact-form__field">

          <label
            htmlFor="contact-email"
          >
            Email
          </label>


          <div className="contact-form__input-wrap">

            <Mail
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />


            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={120}
              required
            />

          </div>

        </div>


        {/* =================================================
            MESSAGE
        ================================================= */}

        <div className="contact-form__field">

          <div className="contact-form__label-row">

            <label
              htmlFor="contact-message"
            >
              Message
            </label>


            <span
              className={
                characterCount >= 900
                  ? `
                    contact-form__counter
                    contact-form__counter--warning
                  `
                  : "contact-form__counter"
              }
            >
              {characterCount}/1000
            </span>

          </div>


          <div className="contact-form__textarea-wrap">

            <MessageSquare
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />


            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={6}
              maxLength={1000}
              required
            />

          </div>

        </div>


        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          className="contact-form__submit"
        >

          <span>
            Send Message
          </span>


          <Send
            size={17}
            strokeWidth={1.8}
          />

        </button>

      </form>


      {/* ===================================================
          PRIVACY NOTE
      =================================================== */}

      <p className="contact-form__note">
        Your contact details are used only to
        respond to your message.
      </p>

    </section>

  );

}
