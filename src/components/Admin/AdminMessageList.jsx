import {
  MessageCircle,
  Loader2,
} from "lucide-react";


/* =========================================================
   ADMIN MESSAGE LIST

   Displays messages for the currently selected conversation.

   Props:
   messages
   → Messages returned from chat.js

   loading
   → Whether messages are currently loading

   messagesEndRef
   → Ref used by AdminChat to scroll to the newest message
========================================================= */

export default function AdminMessageList({
  messages = [],
  loading = false,
  messagesEndRef,
}) {

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="admin-chat-messages">

        <div className="admin-chat-loading">

          <Loader2
            size={22}
            className="admin-chat-spin"
            aria-hidden="true"
          />

          <span>
            Loading messages...
          </span>

        </div>

      </div>

    );

  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (!messages.length) {

    return (

      <div className="admin-chat-messages">

        <div className="admin-chat-no-messages">

          <MessageCircle
            size={24}
            aria-hidden="true"
          />

          <p>
            No messages yet.
          </p>

          <span>
            Your conversation will appear here.
          </span>

        </div>


        <div
          ref={messagesEndRef}
        />

      </div>

    );

  }


  /* =======================================================
     MESSAGE LIST
  ======================================================= */

  return (

    <div className="admin-chat-messages">

      {messages.map(
        (item, index) => {

          /* =================================================
             DETERMINE SENDER
          ================================================= */

          const sender =
            item?.sender ||
            item?.sender_type ||
            "visitor";


          const isAdmin =
            sender === "admin";


          /* =================================================
             MESSAGE TEXT
          ================================================= */

          const text =
            item?.message ||
            "";


          /* =================================================
             TIMESTAMP
          ================================================= */

          const formattedTime =
            item?.created_at
              ? new Date(
                  item.created_at
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "";


          return (

            <div
              key={
                item?.id ||
                `${item?.created_at}-${index}`
              }
              className={
                isAdmin
                  ? "admin-message admin-message-admin"
                  : "admin-message admin-message-visitor"
              }
            >

              {/* ===========================================
                  SENDER LABEL
              =========================================== */}

              <span className="admin-message-sender">

                {isAdmin
                  ? "You"
                  : "Visitor"}

              </span>


              {/* ===========================================
                  MESSAGE BUBBLE
              =========================================== */}

              <div className="admin-message-bubble">

                {text}

              </div>


              {/* ===========================================
                  TIME
              =========================================== */}

              {formattedTime && (

                <time
                  dateTime={
                    item.created_at
                  }
                >
                  {formattedTime}
                </time>

              )}

            </div>

          );

        }
      )}


      {/* ===================================================
          SCROLL TARGET
      =================================================== */}

      <div
        ref={messagesEndRef}
      />

    </div>

  );

}
