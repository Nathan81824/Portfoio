import { useEffect, useState } from "react";
import {
  Mail,
  Reply,
  Trash2,
  Check,
  CheckCheck,
  Clock,
  User,
  X,
} from "lucide-react";

import {
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  clearContactMessages,
  replyToMessage,
} from "../../javascript/contact/contactStorage";



/* =========================================================
   CONTACT INBOX
========================================================= */

export default function ContactInbox({
  isOpen = true,
  onClose,
}) {

  const [messages, setMessages] =
    useState([]);

  const [selectedMessage, setSelectedMessage] =
    useState(null);


  /* =======================================================
     LOAD MESSAGES
  ======================================================= */

  const loadMessages = () => {

    const savedMessages =
      getContactMessages();

    setMessages(
      Array.isArray(savedMessages)
        ? savedMessages
        : []
    );

  };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadMessages();

  }, []);


  /* =======================================================
     LISTEN FOR NEW CONTACT
  ======================================================= */

  useEffect(() => {

    const handleNewContact = () => {

      loadMessages();

    };


    window.addEventListener(
      "contact:new",
      handleNewContact
    );


    window.addEventListener(
      "contact:updated",
      handleNewContact
    );


    return () => {

      window.removeEventListener(
        "contact:new",
        handleNewContact
      );

      window.removeEventListener(
        "contact:updated",
        handleNewContact
      );

    };

  }, []);


  /* =======================================================
     MARK MESSAGE READ
  ======================================================= */

  const handleSelectMessage = (
    message
  ) => {

    setSelectedMessage(
      message
    );


    if (
      message.read !== true
    ) {

      const updated =
        markMessageAsRead(
          message.id
        );

      setMessages(
        updated
      );

    }

  };


  /* =======================================================
     DELETE MESSAGE
  ======================================================= */

  const handleDelete = (
    messageId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this message?"
      );


    if (!confirmed) {
      return;
    }


    const updated =
      deleteContactMessage(
        messageId
      );


    setMessages(
      updated
    );


    if (
      selectedMessage?.id ===
      messageId
    ) {

      setSelectedMessage(
        null
      );

    }

  };


  /* =======================================================
     CLEAR ALL
  ======================================================= */

  const handleClearAll = () => {

    if (
      messages.length === 0
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Delete all contact messages?"
      );


    if (!confirmed) {
      return;
    }


    clearContactMessages();


    setMessages([]);

    setSelectedMessage(null);

  };


  /* =======================================================
     REPLY
  ======================================================= */

  const handleReply = (
    message
  ) => {

    replyToMessage(
      message
    );

  };


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    value
  ) => {

    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (
    value
  ) => {

    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    return date.toLocaleTimeString(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!isOpen) {

    return null;

  }


  /* =======================================================
     UNREAD COUNT
  ======================================================= */

  const unreadCount =
    messages.filter(
      (message) =>
        message.read !== true
    ).length;


  return (

    <section
      className="contact-inbox"
      aria-label="Contact inbox"
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="contact-inbox__header">

        <div className="contact-inbox__title">

          <div className="contact-inbox__icon">
            <Mail
              size={19}
              strokeWidth={1.8}
            />
          </div>


          <div>

            <span className="contact-inbox__eyebrow">
              CONTACT INBOX
            </span>

            <h2>
              Messages
            </h2>

          </div>

        </div>


        <div className="contact-inbox__actions">

          {unreadCount > 0 && (

            <span className="contact-inbox__count">
              {unreadCount}
            </span>

          )}


          {messages.length > 0 && (

            <button
              type="button"
              className="contact-inbox__clear"
              onClick={handleClearAll}
            >
              Clear
            </button>

          )}


          {onClose && (

            <button
              type="button"
              className="contact-inbox__close"
              onClick={onClose}
              aria-label="Close inbox"
            >
              <X
                size={18}
                strokeWidth={1.8}
              />
            </button>

          )}

        </div>

      </header>


      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="contact-inbox__body">


        {/* =================================================
            EMPTY
        ================================================= */}

        {messages.length === 0 ? (

          <div className="contact-inbox__empty">

            <div className="contact-inbox__empty-icon">

              <Mail
                size={28}
                strokeWidth={1.5}
              />

            </div>


            <h3>
              No messages yet
            </h3>


            <p>
              Messages sent through your
              contact form will appear here.
            </p>

          </div>

        ) : (


          /* ===============================================
             MESSAGE LIST
          =============================================== */

          <div className="contact-inbox__list">

            {messages.map(
              (message) => {

                const isSelected =
                  selectedMessage?.id ===
                  message.id;


                const isUnread =
                  message.read !== true;


                return (

                  <article
                    key={message.id}
                    className={[
                      "contact-message",
                      isUnread
                        ? "contact-message--unread"
                        : "",
                      isSelected
                        ? "contact-message--selected"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >


                    {/* =================================
                        MESSAGE HEADER
                    ================================= */}

                    <button
                      type="button"
                      className="contact-message__top"
                      onClick={() =>
                        handleSelectMessage(
                          message
                        )
                      }
                    >

                      <div className="contact-message__avatar">

                        <User
                          size={18}
                          strokeWidth={1.7}
                        />

                      </div>


                      <div className="contact-message__identity">

                        <div className="contact-message__name">

                          <span>
                            {message.name ||
                              "Visitor"}
                          </span>


                          {isUnread && (

                            <span className="contact-message__new">
                              NEW
                            </span>

                          )}

                        </div>


                        <span className="contact-message__email">

                          {message.email}

                        </span>

                      </div>


                      <div className="contact-message__time">

                        <span>

                          <Clock
                            size={12}
                            strokeWidth={1.7}
                          />

                          {formatTime(
                            message.createdAt
                          )}

                        </span>


                        <small>

                          {formatDate(
                            message.createdAt
                          )}

                        </small>

                      </div>

                    </button>


                    {/* =================================
                        MESSAGE BUBBLE
                    ================================= */}

                    <div className="contact-message__content">

                      <div className="contact-message__bubble">

                        <p>
                          {message.message}
                        </p>


                        <div className="contact-message__meta">

                          <span>
                            {formatTime(
                              message.createdAt
                            )}
                          </span>


                          {message.read ? (

                            <CheckCheck
                              size={14}
                              strokeWidth={1.8}
                            />

                          ) : (

                            <Check
                              size={14}
                              strokeWidth={1.8}
                            />

                          )}

                        </div>

                      </div>

                    </div>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="contact-message__actions">

                      <button
                        type="button"
                        className="contact-message__reply"
                        onClick={() =>
                          handleReply(
                            message
                          )
                        }
                      >

                        <Reply
                          size={15}
                          strokeWidth={1.8}
                        />

                        Reply

                      </button>


                      <button
                        type="button"
                        className="contact-message__delete"
                        onClick={() =>
                          handleDelete(
                            message.id
                          )
                        }
                        aria-label="Delete message"
                      >

                        <Trash2
                          size={15}
                          strokeWidth={1.8}
                        />

                        Delete

                      </button>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        )}

      </div>

    </section>

  );

}
