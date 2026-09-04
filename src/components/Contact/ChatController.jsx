import { useEffect, useRef, useState } from "react";

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
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  LogOut,
  Volume2,
  VolumeX,
} from "lucide-react";

import chatController from "../../javascript/contact/chatController";

import {
  getEmojiCategories,
  getEmojisByCategory,
  searchEmojis,
} from "../../javascript/utils/emojis/emojis";



/* =========================================================
   VISITOR CHAT CONTROLLER
========================================================= */

export default function ChatController() {

  /* =======================================================
     CHAT STATE
  ======================================================= */

  const [chatState, setChatState] = useState(
    chatController.getState()
  );


  /* =======================================================
     START FORM
  ======================================================= */

  const [visitorName, setVisitorName] =
    useState("");

  const [visitorEmail, setVisitorEmail] =
    useState("");

  const [startMessage, setStartMessage] =
    useState("");

  const [startingChat, setStartingChat] =
    useState(false);


  /* =======================================================
     TEXT MESSAGE
  ======================================================= */

  const [messageText, setMessageText] =
    useState("");


  /* =======================================================
     UI
  ======================================================= */

  const [fullscreen, setFullscreen] =
    useState(false);

  const [emojiOpen, setEmojiOpen] =
    useState(false);

  const [emojiSearch, setEmojiSearch] =
    useState("");

  const [emojiCategory, setEmojiCategory] =
    useState("Smileys");


  /* =======================================================
     AUDIO PREVIEW
  ======================================================= */

  const [audioPlaying, setAudioPlaying] =
    useState(false);

  const [audioError, setAudioError] =
    useState("");


  /* =======================================================
     MESSAGE AUDIO
  ======================================================= */

  const [playingAudioId, setPlayingAudioId] =
    useState(null);

  const [mutedAudioId, setMutedAudioId] =
    useState(null);


  /* =======================================================
     END CONVERSATION
  ======================================================= */

  const [endConversationOpen, setEndConversationOpen] =
    useState(false);

  const [endingConversation, setEndingConversation] =
    useState(false);


  /* =======================================================
     REFS
  ======================================================= */

  const messagesEndRef =
    useRef(null);

  const inputRef =
    useRef(null);

  const previewAudioRef =
    useRef(null);

  const audioRefs =
    useRef({});


  /* =========================================================
     INITIALIZE
  ========================================================= */

  useEffect(() => {

    let mounted = true;


    const initialize = async () => {

      try {

        await chatController.initialize();

      } catch (error) {

        console.error(
          "Chat initialization failed:",
          error
        );

      }

    };


    initialize();


    const unsubscribe =
      chatController.subscribe(
        (nextState) => {

          if (mounted) {

            setChatState(
              nextState
            );

          }

        }
      );


    return () => {

      mounted = false;

      unsubscribe();

    };

  }, []);


  /* =========================================================
     CLEANUP AUDIO
  ========================================================= */

  useEffect(() => {

    return () => {

      Object.values(
        audioRefs.current
      ).forEach((audio) => {

        if (audio) {

          audio.pause();

        }

      });


      if (
        previewAudioRef.current
      ) {

        previewAudioRef.current.pause();

      }

    };

  }, []);


  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {

    if (!chatState.isOpen) {
      return;
    }


    requestAnimationFrame(() => {

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

    });

  }, [
    chatState.messages,
    chatState.isOpen,
  ]);


  /* =========================================================
     CLOSE EMOJIS WHEN CONVERSATION CHANGES
  ========================================================= */

  useEffect(() => {

    setEmojiOpen(false);

    setEmojiSearch("");

  }, [
    chatState.conversation?.id,
  ]);


  /* =========================================================
     OPEN CHAT
  ========================================================= */

  const handleOpen = () => {

    chatController.open();

  };


  /* =========================================================
     CLOSE CHAT
  ========================================================= */

  const handleClose = () => {

    setEmojiOpen(false);

    setEndConversationOpen(false);

    chatController.close();

  };


  /* =========================================================
     FULLSCREEN
  ========================================================= */

  const handleFullscreen = () => {

    setFullscreen(
      (current) => !current
    );

  };


  /* =========================================================
     START CONVERSATION
  ========================================================= */

  const handleStartConversation =
    async (event) => {

      event.preventDefault();


      if (startingChat) {
        return;
      }


      const cleanName =
        visitorName.trim();

      const cleanEmail =
        visitorEmail.trim();

      const cleanMessage =
        startMessage.trim();


      if (!cleanName) {

        chatController.setError(
          "Please enter your name."
        );

        return;

      }


      try {

        setStartingChat(true);

        chatController.clearError();


        chatController.setVisitor({
          visitorName:
            cleanName,

          visitorEmail:
            cleanEmail,
        });


        await chatController.startConversation({
          visitorName:
            cleanName,

          visitorEmail:
            cleanEmail,
        });


        /*
          Send the first message after
          the conversation has been created.
        */

        if (cleanMessage) {

          await chatController.sendMessage(
            cleanMessage
          );

        }


        setVisitorName("");

        setVisitorEmail("");

        setStartMessage("");

      } catch (error) {

        console.error(
          "Failed to start conversation:",
          error
        );

        chatController.setError(
          error?.message ||
          "Unable to start the conversation."
        );

      } finally {

        setStartingChat(false);

      }

    };


  /* =========================================================
     SEND TEXT MESSAGE
  ========================================================= */

  const handleSendMessage =
    async () => {

      const cleanMessage =
        messageText.trim();


      if (
        !cleanMessage ||
        chatState.sending ||
        !chatState.conversation?.id
      ) {

        return;

      }


      try {

        chatController.clearError();


        /*
          IMPORTANT:
          Keep the input until the send succeeds.
        */

        await chatController.sendMessage(
          cleanMessage
        );


        setMessageText("");

        setEmojiOpen(false);


        requestAnimationFrame(() => {

          inputRef.current?.focus();

        });

      } catch (error) {

        console.error(
          "Failed to send message:",
          error
        );

        chatController.setError(
          error?.message ||
          "Failed to send message."
        );

      }

    };


  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown =
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSendMessage();

      }

    };


  /* =========================================================
     EMOJI DATA
  ========================================================= */

  const emojiCategories =
    getEmojiCategories();


  const visibleEmojis =
    emojiSearch.trim()

      ? searchEmojis(
          emojiSearch.trim()
        )

      : getEmojisByCategory(
          emojiCategory
        );


  /* =========================================================
     SELECT EMOJI
  ========================================================= */

  const handleEmojiSelect =
    (emoji) => {

      setMessageText(
        (current) =>
          `${current}${emoji}`
      );


      requestAnimationFrame(() => {

        inputRef.current?.focus();

      });

    };


  /* =========================================================
     TOGGLE EMOJI PICKER
  ========================================================= */

  const handleToggleEmoji =
    () => {

      setEmojiOpen(
        (current) => !current
      );

      setEmojiSearch("");

    };


  /* =========================================================
     CLOSE EMOJI PICKER
  ========================================================= */

  const handleCloseEmoji =
    () => {

      setEmojiOpen(false);

      setEmojiSearch("");


      requestAnimationFrame(() => {

        inputRef.current?.focus();

      });

    };


  /* =========================================================
     START RECORDING
  ========================================================= */

  const handleStartRecording =
    async () => {

      if (
        chatState.recording ||
        chatState.sending
      ) {

        return;

      }


      try {

        setAudioError("");

        setEmojiOpen(false);

        await chatController.startRecording();

      } catch (error) {

        console.error(
          "Failed to start recording:",
          error
        );

        setAudioError(
          error?.message ||
          "Microphone access was denied."
        );

      }

    };


  /* =========================================================
     STOP RECORDING
  ========================================================= */

  const handleStopRecording =
    () => {

      try {

        chatController.stopRecording();

      } catch (error) {

        console.error(
          "Failed to stop recording:",
          error
        );

        setAudioError(
          error?.message ||
          "Unable to stop recording."
        );

      }

    };


  /* =========================================================
     CANCEL RECORDING
  ========================================================= */

  const handleCancelRecording =
    () => {

      try {

        chatController.cancelRecording();

        setAudioError("");

      } catch (error) {

        console.error(
          "Failed to cancel recording:",
          error
        );

      }

    };


  /* =========================================================
     SEND RECORDED VOICE
  ========================================================= */

  const handleSendVoice =
    async () => {

      if (
        !chatState.voiceBlob ||
        chatState.sending
      ) {

        return;

      }


      try {

        setAudioError("");

        await chatController.sendRecordedVoice();

      } catch (error) {

        console.error(
          "Failed to send voice message:",
          error
        );

        setAudioError(
          error?.message ||
          "Failed to send voice message."
        );

      }

    };


  /* =========================================================
     PLAY PREVIEW
  ========================================================= */

  const handlePreviewAudio =
    async () => {

      if (
        !chatState.voicePreviewUrl
      ) {

        return;

      }


      if (
        !previewAudioRef.current
      ) {

        previewAudioRef.current =
          new Audio(
            chatState.voicePreviewUrl
          );


        previewAudioRef.current.onended =
          () => {

            setAudioPlaying(false);

          };

      }


      try {

        if (audioPlaying) {

          previewAudioRef.current.pause();

          setAudioPlaying(false);

        } else {

          await previewAudioRef.current.play();

          setAudioPlaying(true);

        }

      } catch (error) {

        console.error(
          "Preview playback failed:",
          error
        );

        setAudioError(
          "Unable to play the recording."
        );

      }

    };


  /* =========================================================
     DELETE VOICE PREVIEW
  ========================================================= */

  const handleDeleteVoice =
    () => {

      if (
        previewAudioRef.current
      ) {

        previewAudioRef.current.pause();

        previewAudioRef.current = null;

      }


      setAudioPlaying(false);

      setAudioError("");

      chatController.clearVoicePreview();

    };


  /* =========================================================
     PLAY / PAUSE MESSAGE AUDIO
  ========================================================= */

  const toggleAudioPlay =
    async (message) => {

      const audio =
        audioRefs.current[
          message.id
        ];


      if (!audio) {
        return;
      }


      /*
        Pause every other voice message.
      */

      Object.entries(
        audioRefs.current
      ).forEach(
        ([id, item]) => {

          if (
            item &&
            id !== String(message.id)
          ) {

            item.pause();

            item.currentTime = 0;

          }

        }
      );


      if (
        playingAudioId ===
        message.id
      ) {

        audio.pause();

        setPlayingAudioId(null);

        return;

      }


      try {

        await audio.play();

        setPlayingAudioId(
          message.id
        );

      } catch (error) {

        console.error(
          "Voice playback failed:",
          error
        );

        setAudioError(
          "Unable to play this voice message."
        );

      }

    };


  /* =========================================================
     MUTE / UNMUTE MESSAGE AUDIO
  ========================================================= */

  const toggleAudioMute =
    (message) => {

      const audio =
        audioRefs.current[
          message.id
        ];


      if (!audio) {
        return;
      }


      audio.muted =
        !audio.muted;


      setMutedAudioId(
        audio.muted
          ? message.id
          : null
      );

    };


  /* =========================================================
     END CONVERSATION
  ========================================================= */

  const handleEndConversation =
    async () => {

      if (endingConversation) {
        return;
      }


      try {

        setEndingConversation(true);

        chatController.clearError();


        await chatController.endConversation();


        setEndConversationOpen(false);

        setMessageText("");

        setEmojiOpen(false);

        setFullscreen(false);

      } catch (error) {

        console.error(
          "Failed to end conversation:",
          error
        );

        chatController.setError(
          error?.message ||
          "Unable to end the conversation."
        );

      } finally {

        setEndingConversation(false);

      }

    };


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime =
    (date) => {

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


  /* =========================================================
     MESSAGE RENDERER
  ========================================================= */

  const renderMessage =
    (item) => {

      const isAdmin =
        item.sender === "admin";

      const isAudio =
        item.message_type === "audio";


      return (

        <div
          key={item.id}
          className={`chat-controller-message ${
            isAdmin
              ? "chat-controller-message-admin"
              : "chat-controller-message-visitor"
          }`}
        >

          {/* =================================================
              MESSAGE LABEL
          ================================================= */}

          <div
            className="chat-controller-message-label"
          >
            {isAdmin
              ? "Nathan"
              : (
                chatState.conversation
                  ?.visitor_name ||
                "You"
              )}
          </div>


          {/* =================================================
              MESSAGE BUBBLE
          ================================================= */}

          <div
            className="chat-controller-message-bubble"
          >

            {isAudio ? (

              item.audio_url ? (

                <div
                  className="chat-message-audio-player"
                >

                  {/* Hidden native audio element */}

                  <audio
                    ref={(element) => {

                      if (element) {

                        audioRefs.current[
                          item.id
                        ] = element;

                      } else {

                        delete audioRefs.current[
                          item.id
                        ];

                      }

                    }}
                    preload="metadata"
                    src={item.audio_url}
                    onEnded={() => {

                      setPlayingAudioId(
                        null
                      );

                    }}
                    onError={() => {

                      setAudioError(
                        "This voice message is unavailable."
                      );

                    }}
                  />


                  {/* Play / Pause */}

                  <button
                    type="button"
                    className="chat-audio-play-button"
                    onClick={() =>
                      toggleAudioPlay(
                        item
                      )
                    }
                    aria-label={
                      playingAudioId ===
                      item.id
                        ? "Pause voice message"
                        : "Play voice message"
                    }
                  >

                    {playingAudioId ===
                    item.id ? (

                      <Pause
                        size={17}
                        strokeWidth={2}
                      />

                    ) : (

                      <Play
                        size={17}
                        strokeWidth={2}
                      />

                    )}

                  </button>


                  {/* Audio information */}

                  <div
                    className="chat-audio-info"
                  >

                    <span
                      className="chat-audio-title"
                    >
                      Voice message
                    </span>

                    <span
                      className="chat-audio-status"
                    >
                      {playingAudioId ===
                      item.id
                        ? "Playing..."
                        : "Tap to play"}
                    </span>

                  </div>


                  {/* Mute / Unmute */}

                  <button
                    type="button"
                    className="chat-audio-mute-button"
                    onClick={() =>
                      toggleAudioMute(
                        item
                      )
                    }
                    aria-label={
                      mutedAudioId ===
                      item.id
                        ? "Unmute voice message"
                        : "Mute voice message"
                    }
                  >

                    {mutedAudioId ===
                    item.id ? (

                      <VolumeX
                        size={17}
                        strokeWidth={1.8}
                      />

                    ) : (

                      <Volume2
                        size={17}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>

                </div>

              ) : (

                <span
                  className="chat-audio-unavailable"
                >
                  Voice message unavailable
                </span>

              )

            ) : (

              /*
                IMPORTANT:
                Text messages always render
                item.message.
              */

              <span
                className="chat-message-text"
              >
                {item.message || ""}
              </span>

            )}

          </div>


          {/* =================================================
              TIME
          ================================================= */}

          <time>
            {formatTime(
              item.created_at
            )}
          </time>

        </div>

      );

    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      {/* ===================================================
          CHAT LAUNCHER
      =================================================== */}

      {!chatState.isOpen && (

        <button
          type="button"
          className="chat-launcher"
          onClick={handleOpen}
          aria-label="Open chat"
        >

          <MessageCircle
            size={23}
            strokeWidth={1.8}
          />

          {chatState.messages.length > 0 && (
            <span
              className="chat-launcher-dot"
            />
          )}

        </button>

      )}


      {/* ===================================================
          CHAT WINDOW
      =================================================== */}

      {chatState.isOpen && (

        <section
          className={`chat-controller ${
            fullscreen
              ? "chat-controller-fullscreen"
              : ""
          }`}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="chat-controller-header"
          >

            <div
              className="chat-controller-user"
            >

              <div
                className="chat-controller-avatar"
              >

                <MessageCircle
                  size={18}
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


            <div
              className="chat-controller-header-actions"
            >

              <button
                type="button"
                className="chat-controller-icon-button"
                onClick={
                  handleFullscreen
                }
                aria-label={
                  fullscreen
                    ? "Exit fullscreen"
                    : "Enter fullscreen"
                }
              >

                {fullscreen ? (

                  <Minimize2
                    size={17}
                  />

                ) : (

                  <Maximize2
                    size={17}
                  />

                )}

              </button>


              <button
                type="button"
                className="chat-controller-icon-button"
                onClick={
                  handleClose
                }
                aria-label="Close chat"
              >

                <X
                  size={18}
                />

              </button>

            </div>

          </header>


          {/* =================================================
              START FORM
          ================================================= */}

          {!chatState.conversation?.id ? (

            <div
              className="chat-controller-start"
            >

              <div
                className="chat-controller-start-icon"
              >

                <MessageCircle
                  size={28}
                  strokeWidth={1.5}
                />

              </div>


              <h2>
                Let's talk
              </h2>


              <p>
                Leave your details and
                send a message to start
                a conversation.
              </p>


              <form
                onSubmit={
                  handleStartConversation
                }
              >

                <label>

                  <User
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      visitorName
                    }
                    onChange={(event) =>
                      setVisitorName(
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />

                </label>


                <label>

                  <Mail
                    size={15}
                  />

                  <input
                    type="email"
                    value={
                      visitorEmail
                    }
                    onChange={(event) =>
                      setVisitorEmail(
                        event.target.value
                      )
                    }
                    placeholder="Your email"
                    autoComplete="email"
                  />

                </label>


                <textarea
                  value={
                    startMessage
                  }
                  onChange={(event) =>
                    setStartMessage(
                      event.target.value
                    )
                  }
                  placeholder="Write your first message..."
                  rows={4}
                  required
                />


                {chatState.error && (

                  <div
                    className="chat-controller-error"
                  >
                    {chatState.error}
                  </div>

                )}


                <button
                  type="submit"
                  className="chat-controller-start-button"
                  disabled={
                    startingChat
                  }
                >

                  {startingChat ? (

                    <RefreshCw
                      size={17}
                      className="chat-controller-spin"
                    />

                  ) : (

                    <Send
                      size={17}
                    />

                  )}

                  <span>
                    Start Conversation
                  </span>

                </button>

              </form>

            </div>

          ) : (

            /* =================================================
               ACTIVE CHAT
            ================================================= */

            <>

              {/* ===============================================
                  MESSAGES
              =============================================== */}

              <div
                className="chat-controller-messages"
              >

                {chatState.loading ? (

                  <div
                    className="chat-controller-loading"
                  >

                    <RefreshCw
                      size={20}
                      className="chat-controller-spin"
                    />

                    <span>
                      Loading conversation...
                    </span>

                  </div>

                ) : chatState.messages.length === 0 ? (

                  <div
                    className="chat-controller-empty"
                  >

                    <MessageCircle
                      size={25}
                      strokeWidth={1.5}
                    />

                    <p>
                      No messages yet.
                    </p>

                    <span>
                      Send a message to
                      start the conversation.
                    </span>

                  </div>

                ) : (

                  <div
                    className="chat-controller-message-list"
                  >

                    {chatState.messages.map(
                      renderMessage
                    )}

                    <div
                      ref={messagesEndRef}
                      aria-hidden="true"
                    />

                  </div>

                )}

              </div>


              {/* ===============================================
                  GENERAL ERROR
              =============================================== */}

              {chatState.error && (

                <div
                  className="chat-controller-error"
                >

                  <span>
                    {chatState.error}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      chatController.clearError()
                    }
                    aria-label="Close error"
                  >

                    <X
                      size={14}
                    />

                  </button>

                </div>

              )}


              {/* ===============================================
                  AUDIO ERROR
              =============================================== */}

              {audioError && (

                <div
                  className="chat-controller-voice-error"
                >

                  <span>
                    {audioError}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setAudioError("")
                    }
                    aria-label="Close audio error"
                  >

                    <X
                      size={13}
                    />

                  </button>

                </div>

              )}


              {/* ===============================================
                  EMOJI PICKER
              =============================================== */}

              {emojiOpen && (

                <div
                  className="chat-controller-emoji-picker"
                >

                  <div
                    className="chat-controller-emoji-header"
                  >

                    <div>

                      <strong>
                        Emojis
                      </strong>

                      <span>
                        Choose an emoji
                      </span>

                    </div>


                    {/* =========================================
                        CLOSE EMOJI BUTTON
                    ========================================= */}

                    <button
                      type="button"
                      className="chat-controller-emoji-close"
                      onClick={
                        handleCloseEmoji
                      }
                      aria-label="Close emoji picker"
                      title="Close emoji picker"
                    >

                      <X
                        size={17}
                        strokeWidth={2}
                      />

                    </button>

                  </div>


                  <input
                    type="search"
                    className="chat-controller-emoji-search"
                    value={
                      emojiSearch
                    }
                    onChange={(event) =>
                      setEmojiSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search emojis..."
                    aria-label="Search emojis"
                  />


                  {!emojiSearch && (

                    <div
                      className="chat-controller-emoji-categories"
                    >

                      {emojiCategories.map(
                        (category) => (

                          <button
                            key={
                              category
                            }
                            type="button"
                            className={`chat-controller-emoji-category ${
                              emojiCategory ===
                              category
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setEmojiCategory(
                                category
                              )
                            }
                          >
                            {category}
                          </button>

                        )
                      )}

                    </div>

                  )}


                  <div
                    className="chat-controller-emoji-grid"
                  >

                    {visibleEmojis.length === 0 ? (

                      <span
                        className="chat-controller-emoji-empty"
                      >
                        No emojis found.
                      </span>

                    ) : (

                      visibleEmojis.map(
                        (emoji) => (

                          <button
                            key={emoji}
                            type="button"
                            className="chat-controller-emoji-item"
                            onClick={() =>
                              handleEmojiSelect(
                                emoji
                              )
                            }
                            aria-label={`Insert ${emoji}`}
                          >
                            {emoji}
                          </button>

                        )
                      )

                    )}

                  </div>

                </div>

              )}


              {/* ===============================================
                  NORMAL REPLY
              =============================================== */}

              {!chatState.recording &&
              !chatState.voiceBlob && (

                <form
                  className="chat-controller-reply"
                  onSubmit={(event) => {

                    event.preventDefault();

                    handleSendMessage();

                  }}
                >

                  <button
                    type="button"
                    className="chat-controller-reply-button"
                    onClick={
                      handleToggleEmoji
                    }
                    aria-label={
                      emojiOpen
                        ? "Close emoji picker"
                        : "Open emoji picker"
                    }
                    title={
                      emojiOpen
                        ? "Close emoji picker"
                        : "Emoji"
                    }
                  >

                    {emojiOpen ? (

                      <X
                        size={19}
                        strokeWidth={1.8}
                      />

                    ) : (

                      <Smile
                        size={19}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>


                  <textarea
                    ref={inputRef}
                    value={
                      messageText
                    }
                    onChange={(event) =>
                      setMessageText(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    placeholder="Write a message..."
                    rows={1}
                    disabled={
                      chatState.sending
                    }
                    aria-label="Write a message"
                  />


                  <button
                    type="button"
                    className="chat-controller-mic-button"
                    onClick={
                      handleStartRecording
                    }
                    disabled={
                      chatState.sending
                    }
                    aria-label="Record voice message"
                    title="Voice message"
                  >

                    <Mic
                      size={18}
                      strokeWidth={1.8}
                    />

                  </button>


                  <button
                    type="submit"
                    className="chat-controller-send-button"
                    disabled={
                      chatState.sending ||
                      !messageText.trim()
                    }
                    aria-label="Send message"
                    title="Send message"
                  >

                    {chatState.sending ? (

                      <RefreshCw
                        size={17}
                        className="chat-controller-spin"
                      />

                    ) : (

                      <Send
                        size={17}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>

                </form>

              )}


              {/* ===============================================
                  RECORDING
              =============================================== */}

              {chatState.recording && (

                <div
                  className="chat-controller-voice-area"
                >

                  <div
                    className="chat-controller-recording"
                  >

                    <div
                      className="chat-controller-recording-indicator"
                    >

                      <span />

                      <strong>
                        Recording
                      </strong>

                      <time>
                        {Math.floor(
                          chatState.recordingDuration /
                          60
                        )
                          .toString()
                          .padStart(2, "0")}

                        :

                        {(chatState.recordingDuration %
                          60)
                          .toString()
                          .padStart(2, "0")}
                      </time>

                    </div>


                    <div
                      className="chat-controller-recording-actions"
                    >

                      <button
                        type="button"
                        className="chat-controller-record-stop"
                        onClick={
                          handleStopRecording
                        }
                      >

                        <Square
                          size={15}
                          fill="currentColor"
                        />

                        <span>
                          Stop
                        </span>

                      </button>


                      <button
                        type="button"
                        className="chat-controller-record-cancel"
                        onClick={
                          handleCancelRecording
                        }
                      >

                        <X
                          size={15}
                        />

                        <span>
                          Cancel
                        </span>

                      </button>

                    </div>

                  </div>

                </div>

              )}


              {/* ===============================================
                  VOICE PREVIEW
              =============================================== */}

              {!chatState.recording &&
              chatState.voiceBlob && (

                <div
                  className="chat-controller-voice-area"
                >

                  <div
                    className="chat-controller-voice-preview"
                  >

                    <div
                      className="chat-controller-voice-preview-info"
                    >

                      <Mic
                        size={18}
                      />

                      <div>

                        <strong>
                          Voice message
                        </strong>

                        <span>
                          Ready to send
                        </span>

                      </div>

                    </div>


                    <div
                      className="chat-controller-voice-preview-controls"
                    >

                      <button
                        type="button"
                        className="chat-controller-audio-play"
                        onClick={
                          handlePreviewAudio
                        }
                        aria-label={
                          audioPlaying
                            ? "Pause recording"
                            : "Play recording"
                        }
                      >

                        {audioPlaying ? (

                          <Pause
                            size={16}
                          />

                        ) : (

                          <Play
                            size={16}
                          />

                        )}

                      </button>


                      <button
                        type="button"
                        className="chat-controller-audio-delete"
                        onClick={
                          handleDeleteVoice
                        }
                        aria-label="Delete recording"
                      >

                        <Trash2
                          size={16}
                        />

                      </button>


                      <button
                        type="button"
                        className="chat-controller-audio-send"
                        onClick={
                          handleSendVoice
                        }
                        disabled={
                          chatState.sending
                        }
                        aria-label="Send voice message"
                      >

                        {chatState.sending ? (

                          <RefreshCw
                            size={16}
                            className="chat-controller-spin"
                          />

                        ) : (

                          <Send
                            size={16}
                          />

                        )}

                      </button>

                    </div>

                  </div>

                </div>

              )}


              {/* ===============================================
                  END CONVERSATION BUTTON
              =============================================== */}

              <button
                type="button"
                className="chat-controller-end-button"
                onClick={() =>
                  setEndConversationOpen(
                    true
                  )
                }
              >

                <LogOut
                  size={15}
                />

                <span>
                  End Conversation
                </span>

              </button>


              {/* ===============================================
                  END CONVERSATION MODAL
              =============================================== */}

              {endConversationOpen && (

                <div
                  className="chat-controller-modal-backdrop"
                  role="presentation"
                  onClick={() =>
                    setEndConversationOpen(
                      false
                    )
                  }
                >

                  <div
                    className="chat-controller-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="chat-end-title"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <div
                      className="chat-controller-modal-icon"
                    >

                      <LogOut
                        size={22}
                      />

                    </div>


                    <h3
                      id="chat-end-title"
                    >
                      End conversation?
                    </h3>


                    <p>
                      This will close your
                      current conversation.
                    </p>


                    <div
                      className="chat-controller-modal-actions"
                    >

                      <button
                        type="button"
                        className="chat-controller-modal-cancel"
                        onClick={() =>
                          setEndConversationOpen(
                            false
                          )
                        }
                        disabled={
                          endingConversation
                        }
                      >
                        Cancel
                      </button>


                      <button
                        type="button"
                        className="chat-controller-modal-confirm"
                        onClick={
                          handleEndConversation
                        }
                        disabled={
                          endingConversation
                        }
                      >

                        {endingConversation ? (

                          <RefreshCw
                            size={15}
                            className="chat-controller-spin"
                          />

                        ) : (

                          "End Conversation"

                        )}

                      </button>

                    </div>

                  </div>

                </div>

              )}

            </>

          )}

        </section>

      )}

    </>
  );
}
