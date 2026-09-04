import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  RefreshCw,
  Smile,
  Search,
  X,
} from "lucide-react";

import { supabase } from "../../javascript/supabase/supabaseClient";

import {
  getEmojiCategories,
  getEmojisByCategory,
  searchEmojis,
} from "../../javascript/utils/emojis/emojis";


export default function AdminChart({
  selectedConversation,
}) {

  /* =======================================================
     STATE
  ======================================================= */

  const [messages, setMessages] =
    useState([]);

  const [messageText, setMessageText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     EMOJI STATE
  ======================================================= */

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
     EMOJI CATEGORIES
  ======================================================= */

  const emojiCategories = [
    "All",
    ...getEmojiCategories(),
  ];


  /* =======================================================
     VISIBLE EMOJIS
  ======================================================= */

  const getVisibleEmojis = () => {

    const query =
      emojiSearch.trim();


    if (query) {

      return searchEmojis(
        query,
        emojiCategory === "All"
          ? null
          : emojiCategory
      );

    }


    if (emojiCategory === "All") {

      return getEmojiCategories()
        .flatMap(
          (category) =>
            getEmojisByCategory(
              category
            )
        );

    }


    return getEmojisByCategory(
      emojiCategory
    );

  };


  const visibleEmojis =
    getVisibleEmojis();


  /* =======================================================
     FETCH MESSAGES
  ======================================================= */

  useEffect(() => {

    if (!selectedConversation?.id) {

      setMessages([]);

      setError("");

      return;

    }


    let mounted = true;


    const fetchMessages = async () => {

      setLoading(true);

      setError("");


      const {
        data,
        error: fetchError,
      } = await supabase

        .from("messages")

        .select(`
          id,
          conversation_id,
          message,
          sender,
          created_at
        `)

        .eq(
          "conversation_id",
          selectedConversation.id
        )

        .order(
          "created_at",
          {
            ascending: true,
          }
        );


      if (!mounted) {
        return;
      }


      if (fetchError) {

        console.error(
          "Error fetching messages:",
          fetchError
        );

        setError(
          "Unable to load this conversation."
        );

        setMessages([]);

        setLoading(false);

        return;

      }


      setMessages(
        data || []
      );

      setLoading(false);

    };


    fetchMessages();


    /* =====================================================
       REALTIME
    ===================================================== */

    const channel =
      supabase

        .channel(
          `admin-chat-${selectedConversation.id}`
        )

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter:
              `conversation_id=eq.${selectedConversation.id}`,
          },

          (payload) => {

            /* =============================================
               INSERT
            ============================================= */

            if (
              payload.eventType ===
              "INSERT"
            ) {

              setMessages(
                (current) => {

                  const exists =
                    current.some(
                      (item) =>
                        item.id ===
                        payload.new.id
                    );


                  if (exists) {
                    return current;
                  }


                  return [
                    ...current,
                    payload.new,
                  ];

                }
              );

            }


            /* =============================================
               UPDATE
            ============================================= */

            if (
              payload.eventType ===
              "UPDATE"
            ) {

              setMessages(
                (current) =>
                  current.map(
                    (item) =>
                      item.id ===
                      payload.new.id
                        ? payload.new
                        : item
                  )
              );

            }


            /* =============================================
               DELETE
            ============================================= */

            if (
              payload.eventType ===
              "DELETE"
            ) {

              setMessages(
                (current) =>
                  current.filter(
                    (item) =>
                      item.id !==
                      payload.old.id
                  )
              );

            }

          }
        )

        .subscribe();


    return () => {

      mounted = false;

      supabase.removeChannel(
        channel
      );

    };

  }, [
    selectedConversation?.id,
  ]);


  /* =======================================================
     RESET EMOJI PICKER
  ======================================================= */

  useEffect(() => {

    setEmojiOpen(false);

    setEmojiSearch("");

    setEmojiCategory("Smileys");

    setMessageText("");

  }, [
    selectedConversation?.id,
  ]);


  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
  ]);


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    return new Date(
      date
    ).toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  /* =======================================================
     MESSAGE USERNAME
  ======================================================= */

  const getMessageUsername =
    (item) => {

      if (
        item.sender ===
        "admin"
      ) {

        return "Nathan";

      }


      return (
        selectedConversation
          ?.visitor_name ||
        "Visitor"
      );

    };


  /* =======================================================
     INSERT EMOJI
  ======================================================= */

  const handleEmojiClick =
    (emoji) => {

      setMessageText(
        (current) =>
          `${current}${emoji}`
      );


      inputRef.current?.focus();

    };


  /* =======================================================
     TOGGLE EMOJI PICKER
  ======================================================= */

  const handleToggleEmoji =
    () => {

      setEmojiOpen(
        (current) =>
          !current
      );

    };


  /* =======================================================
     CLOSE EMOJI PICKER
  ======================================================= */

  const handleCloseEmoji =
    () => {

      setEmojiOpen(false);

      setEmojiSearch("");

    };


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend = async () => {

    const text =
      messageText.trim();


    if (
      !text ||
      sending ||
      !selectedConversation?.id
    ) {

      return;

    }


    setSending(true);

    setError("");

    setEmojiOpen(false);


    const {
      data,
      error: sendError,
    } = await supabase

      .from("messages")

      .insert({
        conversation_id:
          selectedConversation.id,

        message:
          text,

        sender:
          "admin",
      })

      .select(`
        id,
        conversation_id,
        message,
        sender,
        created_at
      `)

      .single();


    if (sendError) {

      console.error(
        "Error sending message:",
        sendError
      );

      setError(
        "Unable to send your message."
      );

      setSending(false);

      return;

    }


    /* =====================================================
       IMMEDIATE UI UPDATE
    ===================================================== */

    if (data) {

      setMessages(
        (current) => {

          const exists =
            current.some(
              (item) =>
                item.id ===
                data.id
            );


          if (exists) {
            return current;
          }


          return [
            ...current,
            data,
          ];

        }
      );

    }


    setMessageText("");

    setEmojiSearch("");

    setSending(false);


    inputRef.current?.focus();

  };


  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown =
    (event) => {

      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSend();

      }

    };


  /* =======================================================
     NO CONVERSATION SELECTED
  ======================================================= */

  if (!selectedConversation) {

    return (

      <main className="admin-chart">

        <div className="admin-chart-container">

          <div className="admin-chart-empty">

            <div className="admin-chart-empty-content">

              <div
                className="
                  admin-chart-empty-icon
                "
                aria-hidden="true"
              >

                <MessageCircle
                  size={30}
                  strokeWidth={1.5}
                />

              </div>


              <h2>
                Start a conversation
              </h2>


              <p>
                Select a conversation from
                the sidebar to view messages
                and reply.
              </p>

            </div>

          </div>

        </div>

      </main>

    );

  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <main className="admin-chart">

      <div className="admin-chart-container">


        {/* =================================================
            CHAT HEADER
        ================================================= */}

        <header className="admin-chart-header">

          <div className="admin-chart-visitor">

            <div
              className="admin-chart-avatar"
              aria-hidden="true"
            >

              {(
                selectedConversation
                  .visitor_name ||
                "V"
              )
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="admin-chart-visitor-info">

              <h2>
                {
                  selectedConversation
                    .visitor_name ||
                  "Visitor"
                }
              </h2>


              <p>
                {
                  selectedConversation
                    .visitor_email ||
                  "No email provided"
                }
              </p>

            </div>

          </div>


          <div className="admin-chart-status">

            <span
              className="
                admin-chart-status-dot
              "
              aria-hidden="true"
            />

            <span>
              Live
            </span>

          </div>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="admin-chart-error"
            role="alert"
          >
            {error}
          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="admin-chart-loading">

            <RefreshCw
              className="admin-chart-spin"
              size={22}
              strokeWidth={1.7}
            />

            <span>
              Loading conversation...
            </span>

          </div>

        ) : (

          <>


            {/* =============================================
                MESSAGES
            ============================================= */}

            <div
              className="admin-chart-messages"
              role="log"
              aria-live="polite"
            >

              {messages.length === 0 ? (

                <div className="admin-chart-empty">

                  <div className="admin-chart-empty-content">

                    <div
                      className="
                        admin-chart-empty-icon
                      "
                      aria-hidden="true"
                    >

                      <MessageCircle
                        size={27}
                        strokeWidth={1.5}
                      />

                    </div>


                    <h2>
                      No messages yet
                    </h2>


                    <p>
                      Send a message to start
                      the conversation.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="admin-chart-message-list">

                  {messages.map(
                    (item) => {

                      const isAdmin =
                        item.sender ===
                        "admin";


                      const username =
                        getMessageUsername(
                          item
                        );


                      return (

                        <div
                          key={item.id}
                          className={`
                            admin-chart-message
                            ${
                              isAdmin
                                ? "admin-chart-message-admin"
                                : "admin-chart-message-visitor"
                            }
                          `}
                        >

                          <span
                            className="
                              admin-chart-message-username
                            "
                          >
                            {username}
                          </span>


                          <div
                            className="
                              admin-chart-message-bubble
                            "
                          >
                            {item.message}
                          </div>


                          <time
                            className="
                              admin-chart-message-time
                            "
                          >
                            {formatTime(
                              item.created_at
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


            {/* =============================================
                REPLY AREA
            ============================================= */}

            <form
              className="admin-chart-reply"

              onSubmit={(event) => {

                event.preventDefault();

                handleSend();

              }}
            >


              {/* =========================================
                  EMOJI PICKER
              ========================================= */}

              {emojiOpen && (

                <div
                  className="
                    admin-chart-emoji-picker
                  "
                  role="dialog"
                  aria-label="Emoji picker"
                >

                  {/* =====================================
                      SEARCH
                  ===================================== */}

                  <div
                    className="
                      admin-chart-emoji-header
                    "
                  >

                    <div
                      className="
                        admin-chart-emoji-search-wrap
                      "
                    >

                      <Search
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />

                      <input
                        type="text"
                        className="
                          admin-chart-emoji-search
                        "
                        value={emojiSearch}
                        onChange={(event) =>
                          setEmojiSearch(
                            event.target.value
                          )
                        }
                        placeholder="
                          Search emojis...
                        "
                        aria-label="
                          Search emojis
                        "
                      />

                    </div>


                    <button
                      type="button"
                      className="
                        admin-chart-emoji-close
                      "
                      onClick={
                        handleCloseEmoji
                      }
                      aria-label="
                        Close emoji picker
                      "
                    >

                      <X
                        size={15}
                        strokeWidth={1.8}
                      />

                    </button>

                  </div>


                  {/* =====================================
                      CATEGORIES
                  ===================================== */}

                  <div
                    className="
                      admin-chart-emoji-categories
                    "
                  >

                    {emojiCategories.map(
                      (category) => (

                        <button
                          key={category}
                          type="button"
                          className={`
                            admin-chart-emoji-category
                            ${
                              emojiCategory ===
                              category
                                ? "active"
                                : ""
                            }
                          `}
                          onClick={() => {

                            setEmojiCategory(
                              category
                            );

                            setEmojiSearch("");

                          }}
                        >
                          {category}
                        </button>

                      )
                    )}

                  </div>


                  {/* =====================================
                      EMOJI GRID
                  ===================================== */}

                  <div
                    className="
                      admin-chart-emoji-grid
                    "
                  >

                    {visibleEmojis.length ===
                    0 ? (

                      <div
                        className="
                          admin-chart-emoji-empty
                        "
                      >
                        No emojis found.
                      </div>

                    ) : (

                      visibleEmojis.map(
                        (emoji, index) => (

                          <button
                            key={`
                              ${emoji}-${index}
                            `}
                            type="button"
                            className="
                              admin-chart-emoji
                            "
                            onClick={() =>
                              handleEmojiClick(
                                emoji
                              )
                            }
                            aria-label={`
                              Insert ${emoji}
                            `}
                          >
                            {emoji}
                          </button>

                        )
                      )

                    )}

                  </div>

                </div>

              )}


              {/* =========================================
                  EMOJI BUTTON
              ========================================= */}

              <button
                type="button"
                className="
                  admin-chart-emoji-button
                "
                onClick={
                  handleToggleEmoji
                }
                disabled={sending}
                aria-label="
                  Open emoji picker
                "
                aria-expanded={
                  emojiOpen
                }
              >

                <Smile
                  size={18}
                  strokeWidth={1.8}
                />

              </button>


              {/* =========================================
                  MESSAGE INPUT
              ========================================= */}

              <textarea
                ref={inputRef}
                value={messageText}
                onChange={(event) =>
                  setMessageText(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="
                  Write a reply...
                "
                aria-label="
                  Write a reply
                "
                rows={1}
                disabled={sending}
              />


              {/* =========================================
                  SEND BUTTON
              ========================================= */}

              <button
                type="submit"
                className="
                  admin-chart-send
                "
                disabled={
                  sending ||
                  !messageText.trim()
                }
                aria-label="
                  Send message
                "
              >

                {sending ? (

                  <RefreshCw
                    className="
                      admin-chart-spin
                    "
                    size={17}
                    strokeWidth={1.8}
                  />

                ) : (

                  <Send
                    size={17}
                    strokeWidth={1.8}
                  />

                )}

              </button>

            </form>

          </>

        )}

      </div>

    </main>

  );

}
