import {
  useEffect,
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
  Smile,
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  LogOut,
  User,
  Mail,
  Paperclip,
  FileText,
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
     START CHAT FORM
  ======================================================= */

  const [visitorName, setVisitorName] =
    useState("");

  const [visitorEmail, setVisitorEmail] =
    useState("");

  const [startMessage, setStartMessage] =
    useState("");

  const [startingChat, setStartingChat] =
    useState(false);

  const [startError, setStartError] =
    useState("");


  /* =======================================================
     MESSAGE INPUT
  ======================================================= */

  const [messageText, setMessageText] =
    useState("");


  /* =======================================================
     UI STATE
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
     CHAT LAUNCHER INTRO
  ======================================================= */

  const [launcherIntro, setLauncherIntro] =
    useState(true);


  /* =======================================================
     VOICE STATE
  ======================================================= */

  const [recording, setRecording] =
    useState(false);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const [audioBlob, setAudioBlob] =
    useState(null);

  const [audioPreviewUrl, setAudioPreviewUrl] =
    useState("");

  const [audioPlaying, setAudioPlaying] =
    useState(false);

  const [voiceSending, setVoiceSending] =
    useState(false);

  const [voiceError, setVoiceError] =
    useState("");


  /* =======================================================
     FILE UPLOAD STATE
  ======================================================= */

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [filePreviewUrl, setFilePreviewUrl] =
    useState("");

  const [fileSending, setFileSending] =
    useState(false);

  const [fileError, setFileError] =
    useState("");

  const [isDraggingFile, setIsDraggingFile] =
    useState(false);


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

  const mediaRecorderRef =
    useRef(null);

  const mediaStreamRef =
    useRef(null);

  const recordingTimerRef =
    useRef(null);

  const audioPreviewRef =
    useRef(null);

  const discardRecordingRef =
    useRef(false);

  const fileInputRef =
    useRef(null);


  const MAX_FILE_SIZE =
    10 * 1024 * 1024;

  const ACCEPTED_FILES =
    "image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx,.zip";


  /* =======================================================
     CONTROLLER SUBSCRIPTION
  ======================================================= */

  useEffect(() => {

    const unsubscribe =
      chatController.subscribe(
        (state) => {

          setChatState(state);

        }
      );


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
     INITIALIZE CONTROLLER
  ======================================================= */

  useEffect(() => {

    if (
      typeof chatController.initialize ===
      "function"
    ) {

      chatController.initialize();

    }

  }, []);


  /* =======================================================
     CHAT LAUNCHER INTRO TIMER
  ======================================================= */

  useEffect(() => {

    const timer =
      window.setTimeout(() => {

        setLauncherIntro(false);

      }, 1100);


    return () => {

      window.clearTimeout(timer);

    };

  }, []);


  /* =======================================================
     RESTORE VISITOR INFORMATION
  ======================================================= */

  useEffect(() => {

    const stored =
      chatState?.conversation;


    if (!stored) {

      return;

    }


    if (
      stored.visitor_name &&
      !visitorName
    ) {

      setVisitorName(
        stored.visitor_name
      );

    }


    if (
      stored.visitor_email &&
      !visitorEmail
    ) {

      setVisitorEmail(
        stored.visitor_email
      );

    }

  }, [
    chatState?.conversation,
  ]);


  /* =======================================================
     KEEP LOCAL MESSAGE INPUT
  ======================================================= */

  useEffect(() => {

    if (
      chatState?.status ===
      "closed"
    ) {

      setMessageText("");

    }

  }, [
    chatState?.status,
  ]);


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key !==
          "Escape"
        ) {

          return;

        }


        if (
          endConversationOpen &&
          !endingConversation
        ) {

          setEndConversationOpen(
            false
          );

          return;

        }


        if (emojiOpen) {

          setEmojiOpen(false);

          return;

        }


        if (fullscreen) {

          setFullscreen(false);

        }

      };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [
    endConversationOpen,
    endingConversation,
    emojiOpen,
    fullscreen,
  ]);


  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    chatState?.messages,
  ]);


  /* =======================================================
     RECORDING TIMER
  ======================================================= */

  useEffect(() => {

    if (!recording) {

      if (
        recordingTimerRef.current
      ) {

        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current =
          null;

      }

      return;

    }


    recordingTimerRef.current =
      setInterval(() => {

        setRecordingSeconds(
          (value) =>
            value + 1
        );

      }, 1000);


    return () => {

      if (
        recordingTimerRef.current
      ) {

        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current =
          null;

      }

    };

  }, [
    recording,
  ]);


  /* =======================================================
     FORMAT RECORDING TIME
  ======================================================= */

  const formatRecordingTime =
    (seconds) => {

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remaining =
        seconds % 60;


      return (
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remaining).padStart(2, "0")}`
      );

    };


  /* =======================================================
     FORMAT FILE SIZE
  ======================================================= */

  const formatFileSize =
    (bytes) => {

      if (
        !bytes &&
        bytes !== 0
      ) {

        return "";

      }


      if (
        bytes < 1024
      ) {

        return `${bytes} B`;

      }


      if (
        bytes < 1024 * 1024
      ) {

        return `${(
          bytes / 1024
        ).toFixed(1)} KB`;

      }


      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;

    };


  /* =======================================================
     CLEAR AUDIO PREVIEW
  ======================================================= */

  const clearAudioPreview =
    () => {

      if (
        audioPreviewRef.current
      ) {

        audioPreviewRef.current.pause();

        audioPreviewRef.current =
          null;

      }


      if (
        audioPreviewUrl
      ) {

        URL.revokeObjectURL(
          audioPreviewUrl
        );

      }


      setAudioPreviewUrl("");

      setAudioBlob(null);

      setAudioPlaying(false);

    };


  /* =======================================================
     CLEAR FILE PREVIEW
  ======================================================= */

  const clearFilePreview =
    () => {

      if (
        filePreviewUrl
      ) {

        URL.revokeObjectURL(
          filePreviewUrl
        );

      }


      setSelectedFile(null);

      setFilePreviewUrl("");

      setFileSending(false);


      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

    };


  /* =======================================================
     STOP MEDIA STREAM
  ======================================================= */

  const stopMediaStream =
    () => {

      if (
        mediaStreamRef.current
      ) {

        mediaStreamRef.current
          .getTracks()
          .forEach(
            (track) => {

              track.stop();

            }
          );


        mediaStreamRef.current =
          null;

      }

    };


  /* =======================================================
     OPEN CHAT
  ======================================================= */

  const handleOpenChat =
    () => {

      setStartError("");

      setEmojiOpen(false);


      if (
        typeof chatController.open ===
        "function"
      ) {

        chatController.open();

        return;

      }


      if (
        typeof chatController.openChat ===
        "function"
      ) {

        chatController.openChat();

      }

    };


  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  const handleCloseChat =
    () => {

      setEmojiOpen(false);

      setFullscreen(false);

      setEndConversationOpen(false);


      if (
        typeof chatController.close ===
        "function"
      ) {

        chatController.close();

        return;

      }


      if (
        typeof chatController.closeChat ===
        "function"
      ) {

        chatController.closeChat();

      }

    };


  /* =======================================================
     START CONVERSATION
  ======================================================= */

  const handleStartConversation =
    async (event) => {

      event.preventDefault();


      const cleanName =
        visitorName.trim();

      const cleanEmail =
        visitorEmail.trim();

      const cleanMessage =
        startMessage.trim();


      if (!cleanName) {

        setStartError(
          "Please enter your name."
        );

        return;

      }


      if (!cleanEmail) {

        setStartError(
          "Please enter your email."
        );

        return;

      }


      if (!cleanMessage) {

        setStartError(
          "Please enter your message."
        );

        return;

      }


      setStartingChat(true);

      setStartError("");


      try {

        if (
          typeof chatController.startConversation ===
          "function"
        ) {

          await chatController.startConversation({
            visitorName:
              cleanName,

            visitorEmail:
              cleanEmail,

            message:
              cleanMessage,
          });

        } else if (
          typeof chatController.startChat ===
          "function"
        ) {

          await chatController.startChat({
            visitorName:
              cleanName,

            visitorEmail:
              cleanEmail,

            message:
              cleanMessage,
          });

        } else if (
          typeof chatController.createConversation ===
          "function"
        ) {

          await chatController.createConversation({
            visitorName:
              cleanName,

            visitorEmail:
              cleanEmail,
          });


          if (
            typeof chatController.sendMessage ===
            "function"
          ) {

            await chatController.sendMessage(
              cleanMessage
            );

          }

        } else {

          throw new Error(
            "The chat controller does not have a conversation-start method."
          );

        }


        setStartMessage("");

        setMessageText("");

        inputRef.current?.focus();

      } catch (error) {

        console.error(
          "Failed to start conversation:",
          error
        );

        setStartError(
          error?.message ||
          "Unable to start the conversation."
        );

      } finally {

        setStartingChat(false);

      }

    };


  /* =======================================================
     MESSAGE INPUT CHANGE
  ======================================================= */

  const handleMessageChange =
    (event) => {

      setMessageText(
        event.target.value
      );

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
        chatState?.sending ||
        fileSending
      ) {

        return;

      }


      try {

        if (
          typeof chatController.sendMessage !==
          "function"
        ) {

          throw new Error(
            "Message sending is unavailable."
          );

        }


        await chatController.sendMessage(
          text
        );


        setMessageText("");

        setEmojiOpen(false);

        inputRef.current?.focus();

      } catch (error) {

        console.error(
          "Failed to send message:",
          error
        );

      }

    };


  /* =======================================================
     ENTER KEY
  ======================================================= */

  const handleMessageKeyDown =
    (event) => {

      if (
        event.key ===
        "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSendMessage();

      }

    };


  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry =
    async () => {

      try {

        if (
          typeof chatController.initialize ===
          "function"
        ) {

          await chatController.initialize();

        }

      } catch (error) {

        console.error(
          "Chat retry failed:",
          error
        );

      }

    };


  /* =======================================================
     EMOJI
  ======================================================= */

  const emojiCategories =
    getEmojiCategories();


  const emojis =
    emojiSearch.trim()
      ? searchEmojis(
          emojiSearch
        )
      : getEmojisByCategory(
          emojiCategory
        );


  const handleEmojiSelect =
    (emoji) => {

      setMessageText(
        (current) =>
          current + emoji
      );


      setEmojiOpen(false);

      inputRef.current?.focus();

    };


  /* =======================================================
     START RECORDING
  ======================================================= */

  const handleStartRecording =
    async () => {

      if (
        recording ||
        voiceSending ||
        fileSending ||
        selectedFile
      ) {

        return;

      }


      try {

        setVoiceError("");

        discardRecordingRef.current =
          false;


        if (
          !navigator.mediaDevices?.getUserMedia
        ) {

          throw new Error(
            "Voice recording is not supported by this browser."
          );

        }


        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          });


        mediaStreamRef.current =
          stream;


        const mimeTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/mp4",
          "audio/ogg",
        ];


        const supportedMime =
          mimeTypes.find(
            (type) =>
              typeof MediaRecorder !==
                "undefined" &&
              MediaRecorder.isTypeSupported(
                type
              )
          );


        const recorder =
          supportedMime
            ? new MediaRecorder(
                stream,
                {
                  mimeType:
                    supportedMime,
                }
              )
            : new MediaRecorder(
                stream
              );


        const chunks = [];


        recorder.ondataavailable =
          (event) => {

            if (
              event.data &&
              event.data.size > 0
            ) {

              chunks.push(
                event.data
              );

            }

          };


        recorder.onstop =
          () => {

            stopMediaStream();


            if (
              discardRecordingRef.current
            ) {

              discardRecordingRef.current =
                false;

              return;

            }


            const blob =
              new Blob(
                chunks,
                {
                  type:
                    recorder.mimeType ||
                    "audio/webm",
                }
              );


            if (
              blob.size === 0
            ) {

              setVoiceError(
                "No audio was recorded."
              );

              return;

            }


            const url =
              URL.createObjectURL(
                blob
              );


            setAudioBlob(
              blob
            );

            setAudioPreviewUrl(
              url
            );

          };


        recorder.start();


        mediaRecorderRef.current =
          recorder;

        setRecording(true);

        setRecordingSeconds(0);

      } catch (error) {

        console.error(
          "Microphone error:",
          error
        );

        stopMediaStream();

        setVoiceError(
          error?.message ||
          "Microphone access was denied or unavailable."
        );

      }

    };


  /* =======================================================
     FINISH RECORDING
  ======================================================= */

  const handleFinishRecording =
    () => {

      if (
        !mediaRecorderRef.current
      ) {

        return;

      }


      if (
        mediaRecorderRef.current.state !==
        "inactive"
      ) {

        mediaRecorderRef.current.stop();

      }


      mediaRecorderRef.current =
        null;

      setRecording(false);

    };


  /* =======================================================
     CANCEL RECORDING
  ======================================================= */

  const handleCancelRecording =
    () => {

      discardRecordingRef.current =
        true;


      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {

        mediaRecorderRef.current.stop();

      }


      mediaRecorderRef.current =
        null;


      stopMediaStream();

      setRecording(false);

      setRecordingSeconds(0);

      clearAudioPreview();

    };


  /* =======================================================
     PLAY / PAUSE VOICE PREVIEW
  ======================================================= */

  const handlePreviewToggle =
    () => {

      if (
        !audioPreviewUrl
      ) {

        return;

      }


      if (
        !audioPreviewRef.current
      ) {

        const audio =
          new Audio(
            audioPreviewUrl
          );


        audio.onended =
          () => {

            setAudioPlaying(
              false
            );

          };


        audioPreviewRef.current =
          audio;

      }


      const audio =
        audioPreviewRef.current;


      if (
        audio.paused
      ) {

        audio.play()
          .then(() => {

            setAudioPlaying(
              true
            );

          })
          .catch(
            (error) => {

              console.error(
                "Voice preview error:",
                error
              );

            }
          );

      } else {

        audio.pause();

        setAudioPlaying(false);

      }

    };


  /* =======================================================
     SEND VOICE
  ======================================================= */

  const handleSendVoice =
    async () => {

      if (
        !audioBlob ||
        voiceSending
      ) {

        return;

      }


      try {

        setVoiceSending(true);

        setVoiceError("");


        if (
          typeof chatController.sendVoiceMessage ===
          "function"
        ) {

          await chatController.sendVoiceMessage(
            audioBlob
          );

        } else if (
          typeof chatController.sendVoice ===
          "function"
        ) {

          await chatController.sendVoice(
            audioBlob
          );

        } else {

          throw new Error(
            "Voice messaging is unavailable."
          );

        }


        clearAudioPreview();

        setRecordingSeconds(0);

      } catch (error) {

        console.error(
          "Voice send error:",
          error
        );

        setVoiceError(
          error?.message ||
          "Failed to send voice message."
        );

      } finally {

        setVoiceSending(false);

      }

    };


  /* =======================================================
     FILE HELPERS
  ======================================================= */

  const isImageFile =
    (file) => {

      if (!file) {

        return false;

      }


      if (
        file.type &&
        file.type.startsWith(
          "image/"
        )
      ) {

        return true;

      }


      return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(
        file.name || ""
      );

    };


  const applySelectedFile =
    (file) => {

      if (!file) {

        return;

      }


      if (
        file.size >
        MAX_FILE_SIZE
      ) {

        setFileError(
          "That file is too large. Maximum size is 10 MB."
        );

        return;

      }


      clearFilePreview();

      setFileError("");

      setEmojiOpen(false);

      setSelectedFile(file);


      if (
        isImageFile(file)
      ) {

        setFilePreviewUrl(
          URL.createObjectURL(
            file
          )
        );

      }

    };


  /* =======================================================
     OPEN FILE PICKER
  ======================================================= */

  const handleOpenFilePicker =
    () => {

      if (
        recording ||
        voiceSending ||
        fileSending ||
        audioPreviewUrl
      ) {

        return;

      }


      fileInputRef.current?.click();

    };


  /* =======================================================
     FILE INPUT CHANGE
  ======================================================= */

  const handleFileInputChange =
    (event) => {

      const file =
        event.target.files?.[0];


      event.target.value =
        "";


      if (!file) {

        return;

      }


      applySelectedFile(file);

    };


  /* =======================================================
     DRAG AND DROP
  ======================================================= */

  const handleDragOver =
    (event) => {

      event.preventDefault();

      event.stopPropagation();


      if (
        recording ||
        audioPreviewUrl ||
        fileSending
      ) {

        return;

      }


      setIsDraggingFile(true);

    };


  const handleDragLeave =
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      setIsDraggingFile(false);

    };


  const handleDropFile =
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      setIsDraggingFile(false);


      if (
        recording ||
        audioPreviewUrl ||
        fileSending
      ) {

        return;

      }


      const file =
        event.dataTransfer?.files?.[0];


      if (!file) {

        return;

      }


      applySelectedFile(file);

    };


  /* =======================================================
     SEND FILE
  ======================================================= */

  const handleSendFile =
    async () => {

      if (
        !selectedFile ||
        fileSending
      ) {

        return;

      }


      try {

        setFileSending(true);

        setFileError("");


        if (
          typeof chatController.sendFileMessage ===
          "function"
        ) {

          await chatController.sendFileMessage(
            selectedFile
          );

        } else if (
          typeof chatController.sendFile ===
          "function"
        ) {

          await chatController.sendFile(
            selectedFile
          );

        } else if (
          typeof chatController.sendAttachment ===
          "function"
        ) {

          await chatController.sendAttachment(
            selectedFile
          );

        } else if (
          typeof chatController.uploadFile ===
          "function"
        ) {

          await chatController.uploadFile(
            selectedFile
          );

        } else {

          throw new Error(
            "File upload is unavailable."
          );

        }


        clearFilePreview();

      } catch (error) {

        console.error(
          "File send error:",
          error
        );

        setFileError(
          error?.message ||
          "Failed to send file."
        );

      } finally {

        setFileSending(false);

      }

    };


  /* =======================================================
     OPEN END CONVERSATION
  ======================================================= */

  const handleOpenEndConversation =
    () => {

      if (
        endingConversation
      ) {

        return;

      }


      setEmojiOpen(false);

      setEndConversationOpen(true);

    };


  /* =======================================================
     CANCEL END CONVERSATION
  ======================================================= */

  const handleCancelEndConversation =
    () => {

      if (
        endingConversation
      ) {

        return;

      }


      setEndConversationOpen(false);

    };


  /* =======================================================
     END CONVERSATION
  ======================================================= */

  const handleEndConversation =
    async () => {

      if (
        endingConversation
      ) {

        return;

      }


      try {

        setEndingConversation(
          true
        );


        handleCancelRecording();

        clearFilePreview();


        if (
          typeof chatController.endChat ===
          "function"
        ) {

          await chatController.endChat();

        } else if (
          typeof chatController.endConversation ===
          "function"
        ) {

          await chatController.endConversation();

        } else {

          throw new Error(
            "End conversation is unavailable."
          );

        }


        setEndConversationOpen(
          false
        );

        setFullscreen(false);

        setMessageText("");

      } catch (error) {

        console.error(
          "End conversation error:",
          error
        );

        setVoiceError(
          error?.message ||
          "Failed to end conversation."
        );

      } finally {

        setEndingConversation(
          false
        );

      }

    };


  /* =======================================================
     CLOSED
  ======================================================= */

  if (
    !chatState ||
    chatState.status ===
      "closed"
  ) {

    return null;

  }


  /* =======================================================
     CHAT LAUNCHER
  ======================================================= */

  if (
    !chatState.isOpen
  ) {

    return (

      <div className="chat-controller">

        <button
          type="button"
          className={`chat-launcher ${
            launcherIntro
              ? "chat-launcher-intro"
              : "chat-launcher-ready"
          }`}
          onClick={
            handleOpenChat
          }
          aria-label="Open chat"
        >

          {launcherIntro ? (

            <span
              className="chat-launcher-dot"
              aria-hidden="true"
            />

          ) : (

            <MessageCircle
              size={25}
              strokeWidth={1.8}
            />

          )}

        </button>

      </div>

    );

  }


  /* =======================================================
     FIRST CONTACT FORM
  ======================================================= */

  const hasConversation =
    Boolean(
      chatState.conversation?.id
    );


  if (
    !hasConversation
  ) {

    return (

      <div className="chat-controller">

        <section
          className="chat-window"
          aria-label="Start conversation"
        >

          {/* ===============================================
              HEADER
          =============================================== */}

          <header className="chat-header">

            <div className="chat-header-user">

              <div className="chat-header-avatar">

                <MessageCircle
                  size={20}
                  strokeWidth={1.7}
                />

              </div>


              <div className="chat-header-info">

                <h2>
                  Nathan
                </h2>

                <div className="chat-header-email">

                  <span>
                    Start a conversation
                  </span>

                </div>

              </div>

            </div>


            <div className="chat-header-actions">

              <button
                type="button"
                className="chat-header-button"
                onClick={
                  handleCloseChat
                }
                aria-label="Close chat"
              >

                <X
                  size={17}
                  strokeWidth={1.8}
                />

              </button>

            </div>

          </header>


          {/* ===============================================
              INTRO
          =============================================== */}

          <div className="chat-start-content">

            <div className="chat-start-icon">

              <User
                size={25}
                strokeWidth={1.6}
              />

            </div>


            <h2>
              Let's get started
            </h2>


            <p>
              Enter your details and your
              first message to start the
              conversation.
            </p>


            <form
              className="chat-start-form"
              onSubmit={
                handleStartConversation
              }
            >

              {/* NAME */}

              <label
                className="chat-start-field"
              >

                <span>
                  Your name
                </span>


                <div className="chat-start-input">

                  <User
                    size={16}
                    strokeWidth={1.7}
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
                    placeholder="Enter your name"
                    autoComplete="name"
                    disabled={
                      startingChat
                    }
                  />

                </div>

              </label>


              {/* EMAIL */}

              <label
                className="chat-start-field"
              >

                <span>
                  Email
                </span>


                <div className="chat-start-input">

                  <Mail
                    size={16}
                    strokeWidth={1.7}
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
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={
                      startingChat
                    }
                  />

                </div>

              </label>


              {/* FIRST MESSAGE */}

              <label
                className="chat-start-field"
              >

                <span>
                  Message
                </span>


                <textarea
                  value={
                    startMessage
                  }
                  onChange={(event) =>
                    setStartMessage(
                      event.target.value
                    )
                  }
                  placeholder="Write your message..."
                  rows={4}
                  disabled={
                    startingChat
                  }
                />

              </label>


              {/* ERROR */}

              {startError && (

                <div className="chat-start-error">

                  {startError}

                </div>

              )}


              {/* START BUTTON */}

              <button
                type="submit"
                className="chat-start-submit"
                disabled={
                  startingChat ||
                  !visitorName.trim() ||
                  !visitorEmail.trim() ||
                  !startMessage.trim()
                }
              >

                {startingChat ? (

                  <>
                    <RefreshCw
                      size={16}
                      className="chat-spin"
                    />

                    <span>
                      Starting...
                    </span>
                  </>

                ) : (

                  <>
                    <Send
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Start Conversation
                    </span>
                  </>

                )}

              </button>

            </form>

          </div>

        </section>

      </div>

    );

  }


  /* =======================================================
     MAIN CHAT
  ======================================================= */

  return (

    <div className="chat-controller">

      <section
        className={`chat-window ${
          fullscreen
            ? "chat-fullscreen"
            : ""
        } ${
          isDraggingFile
            ? "chat-window-dragging"
            : ""
        }`}
        aria-label="Visitor chat"
        onDragOver={
          handleDragOver
        }
        onDragLeave={
          handleDragLeave
        }
        onDrop={
          handleDropFile
        }
      >

        {isDraggingFile && (

          <div className="chat-drop-overlay">

            <Paperclip
              size={22}
              strokeWidth={1.8}
            />

            <span>
              Drop a file to attach
            </span>

          </div>

        )}


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="chat-header">

          <div className="chat-header-user">

            <div className="chat-header-avatar">

              <MessageCircle
                size={20}
                strokeWidth={1.7}
              />

            </div>


            <div className="chat-header-info">

              <h2>
                Nathan
              </h2>


              <div className="chat-header-email">

                <span>
                  {visitorEmail ||
                    chatState
                      .conversation
                      ?.visitor_email ||
                    "Live conversation"}
                </span>

              </div>

            </div>

          </div>


          <div className="chat-header-actions">

            <button
              type="button"
              className="chat-header-button"
              onClick={() =>
                setFullscreen(
                  (value) =>
                    !value
                )
              }
              aria-label={
                fullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >

              {fullscreen ? (

                <Minimize2
                  size={16}
                  strokeWidth={1.8}
                />

              ) : (

                <Maximize2
                  size={16}
                  strokeWidth={1.8}
                />

              )}

            </button>


            <button
              type="button"
              className="chat-header-button"
              onClick={
                handleCloseChat
              }
              aria-label="Close chat"
            >

              <X
                size={17}
                strokeWidth={1.8}
              />

            </button>

          </div>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {(chatState.error ||
          voiceError ||
          fileError) && (

          <div className="chat-error">

            <span>
              {
                fileError ||
                voiceError ||
                chatState.error
              }
            </span>


            <button
              type="button"
              onClick={() => {

                setVoiceError("");

                setFileError("");

                handleRetry();

              }}
            >
              Retry
            </button>

          </div>

        )}


        {/* =================================================
            MESSAGES
        ================================================= */}

        <div className="chat-messages">

          {chatState.loading ? (

            <div className="chat-loading">

              <RefreshCw
                size={20}
                className="chat-spin"
              />

              <span>
                Loading conversation...
              </span>

            </div>

          ) : chatState.messages?.length ? (

            <div className="chat-message-list">

              {chatState.messages.map(
                (message) => {

                  const isVisitor =
                    message.sender ===
                    "visitor";

                  const isAudio =
                    message.message_type ===
                    "audio";

                  const fileUrl =
                    message.file_url ||
                    message.attachment_url ||
                    message.image_url ||
                    "";

                  const isImage =
                    message.message_type ===
                      "image" ||
                    (
                      Boolean(
                        message.image_url
                      ) &&
                      message.message_type !==
                        "file"
                    ) ||
                    (
                      typeof fileUrl ===
                        "string" &&
                      /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(
                        fileUrl
                      )
                    );

                  const isFile =
                    !isAudio &&
                    (
                      message.message_type ===
                        "file" ||
                      message.message_type ===
                        "attachment" ||
                      Boolean(
                        message.file_url ||
                        message.attachment_url
                      ) ||
                      isImage
                    );

                  const fileName =
                    message.file_name ||
                    message.filename ||
                    message.name ||
                    "Attachment";

                  const fileSize =
                    formatFileSize(
                      message.file_size ||
                      message.size
                    );


                  return (

                    <div
                      key={
                        message.id
                      }
                      className={
                        `chat-message ${
                          isVisitor
                            ? "chat-message-visitor"
                            : "chat-message-admin"
                        }`
                      }
                    >

                      <div className="chat-message-label">

                        {
                          isVisitor
                            ? "You"
                            : "Nathan"
                        }

                      </div>


                      {isAudio ? (

                        <div className="chat-message-audio">

                          <audio
                            controls
                            preload="metadata"
                            src={
                              message.audio_url
                            }
                          />

                        </div>

                      ) : isImage &&
                        fileUrl ? (

                        <a
                          className="chat-message-image"
                          href={
                            fileUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >

                          <img
                            src={
                              fileUrl
                            }
                            alt={
                              fileName
                            }
                          />

                        </a>

                      ) : isFile &&
                        fileUrl ? (

                        <a
                          className="chat-message-file"
                          href={
                            fileUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >

                          <span className="chat-message-file-icon">

                            <FileText
                              size={16}
                              strokeWidth={1.8}
                            />

                          </span>


                          <span className="chat-message-file-meta">

                            <span className="chat-message-file-name">

                              {fileName}

                            </span>


                            {fileSize && (

                              <span className="chat-message-file-size">

                                {fileSize}

                              </span>

                            )}

                          </span>

                        </a>

                      ) : (

                        <div className="chat-message-bubble">

                          {
                            message.message
                          }

                        </div>

                      )}


                      {message.message &&
                        (
                          isFile ||
                          isAudio
                        ) && (

                        <div className="chat-message-caption">

                          {message.message}

                        </div>

                      )}


                      <time>

                        {message.created_at
                          ? new Date(
                              message.created_at
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  "numeric",
                                minute:
                                  "2-digit",
                              }
                            )
                          : ""}

                      </time>

                    </div>

                  );

                }
              )}


              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          ) : (

            <div className="chat-empty">

              <div className="chat-empty-icon">

                <MessageCircle
                  size={28}
                  strokeWidth={1.5}
                />

              </div>


              <h2>
                Conversation started
              </h2>


              <p>
                Send a message or attach a file.
              </p>

            </div>

          )}

        </div>


        {/* =================================================
            REPLY AREA
        ================================================= */}

        <form
          className="chat-reply"
          onSubmit={(event) => {

            event.preventDefault();

            handleSendMessage();

          }}
        >

          <input
            ref={
              fileInputRef
            }
            type="file"
            className="chat-file-input"
            accept={
              ACCEPTED_FILES
            }
            onChange={
              handleFileInputChange
            }
          />


          {emojiOpen && (

            <div className="chat-emoji-picker">

              <input
                type="text"
                className="chat-emoji-search"
                value={
                  emojiSearch
                }
                onChange={(event) =>
                  setEmojiSearch(
                    event.target.value
                  )
                }
                placeholder="Search emoji..."
                autoFocus
              />


              {!emojiSearch && (

                <div className="chat-emoji-categories">

                  {emojiCategories.map(
                    (category) => (

                      <button
                        key={
                          category
                        }
                        type="button"
                        className={
                          `chat-emoji-category ${
                            emojiCategory ===
                            category
                              ? "active"
                              : ""
                          }`
                        }
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


              <div className="chat-emoji-grid">

                {emojis.length ? (

                  emojis.map(
                    (emoji, index) => {

                      const value =
                        typeof emoji ===
                        "string"
                          ? emoji
                          : emoji.emoji ||
                            emoji.char ||
                            emoji.symbol ||
                            "";


                      return (

                        <button
                          key={
                            `${value}-${index}`
                          }
                          type="button"
                          className="chat-emoji-item"
                          onClick={() =>
                            handleEmojiSelect(
                              value
                            )
                          }
                        >

                          {value}

                        </button>

                      );

                    }
                  )

                ) : (

                  <span>
                    No emoji found.
                  </span>

                )}

              </div>

            </div>

          )}


          {/* =================================================
              FILE PREVIEW
          ================================================= */}

          {selectedFile ? (

            <div className="chat-file-preview">

              <div className="chat-file-preview-thumb">

                {filePreviewUrl ? (

                  <img
                    src={
                      filePreviewUrl
                    }
                    alt={
                      selectedFile.name
                    }
                  />

                ) : (

                  <FileText
                    size={18}
                    strokeWidth={1.8}
                  />

                )}

              </div>


              <div className="chat-recording-info">

                <span className="chat-recording-title">

                  {selectedFile.name}

                </span>

                <span className="chat-recording-time">

                  {formatFileSize(
                    selectedFile.size
                  )}

                  {isImageFile(
                    selectedFile
                  )
                    ? " · Image"
                    : " · File"}

                </span>

              </div>


              <button
                type="button"
                className="chat-voice-preview-delete"
                onClick={
                  clearFilePreview
                }
                disabled={
                  fileSending
                }
                aria-label="Remove file"
              >

                <Trash2
                  size={16}
                  strokeWidth={1.8}
                />

              </button>


              <button
                type="button"
                className="chat-voice-preview-send"
                onClick={
                  handleSendFile
                }
                disabled={
                  fileSending
                }
                aria-label="Send file"
              >

                {fileSending ? (

                  <RefreshCw
                    size={16}
                    className="chat-spin"
                  />

                ) : (

                  <Send
                    size={16}
                    strokeWidth={1.8}
                  />

                )}

              </button>

            </div>

          ) : audioPreviewUrl ? (

            <div className="chat-voice-preview">

              <button
                type="button"
                className="chat-voice-preview-play"
                onClick={
                  handlePreviewToggle
                }
                aria-label={
                  audioPlaying
                    ? "Pause voice preview"
                    : "Play voice preview"
                }
              >

                {audioPlaying ? (

                  <Pause
                    size={16}
                    strokeWidth={1.8}
                  />

                ) : (

                  <Play
                    size={16}
                    strokeWidth={1.8}
                  />

                )}

              </button>


              <div className="chat-recording-info">

                <span className="chat-recording-title">
                  Voice message
                </span>

                <span className="chat-recording-time">
                  Ready to send
                </span>

              </div>


              <button
                type="button"
                className="chat-voice-preview-delete"
                onClick={
                  handleCancelRecording
                }
                disabled={
                  voiceSending
                }
                aria-label="Delete voice preview"
              >

                <Trash2
                  size={16}
                  strokeWidth={1.8}
                />

              </button>


              <button
                type="button"
                className="chat-voice-preview-send"
                onClick={
                  handleSendVoice
                }
                disabled={
                  voiceSending
                }
                aria-label="Send voice message"
              >

                {voiceSending ? (

                  <RefreshCw
                    size={16}
                    className="chat-spin"
                  />

                ) : (

                  <Send
                    size={16}
                    strokeWidth={1.8}
                  />

                )}

              </button>

            </div>

          ) : recording ? (

            <div className="chat-recording">

              <button
                type="button"
                className="chat-recording-cancel"
                onClick={
                  handleCancelRecording
                }
                aria-label="Cancel recording"
              >

                <X
                  size={16}
                  strokeWidth={1.8}
                />

              </button>


              <span className="chat-recording-indicator" />


              <div className="chat-recording-info">

                <span className="chat-recording-title">
                  Recording voice message
                </span>

                <span className="chat-recording-time">
                  {
                    formatRecordingTime(
                      recordingSeconds
                    )
                  }
                </span>

              </div>


              <button
                type="button"
                className="chat-recording-finish"
                onClick={
                  handleFinishRecording
                }
                aria-label="Finish recording"
              >

                <Square
                  size={15}
                  fill="currentColor"
                  strokeWidth={1.8}
                />

              </button>

            </div>

          ) : (

            <>

              {/* EMOJI */}

              <button
                type="button"
                className="chat-reply-icon"
                onClick={() =>
                  setEmojiOpen(
                    (value) =>
                      !value
                  )
                }
                aria-label="Open emoji picker"
              >

                <Smile
                  size={18}
                  strokeWidth={1.8}
                />

              </button>


              {/* TEXT INPUT */}

              <textarea
                ref={
                  inputRef
                }
                value={
                  messageText
                }
                onChange={
                  handleMessageChange
                }
                onKeyDown={
                  handleMessageKeyDown
                }
                placeholder="Write a message..."
                rows={1}
                disabled={
                  chatState.sending ||
                  voiceSending ||
                  fileSending
                }
                aria-label="Write a message"
              />


              {/* ATTACH FILE */}

              <button
                type="button"
                className="chat-reply-icon"
                onClick={
                  handleOpenFilePicker
                }
                disabled={
                  chatState.sending ||
                  voiceSending ||
                  fileSending
                }
                aria-label="Attach a file"
              >

                <Paperclip
                  size={18}
                  strokeWidth={1.8}
                />

              </button>


              {/* MICROPHONE */}

              <button
                type="button"
                className="chat-reply-microphone"
                onClick={
                  handleStartRecording
                }
                disabled={
                  chatState.sending ||
                  voiceSending ||
                  fileSending
                }
                aria-label="Record voice message"
              >

                <Mic
                  size={18}
                  strokeWidth={1.8}
                />

              </button>


              {/* SEND */}

              <button
                type="submit"
                className="chat-reply-icon"
                disabled={
                  chatState.sending ||
                  voiceSending ||
                  fileSending ||
                  !messageText.trim()
                }
                aria-label="Send message"
              >

                {chatState.sending ? (

                  <RefreshCw
                    size={17}
                    className="chat-spin"
                  />

                ) : (

                  <Send
                    size={17}
                    strokeWidth={1.8}
                  />

                )}

              </button>

            </>

          )}

        </form>


        {/* =================================================
            END CONVERSATION
        ================================================= */}

        <div className="chat-end-conversation">

          <button
            type="button"
            className="chat-end-conversation-button"
            onClick={
              handleOpenEndConversation
            }
            disabled={
              endingConversation ||
              chatState.sending ||
              voiceSending ||
              fileSending
            }
          >

            <LogOut
              size={14}
              strokeWidth={1.8}
            />

            <span>
              End Conversation
            </span>

          </button>

        </div>

      </section>


      {/* =================================================
          END CONVERSATION MODAL
      ================================================= */}

      {endConversationOpen && (

        <div
          className="chat-end-modal-backdrop"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget &&
              !endingConversation
            ) {

              handleCancelEndConversation();

            }

          }}
        >

          <div
            className="chat-end-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-end-title"
          >

            <div className="chat-end-modal-icon">

              <LogOut
                size={22}
                strokeWidth={1.8}
              />

            </div>


            <div className="chat-end-modal-content">

              <h3 id="chat-end-title">
                End this conversation?
              </h3>

              <p>
                Your current conversation
                will be closed. You can start
                another conversation later.
              </p>

            </div>


            <div className="chat-end-modal-actions">

              <button
                type="button"
                className="chat-end-modal-cancel"
                onClick={
                  handleCancelEndConversation
                }
                disabled={
                  endingConversation
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="chat-end-modal-confirm"
                onClick={
                  handleEndConversation
                }
                disabled={
                  endingConversation
                }
              >

                {endingConversation ? (

                  <>
                    <RefreshCw
                      size={14}
                      className="chat-spin"
                    />

                    <span>
                      Ending...
                    </span>
                  </>

                ) : (

                  <span>
                    End Conversation
                  </span>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}