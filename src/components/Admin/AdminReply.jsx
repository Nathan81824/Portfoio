import { useState } from "react";

import {
  Send,
  Loader2,
} from "lucide-react";

import {
  sendMessage,
} from "../../javascript/contact/chat";


/* =========================================================
   ADMIN REPLY

   Handles:
   - Reply text
   - Sending admin replies
   - Loading state
   - Empty-message protection
   - Passing the new message back to AdminChat

   Props:
   conversationId
   → Currently selected conversation

   onMessageSent
   → Called after Supabase successfully creates the message
========================================================= */

export default function AdminReply({
  conversationId,
  onMessageSent,
}) {

  /* =======================================================
     STATE
  ======================================================= */

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      const text =
        message.trim();


      /* ===================================================
         VALIDATION
      =================================================== */

      if (!text) {
        return;
      }


      if (!conversationId) {

        setError(
          "Select a conversation first."
        );

        return;

      }


      try {

        setSending(true);

        setError("");


        /* ================================================
           SEND THROUGH EXISTING CHAT SYSTEM
        ================================================= */

        const newMessage =
          await sendMessage({

            conversationId:

              conversationId,

            message:

              text,

            sender:

              "admin",

          });


        /* ================================================
           UPDATE PARENT
        ================================================= */

        if (
          typeof onMessageSent ===
          "function"
        ) {

          onMessageSent(
            newMessage
          );

        }


        /* ================================================
           CLEAR INPUT
        ================================================= */

        setMessage("");


      } catch (sendError) {

        console.error(
          "Admin reply error:",
          sendError
        );


        setError(
          sendError?.message ||
          "Could not send reply."
        );

      } finally {

        setSending(false);

      }

    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="admin-chat-reply-wrapper">

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <p
          className="admin-chat-reply-error"
          role="alert"
        >
          {error}
        </p>

      )}


      {/* =================================================
          REPLY FORM
      ================================================= */}

      <form
        className="admin-chat-reply"
        onSubmit={handleSubmit}
      >

        {/* ===============================================
            INPUT
        ================================================ */}

        <input
          type="text"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          placeholder={
            conversationId
              ? "Reply to visitor..."
              : "Select a conversation..."
          }
          disabled={
            sending ||
            !conversationId
          }
          autoComplete="off"
          aria-label="Reply to visitor"
        />


        {/* ===============================================
            SEND BUTTON
        ================================================ */}

        <button
          type="submit"
          disabled={
            sending ||
            !conversationId ||
            !message.trim()
          }
          aria-label="Send reply"
          title="Send reply"
        >

          {sending ? (

            <Loader2
              size={18}
              className="admin-chat-spin"
              aria-hidden="true"
            />

          ) : (

            <Send
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />

          )}

        </button>

      </form>

    </div>

  );

}
