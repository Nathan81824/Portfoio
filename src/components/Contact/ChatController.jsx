import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  User,
  Mail,
  Smile,
  Search,
} from "lucide-react";

import chatController from "../../javascript/contact/chatController";

import {
  getEmojiCategories,
  getEmojisByCategory,
  searchEmojis,
} from "../../javascript/utils/emojis/emojis";



/* =========================================================
   CHAT CONTROLLER
========================================================= */

export default function ChatController() {

  /* =======================================================
     CONTROLLER STATE
  ======================================================= */

  const [chatState, setChatState] = useState(
    chatController.getState()
  );


  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [messageText, setMessageText] =
    useState("");

  const [fullscreen, setFullscreen] =
    useState(false);

  const [emojiOpen, setEmojiOpen] =
    useState(false);

  const [emojiSearch, setEmojiSearch] =
    useState("");

  const [emojiCategory, setEmojiCategory] =
    useState("Smileys");


  /* =======================================================
     REFS
  ======================================================= */

  const messagesEndRef =
    useRef(null);

  const inputRef =
    useRef(null);


  /* =======================================================
     CONTROLLER SUBSCRIPTION
  ======================================================= */

  useEffect(() => {

    const unsubscribe =
      chatController.subscribe((state) => {

        setChatState(state);

      });


    Promise.resolve(
      chatController.initialize()
    ).catch((error) => {

      console.error(
        "Chat initialization failed:",
        error
      );

    });


    return () => {

      if (
        typeof unsubscribe ===
        "function"
      ) {

        unsubscribe();

      }

    };

  }, []);


  /* =======================================================
     CONTROLLER STATE
  ======================================================= */

  const {
    isOpen,
    isStarted,
    loading,
    sending,
    error,
    conversation,
    messages,
    visitorName,
    visitorEmail,
  } = chatState;


  /* =======================================================
     EMOJI CATEGORIES
  ======================================================= */

  const emojiCategories = useMemo(
    () => [
      "All",
      ...getEmojiCategories(),
    ],
    []
  );


  /* =======================================================
     VISIBLE EMOJIS
  ======================================================= */

  const visibleEmojis = useMemo(() => {

    const search =
      emojiSearch.trim();


    if (search) {

      return searchEmojis(
        search,
        emojiCategory === "All"
          ? null
          : emojiCategory
      );

    }


    if (emojiCategory === "All") {

      return searchEmojis(
        "",
        null
      );

    }


    return getEmojisByCategory(
      emojiCategory
    );

  }, [
    emojiSearch,
    emojiCategory,
  ]);


  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    isOpen,
  ]);


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    try {

      return new Date(
        date
      ).toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      );

    } catch {

      return "";

    }

  };


  /* =======================================================
     OPEN CHAT
  ======================================================= */

  const handleOpenChat = async () => {

    try {

      await chatController.initialize();

      chatController.open();

    } catch (error) {

      console.error(
        "Unable to open chat:",
        error
      );

    }

  };


  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  const handleCloseChat = () => {

    chatController.close();

    setFullscreen(false);

    setEmojiOpen(false);

    setEmojiSearch("");

  };


  /* =======================================================
     MAXIMIZE
  ======================================================= */

  const handleMaximize = () => {

    setFullscreen(
      (current) => !current
    );

    setEmojiOpen(false);

  };


  /* =======================================================
     START CONVERSATION
  ======================================================= */

  const handleStartConversation =
    async (event) => {

      event.preventDefault();


      const form =
        event.currentTarget;


      const name =
        form.elements.visitorName
          ?.value
          ?.trim() || "";


      const email =
        form.elements.visitorEmail
          ?.value
          ?.trim() || "";


      if (!name) {

        console.warn(
          "Please enter your name."
        );

        return;

      }


      try {

        await chatController.startConversation({
          visitorName:
            name,

          visitorEmail:
            email,
        });

      } catch (error) {

        console.error(
          "Failed to start conversation:",
          error
        );

      }

    };


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSendMessage =
    async () => {

      const text =
        messageText.trim();


      if (
        !text ||
        sending ||
        !isStarted
      ) {

        return;

      }


      try {

        setEmojiOpen(false);


        const result =
          await chatController.send(
            text
          );


        if (result !== false) {

          setMessageText("");

        }


        inputRef.current?.focus();

      } catch (error) {

        console.error(
          "Failed to send message:",
          error
        );

      }

    };


  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSendMessage();

    }

  };


  /* =======================================================
     EMOJI CLICK
  ======================================================= */

  const handleEmojiClick = (emoji) => {

    setMessageText(
      (current) =>
        `${current}${emoji}`
    );


    /*
      Keep the picker open so the
      visitor can select multiple emojis.
    */

    requestAnimationFrame(() => {

      inputRef.current?.focus();

    });

  };


  /* =======================================================
     TOGGLE EMOJI PICKER
  ======================================================= */

  const handleToggleEmoji = () => {

    setEmojiOpen(
      (current) => !current
    );

  };


  /* =======================================================
     CLOSE EMOJI PICKER
  ======================================================= */

  const handleCloseEmoji = () => {

    setEmojiOpen(false);

    setEmojiSearch("");

  };


  /* =======================================================
     EMOJI CATEGORY
  ======================================================= */

  const handleEmojiCategory = (
    category
  ) => {

    setEmojiCategory(category);

    setEmojiSearch("");

  };


  /* =======================================================
     END CHAT
  ======================================================= */

  const handleEndChat = async () => {

    try {

      await chatController.endConversation();

    } catch (error) {

      console.error(
        "Failed to end conversation:",
        error
      );

    }


    setMessageText("");

    setEmojiOpen(false);

    setEmojiSearch("");

    setFullscreen(false);

  };


  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = async () => {

    try {

      if (conversation?.id) {

        await chatController.loadMessages(
          conversation.id
        );

      } else {

        await chatController.initialize();

      }

    } catch (error) {

      console.error(
        "Retry failed:",
        error
      );

    }

  };


  /* =======================================================
     MESSAGE USERNAME
  ======================================================= */

  const getMessageUsername = (
    message
  ) => {

    if (
      message?.sender === "admin"
    ) {

      return "Nathan";

    }


    return (
      conversation?.visitor_name ||
      visitorName ||
      "Visitor"
    );

  };


  /* =======================================================
     CLOSED CHAT
  ======================================================= */

  if (!isOpen) {

    return (

      <button
        type="button"
        className="chat-controller-button"
        onClick={handleOpenChat}
        aria-label="Open chat"
      >

        <MessageCircle
          size={22}
          strokeWidth={1.8}
          aria-hidden="true"
        />

      </button>

    );

  }


  /* =======================================================
     CHAT WINDOW
  ======================================================= */

  return (

    <section
      className={`
        chat-controller
        ${
          fullscreen
            ? "chat-controller-fullscreen"
            : ""
        }
      `}
      aria-label="Chat with Nathan"
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="chat-controller-header">

        <div className="chat-controller-user">

          <div
            className="chat-controller-avatar"
            aria-hidden="true"
          >

            <MessageCircle
              size={20}
              strokeWidth={1.8}
            />

          </div>


          <div>

            <strong>
              Nathan
            </strong>

            <span>
              Frontend Developer
            </span>

          </div>

        </div>


        <div className="chat-controller-actions">

          <button
            type="button"
            className="chat-controller-icon"
            onClick={handleMaximize}
            aria-label={
              fullscreen
                ? "Restore chat"
                : "Maximize chat"
            }
          >

            {fullscreen ? (

              <Minimize2
                size={17}
                strokeWidth={1.8}
              />

            ) : (

              <Maximize2
                size={17}
                strokeWidth={1.8}
              />

            )}

          </button>


          <button
            type="button"
            className="chat-controller-icon"
            onClick={handleCloseChat}
            aria-label="Close chat"
          >

            <X
              size={19}
              strokeWidth={1.8}
            />

          </button>

        </div>

      </header>


      {/* ===================================================
          START SCREEN
      =================================================== */}

      {!isStarted ? (

        <div className="chat-controller-start">

          <div
            className="chat-controller-start-icon"
            aria-hidden="true"
          >

            <MessageCircle
              size={34}
              strokeWidth={1.5}
            />

          </div>


          <h2>
            Let's talk.
          </h2>


          <p>
            Have a question or want to
            work together? Start a
            conversation below.
          </p>


          <form
            className="chat-controller-start-form"
            onSubmit={
              handleStartConversation
            }
          >

            <label>

              <span>
                Name
              </span>


              <div className="chat-controller-input-wrap">

                <User
                  size={16}
                  strokeWidth={1.7}
                />

                <input
                  name="visitorName"
                  type="text"
                  defaultValue={
                    visitorName || ""
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={loading}
                />

              </div>

            </label>


            <label>

              <span>
                Email
                <small>
                  optional
                </small>
              </span>


              <div className="chat-controller-input-wrap">

                <Mail
                  size={16}
                  strokeWidth={1.7}
                />

                <input
                  name="visitorEmail"
                  type="email"
                  defaultValue={
                    visitorEmail || ""
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </label>


            {error && (

              <div
                className="chat-controller-error"
                role="alert"
              >

                <span>
                  {error}
                </span>

              </div>

            )}


            <button
              type="submit"
              className="chat-controller-start-button"
              disabled={loading}
            >

              {loading ? (

                <RefreshCw
                  size={18}
                  className="chat-controller-spin"
                />

              ) : (

                <MessageCircle
                  size={18}
                  strokeWidth={1.8}
                />

              )}

              <span>
                {loading
                  ? "Starting..."
                  : "Start Conversation"}
              </span>

            </button>

          </form>

        </div>

      ) : (

        /* =================================================
           ACTIVE CHAT
        ================================================= */

        <>

          {error && (

            <div
              className="chat-controller-error"
              role="alert"
            >

              <span>
                {error}
              </span>


              <button
                type="button"
                onClick={handleRetry}
              >
                Retry
              </button>

            </div>

          )}


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div
            className="chat-controller-messages"
            aria-live="polite"
          >

            {loading ? (

              <div className="chat-controller-loading">

                <RefreshCw
                  size={22}
                  className="chat-controller-spin"
                />

                <span>
                  Loading conversation...
                </span>

              </div>

            ) : messages.length === 0 ? (

              <div className="chat-controller-empty">

                <MessageCircle
                  size={28}
                  strokeWidth={1.5}
                />

                <p>
                  No messages yet.
                </p>

                <span>
                  Send a message to start
                  the conversation.
                </span>

              </div>

            ) : (

              <div className="chat-controller-message-list">

                {messages.map(
                  (message) => {

                    const isAdmin =
                      message.sender ===
                      "admin";


                    const username =
                      getMessageUsername(
                        message
                      );


                    return (

                      <div
                        key={
                          message.id
                        }
                        className={`
                          chat-controller-message
                          ${
                            isAdmin
                              ? "chat-controller-message-admin"
                              : "chat-controller-message-visitor"
                          }
                        `}
                      >

                        <span
                          className="
                            chat-controller-message-username
                          "
                        >
                          {username}
                        </span>


                        <div
                          className="
                            chat-controller-message-bubble
                          "
                        >
                          {message.message}
                        </div>


                        <time>
                          {formatTime(
                            message.created_at
                          )}
                        </time>

                      </div>

                    );

                  }
                )}


                <div
                  ref={messagesEndRef}
                  aria-hidden="true"
                />

              </div>

            )}

          </div>


          {/* =================================================
              REPLY AREA
          ================================================= */}

          <form
            className="chat-controller-reply"
            onSubmit={(event) => {

              event.preventDefault();

              handleSendMessage();

            }}
          >

            {/* =================================================
                EMOJI PICKER
            ================================================= */}

            {emojiOpen && (

              <div
                className="
                  chat-controller-emoji-picker
                "
                role="dialog"
                aria-label="Emoji picker"
              >

                {/* ===========================================
                    PICKER HEADER
                =========================================== */}

                <div
                  className="
                    chat-controller-emoji-header
                  "
                >

                  <div>

                    <strong>
                      Emojis
                    </strong>

                    <span>
                      Choose an emoji
                    </span>

                  </div>


                  <button
                    type="button"
                    className="
                      chat-controller-emoji-close
                    "
                    onClick={
                      handleCloseEmoji
                    }
                    aria-label="Close emoji picker"
                  >

                    <X
                      size={17}
                      strokeWidth={1.9}
                    />

                  </button>

                </div>


                {/* ===========================================
                    SEARCH
                =========================================== */}

                <div
                  className="
                    chat-controller-emoji-search
                  "
                >

                  <Search
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />


                  <input
                    type="search"
                    value={emojiSearch}
                    onChange={
                      (event) =>
                        setEmojiSearch(
                          event.target.value
                        )
                    }
                    placeholder="Search emojis..."
                    aria-label="Search emojis"
                  />

                </div>


                {/* ===========================================
                    CATEGORIES
                =========================================== */}

                <div
                  className="
                    chat-controller-emoji-categories
                  "
                >

                  {emojiCategories.map(
                    (category) => (

                      <button
                        key={category}
                        type="button"
                        className={`
                          chat-controller-emoji-category
                          ${
                            emojiCategory ===
                            category
                              ? "active"
                              : ""
                          }
                        `}
                        onClick={() =>
                          handleEmojiCategory(
                            category
                          )
                        }
                      >
                        {category}
                      </button>

                    )
                  )}

                </div>


                {/* ===========================================
                    EMOJI GRID
                =========================================== */}

                <div
                  className="
                    chat-controller-emoji-grid
                  "
                >

                  {visibleEmojis.length > 0 ? (

                    visibleEmojis.map(
                      (
                        emoji,
                        index
                      ) => (

                        <button
                          key={
                            `${emoji}-${index}`
                          }
                          type="button"
                          className="
                            chat-controller-emoji
                          "
                          onClick={() =>
                            handleEmojiClick(
                              emoji
                            )
                          }
                          aria-label={
                            `Insert ${emoji}`
                          }
                        >
                          {emoji}
                        </button>

                      )
                    )

                  ) : (

                    <div
                      className="
                        chat-controller-emoji-empty
                      "
                    >
                      No emojis found.
                    </div>

                  )}

                </div>

              </div>

            )}


            {/* =================================================
                EMOJI BUTTON
            ================================================= */}

            <button
              type="button"
              className="
                chat-controller-emoji-button
              "
              onClick={
                handleToggleEmoji
              }
              disabled={sending}
              aria-label={
                emojiOpen
                  ? "Close emoji picker"
                  : "Open emoji picker"
              }
              aria-expanded={
                emojiOpen
              }
            >

              {emojiOpen ? (

                <X
                  size={18}
                  strokeWidth={1.8}
                />

              ) : (

                <Smile
                  size={18}
                  strokeWidth={1.7}
                />

              )}

            </button>


            {/* =================================================
                MESSAGE INPUT
            ================================================= */}

            <textarea
              ref={inputRef}
              value={messageText}
              onChange={
                (event) =>
                  setMessageText(
                    event.target.value
                  )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Write a message..."
              rows={1}
              disabled={sending}
              aria-label="Write a message"
            />


            {/* =================================================
                SEND BUTTON
            ================================================= */}

            <button
              type="submit"
              className="
                chat-controller-send
              "
              disabled={
                sending ||
                !messageText.trim()
              }
              aria-label="Send message"
            >

              {sending ? (

                <RefreshCw
                  size={18}
                  className="
                    chat-controller-spin
                  "
                />

              ) : (

                <Send
                  size={18}
                  strokeWidth={1.8}
                />

              )}

            </button>

          </form>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="chat-controller-footer">

            <span>
              Messages are sent securely.
            </span>


            <button
              type="button"
              onClick={handleEndChat}
            >
              End Chat
            </button>

          </footer>

        </>

      )}

    </section>

  );

}

