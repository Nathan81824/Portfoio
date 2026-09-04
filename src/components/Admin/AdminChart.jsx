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
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

import { supabase } from "../../javascript/supabase/supabaseClient";

import {
  createAudioSignedUrl,
} from "../../javascript/contact/chat";

import {
  getEmojiCategories,
  getEmojisByCategory,
  searchEmojis,
} from "../../javascript/utils/emojis/emojis";




/* =========================================================
   ADMIN CHAT
========================================================= */

export default function AdminChart({
  selectedConversation,
}) {

  /* =======================================================
     MESSAGE STATE
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
     VOICE RECORDING STATE
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
     VOICE MESSAGE PLAYER STATE
  ======================================================= */

  const [playingAudioId, setPlayingAudioId] =
    useState(null);

  const [mutedAudioId, setMutedAudioId] =
    useState(null);

  const [audioProgress, setAudioProgress] =
    useState({});

  const [audioDuration, setAudioDuration] =
    useState({});


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

  const audioChunksRef =
    useRef([]);

  const recordingTimerRef =
    useRef(null);

  const audioPreviewRef =
    useRef(null);

  const discardRecordingRef =
    useRef(false);

  const audioRefs =
    useRef({});


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


    if (
      emojiCategory === "All"
    ) {

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
     FORMAT RECORDING TIME
  ======================================================= */

  const formatRecordingTime =
    (seconds) => {

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remainingSeconds =
        seconds % 60;


      return `${String(
        minutes
      ).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;

    };


  /* =======================================================
     FORMAT AUDIO TIME
  ======================================================= */

  const formatAudioTime =
    (seconds) => {

      if (
        !Number.isFinite(
          seconds
        )
      ) {

        return "0:00";

      }


      const total =
        Math.max(
          0,
          Math.floor(seconds)
        );


      const minutes =
        Math.floor(
          total / 60
        );

      const secondsPart =
        total % 60;


      return `${minutes}:${String(
        secondsPart
      ).padStart(2, "0")}`;

    };


  /* =======================================================
     CLEAR RECORDING TIMER
  ======================================================= */

  const clearRecordingTimer =
    () => {

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
            (track) =>
              track.stop()
          );

        mediaStreamRef.current =
          null;

      }

    };


  /* =======================================================
     CLEAR AUDIO PREVIEW
  ======================================================= */

  const clearAudioPreview =
    () => {

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
     STOP AUDIO PREVIEW
  ======================================================= */

  const stopAudioPreview =
    () => {

      if (
        audioPreviewRef.current
      ) {

        audioPreviewRef.current.pause();

        audioPreviewRef.current.currentTime =
          0;

      }

      setAudioPlaying(false);

    };


  /* =======================================================
     CANCEL RECORDING
  ======================================================= */

  const cancelRecording =
    () => {

      discardRecordingRef.current =
        true;


      clearRecordingTimer();

      stopMediaStream();


      const recorder =
        mediaRecorderRef.current;


      if (
        recorder &&
        recorder.state !==
          "inactive"
      ) {

        recorder.stop();

      }


      mediaRecorderRef.current =
        null;


      setRecording(false);

      setRecordingSeconds(0);

      setAudioPlaying(false);

    };


  /* =======================================================
     START RECORDING
  ======================================================= */

  const startRecording =
    async () => {

      if (
        recording ||
        voiceSending ||
        sending ||
        !selectedConversation?.id
      ) {

        return;

      }


      try {

        setVoiceError("");

        clearAudioPreview();

        discardRecordingRef.current =
          false;


        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {

          throw new Error(
            "Voice recording is not supported by this browser."
          );

        }


        const stream =
          await navigator.mediaDevices
            .getUserMedia({
              audio: true,
            });


        mediaStreamRef.current =
          stream;


        const supportedTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/mp4",
          "audio/ogg",
        ];


        const supportedMimeType =
          supportedTypes.find(
            (type) =>
              typeof MediaRecorder !==
                "undefined" &&
              MediaRecorder.isTypeSupported(
                type
              )
          );


        const recorder =
          supportedMimeType
            ? new MediaRecorder(
                stream,
                {
                  mimeType:
                    supportedMimeType,
                }
              )
            : new MediaRecorder(
                stream
              );


        mediaRecorderRef.current =
          recorder;

        audioChunksRef.current =
          [];


        recorder.ondataavailable =
          (event) => {

            if (
              event.data &&
              event.data.size > 0
            ) {

              audioChunksRef.current.push(
                event.data
              );

            }

          };


        recorder.onstop =
          () => {

            clearRecordingTimer();

            stopMediaStream();


            if (
              discardRecordingRef.current
            ) {

              audioChunksRef.current =
                [];

              discardRecordingRef.current =
                false;

              return;

            }


            const mimeType =
              recorder.mimeType ||
              "audio/webm";


            const blob =
              new Blob(
                audioChunksRef.current,
                {
                  type: mimeType,
                }
              );


            audioChunksRef.current =
              [];


            if (
              blob.size <= 0
            ) {

              setVoiceError(
                "The recording was empty."
              );

              return;

            }


            const previewUrl =
              URL.createObjectURL(
                blob
              );


            setAudioBlob(blob);

            setAudioPreviewUrl(
              previewUrl
            );

            setAudioPlaying(false);

          };


        recorder.onerror =
          () => {

            clearRecordingTimer();

            stopMediaStream();

            setRecording(false);

            setVoiceError(
              "Unable to record audio."
            );

          };


        recorder.start();

        setRecording(true);

        setRecordingSeconds(0);


        recordingTimerRef.current =
          setInterval(
            () => {

              setRecordingSeconds(
                (current) =>
                  current + 1
              );

            },
            1000
          );

      } catch (err) {

        console.error(
          "Admin voice recording error:",
          err
        );

        stopMediaStream();

        setRecording(false);

        setVoiceError(
          err?.message ||
          "Microphone access was denied."
        );

      }

    };


  /* =======================================================
     STOP RECORDING
  ======================================================= */

  const stopRecording =
    () => {

      const recorder =
        mediaRecorderRef.current;


      if (
        !recorder ||
        recorder.state ===
          "inactive"
      ) {

        return;

      }


      recorder.stop();

      setRecording(false);

      clearRecordingTimer();

      stopMediaStream();

    };


  /* =======================================================
     RECORDING TOGGLE
  ======================================================= */

  const handleRecordingToggle =
    () => {

      if (recording) {

        stopRecording();

      } else {

        startRecording();

      }

    };


  /* =======================================================
     PLAY PREVIEW
  ======================================================= */

  const toggleAudioPreview =
    async () => {

      if (
        !audioPreviewRef.current ||
        !audioPreviewUrl
      ) {

        return;

      }


      const audio =
        audioPreviewRef.current;


      try {

        if (
          audio.paused
        ) {

          await audio.play();

          setAudioPlaying(true);

        } else {

          audio.pause();

          setAudioPlaying(false);

        }

      } catch (err) {

        console.error(
          "Audio preview error:",
          err
        );

        setAudioPlaying(false);

      }

    };


  /* =======================================================
     DELETE PREVIEW
  ======================================================= */

  const handleDeleteRecording =
    () => {

      stopAudioPreview();

      clearAudioPreview();

      setVoiceError("");

    };


  /* =======================================================
     SEND VOICE MESSAGE
  ======================================================= */

  const handleSendVoice =
    async () => {

      if (
        !audioBlob ||
        voiceSending ||
        !selectedConversation?.id
      ) {

        return;

      }


      try {

        setVoiceSending(true);

        setVoiceError("");

        setError("");


        const extension =
          audioBlob.type.includes("mp4")
            ? "mp4"
            : audioBlob.type.includes("ogg")
              ? "ogg"
              : "webm";


        const fileName =
          `admin-${crypto.randomUUID()}.${extension}`;


        const filePath =
          `${selectedConversation.id}/${fileName}`;


        const {
          error:
            uploadError,
        } =
          await supabase.storage

            .from(
              "chat-audio"
            )

            .upload(
              filePath,
              audioBlob,
              {
                cacheControl:
                  "3600",

                contentType:
                  audioBlob.type ||
                  "audio/webm",

                upsert:
                  false,
              }
            );


        if (
          uploadError
        ) {

          throw uploadError;

        }


        const {
          data,
          error:
            messageError,
        } =
          await supabase

            .from(
              "messages"
            )

            .insert({

              conversation_id:
                selectedConversation.id,

              message:
                "",

              sender:
                "admin",

              message_type:
                "audio",

              audio_url:
                filePath,

            })

            .select(`
              id,
              conversation_id,
              message,
              sender,
              message_type,
              audio_url,
              created_at
            `)

            .single();


        if (
          messageError
        ) {

          await supabase.storage
            .from(
              "chat-audio"
            )
            .remove([
              filePath,
            ]);

          throw messageError;

        }


        let signedUrl =
          "";


        try {

          signedUrl =
            await createAudioSignedUrl(
              filePath
            );

        } catch (urlError) {

          console.warn(
            "Could not create signed admin audio URL:",
            urlError
          );

        }


        const result = {

          ...data,

          audio_url:
            signedUrl ||
            filePath,

        };


        setMessages(
          (current) => {

            const exists =
              current.some(
                (item) =>
                  item.id ===
                  result.id
              );


            if (exists) {

              return current;

            }


            return [
              ...current,
              result,
            ];

          }
        );


        handleDeleteRecording();

      } catch (err) {

        console.error(
          "Admin voice message error:",
          err
        );

        setVoiceError(
          err?.message ||
          "Unable to send voice message."
        );

      } finally {

        setVoiceSending(false);

      }

    };


  /* =======================================================
     FETCH MESSAGES + REALTIME
  ======================================================= */

  useEffect(() => {

    if (
      !selectedConversation?.id
    ) {

      setMessages([]);

      setError("");

      return;

    }


    let mounted = true;


    const fetchMessages =
      async () => {

        setLoading(true);

        setError("");


        const {
          data,
          error:
            fetchError,
        } =
          await supabase

            .from(
              "messages"
            )

            .select(`
              id,
              conversation_id,
              message,
              sender,
              message_type,
              audio_url,
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


        if (
          fetchError
        ) {

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


        const resolvedMessages =
          await Promise.all(

            (data || []).map(
              async (item) => {

                if (
                  item.message_type !==
                    "audio" ||
                  !item.audio_url
                ) {

                  return item;

                }


                try {

                  const signedUrl =
                    await createAudioSignedUrl(
                      item.audio_url
                    );


                  return {

                    ...item,

                    audio_url:
                      signedUrl,

                  };

                } catch {

                  return item;

                }

              }
            )

          );


        if (!mounted) {
          return;
        }


        setMessages(
          resolvedMessages
        );

        setLoading(false);

      };


    fetchMessages();


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

          async (payload) => {

            if (
              payload.eventType ===
              "INSERT"
            ) {

              let nextMessage =
                payload.new;


              if (
                nextMessage.message_type ===
                  "audio" &&
                nextMessage.audio_url
              ) {

                try {

                  const signedUrl =
                    await createAudioSignedUrl(
                      nextMessage.audio_url
                    );


                  nextMessage = {

                    ...nextMessage,

                    audio_url:
                      signedUrl,

                  };

                } catch {}

              }


              setMessages(
                (current) => {

                  const exists =
                    current.some(
                      (item) =>
                        item.id ===
                        nextMessage.id
                    );


                  if (exists) {
                    return current;
                  }


                  return [
                    ...current,
                    nextMessage,
                  ];

                }
              );

            }


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
     RESET
  ======================================================= */

  useEffect(() => {

    setEmojiOpen(false);

    setEmojiSearch("");

    setEmojiCategory("Smileys");

    setMessageText("");

    cancelRecording();

    clearAudioPreview();

    setVoiceError("");

    setPlayingAudioId(null);

    setMutedAudioId(null);

    setAudioProgress({});

    setAudioDuration({});

  }, [
    selectedConversation?.id,
  ]);


  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {

    return () => {

      clearRecordingTimer();

      stopMediaStream();


      if (
        audioPreviewUrl
      ) {

        URL.revokeObjectURL(
          audioPreviewUrl
        );

      }


      Object.values(
        audioRefs.current
      ).forEach(
        (audio) => {

          if (audio) {

            audio.pause();

          }

        }
      );

    };

  }, []);


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
     MESSAGE TIME
  ======================================================= */

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
     AUDIO REF
  ======================================================= */

  const setAudioRef =
    (id, element) => {

      if (element) {

        audioRefs.current[id] =
          element;

      } else {

        delete audioRefs.current[id];

      }

    };


  /* =======================================================
     TOGGLE AUDIO
  ======================================================= */

  const toggleMessageAudio =
    async (message) => {

      const audio =
        audioRefs.current[
          message.id
        ];


      if (!audio) {
        return;
      }


      try {

        if (
          playingAudioId ===
          message.id
        ) {

          audio.pause();

          setPlayingAudioId(null);

          return;

        }


        Object.entries(
          audioRefs.current
        ).forEach(
          ([id, item]) => {

            if (
              item &&
              id !==
                String(
                  message.id
                )
            ) {

              item.pause();

              item.currentTime =
                0;

            }

          }
        );


        await audio.play();

        setPlayingAudioId(
          message.id
        );

      } catch (err) {

        console.error(
          "Admin audio playback error:",
          err
        );

      }

    };


  /* =======================================================
     TOGGLE MUTE
  ======================================================= */

  const toggleMessageMute =
    (message) => {

      const audio =
        audioRefs.current[
          message.id
        ];


      if (!audio) {
        return;
      }


      const nextMuted =
        !audio.muted;


      audio.muted =
        nextMuted;


      setMutedAudioId(
        nextMuted
          ? message.id
          : null
      );

    };


  /* =======================================================
     AUDIO EVENTS
  ======================================================= */

  const handleAudioLoaded =
    (messageId, event) => {

      const duration =
        event.currentTarget.duration;


      if (
        Number.isFinite(
          duration
        )
      ) {

        setAudioDuration(
          (current) => ({
            ...current,
            [messageId]:
              duration,
          })
        );

      }

    };


  const handleAudioTimeUpdate =
    (messageId, event) => {

      const audio =
        event.currentTarget;


      if (
        !audio.duration ||
        !Number.isFinite(
          audio.duration
        )
      ) {

        return;

      }


      setAudioProgress(
        (current) => ({
          ...current,
          [messageId]:
            audio.currentTime /
            audio.duration,
        })
      );

    };


  const handleAudioEnded =
    (messageId) => {

      setPlayingAudioId(null);

      setAudioProgress(
        (current) => ({
          ...current,
          [messageId]:
            0,
        })
      );

    };


  /* =======================================================
     SEEK AUDIO
  ======================================================= */

  const handleSeekAudio =
    (messageId, event) => {

      const audio =
        audioRefs.current[
          messageId
        ];


      if (
        !audio ||
        !Number.isFinite(
          audio.duration
        )
      ) {

        return;

      }


      const rect =
        event.currentTarget
          .getBoundingClientRect();


      const percent =
        Math.min(
          1,
          Math.max(
            0,
            (
              event.clientX -
              rect.left
            ) /
              rect.width
          )
        );


      audio.currentTime =
        percent *
        audio.duration;


      setAudioProgress(
        (current) => ({
          ...current,
          [messageId]:
            percent,
        })
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
     TOGGLE EMOJI
  ======================================================= */

  const handleToggleEmoji =
    () => {

      if (
        recording ||
        voiceSending ||
        sending
      ) {

        return;

      }


      setEmojiOpen(
        (current) =>
          !current
      );

    };


  /* =======================================================
     CLOSE EMOJI
  ======================================================= */

  const handleCloseEmoji =
    () => {

      setEmojiOpen(false);

      setEmojiSearch("");

    };


  /* =======================================================
     SEND TEXT
  ======================================================= */

  const handleSend =
    async () => {

      const text =
        messageText.trim();


      if (
        !text ||
        sending ||
        voiceSending ||
        recording ||
        !selectedConversation?.id
      ) {

        return;

      }


      setSending(true);

      setError("");

      setEmojiOpen(false);


      const {
        data,
        error:
          sendError,
      } =
        await supabase

          .from(
            "messages"
          )

          .insert({

            conversation_id:
              selectedConversation.id,

            message:
              text,

            sender:
              "admin",

            message_type:
              "text",

            audio_url:
              null,

          })

          .select(`
            id,
            conversation_id,
            message,
            sender,
            message_type,
            audio_url,
            created_at
          `)

          .single();


      if (
        sendError
      ) {

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
     EMPTY STATE
  ======================================================= */

  if (
    !selectedConversation
  ) {

    return (

      <main className="admin-chart">

        <div className="admin-chart-container">

          <div className="admin-chart-empty">

            <div className="admin-chart-empty-content">

              <div
                className="admin-chart-empty-icon"
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
            HEADER
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
              className="admin-chart-status-dot"
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
                      className="admin-chart-empty-icon"
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


                      const progress =
                        audioProgress[
                          item.id
                        ] || 0;


                      const duration =
                        audioDuration[
                          item.id
                        ] || 0;


                      const isPlaying =
                        playingAudioId ===
                        item.id;


                      const isMuted =
                        mutedAudioId ===
                        item.id;


                      return (

                        <article
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

                          {/* =============================
                              USERNAME
                          ============================== */}

                          <div
                            className="
                              admin-chart-message-meta
                            "
                          >

                            <span
                              className="
                                admin-chart-message-username
                              "
                            >
                              {username}
                            </span>

                            <span
                              className="
                                admin-chart-message-role
                              "
                            >
                              {isAdmin
                                ? "Admin"
                                : "Visitor"}
                            </span>

                          </div>


                          {/* =============================
                              MESSAGE
                          ============================== */}

                          {item.message_type ===
                          "audio" ? (

                            <div
                              className="
                                admin-chart-voice-message
                              "
                            >

                              <audio
                                ref={(element) =>
                                  setAudioRef(
                                    item.id,
                                    element
                                  )
                                }
                                src={
                                  item.audio_url
                                }
                                preload="metadata"
                                onLoadedMetadata={(
                                  event
                                ) =>
                                  handleAudioLoaded(
                                    item.id,
                                    event
                                  )
                                }
                                onTimeUpdate={(
                                  event
                                ) =>
                                  handleAudioTimeUpdate(
                                    item.id,
                                    event
                                  )
                                }
                                onEnded={() =>
                                  handleAudioEnded(
                                    item.id
                                  )
                                }
                                onPause={() => {

                                  if (
                                    playingAudioId ===
                                    item.id
                                  ) {

                                    setPlayingAudioId(
                                      null
                                    );

                                  }

                                }}
                              />


                              <button
                                type="button"
                                className="
                                  admin-chart-audio-play
                                "
                                onClick={() =>
                                  toggleMessageAudio(
                                    item
                                  )
                                }
                                aria-label={
                                  isPlaying
                                    ? "Pause voice message"
                                    : "Play voice message"
                                }
                              >

                                {isPlaying ? (

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


                              <div
                                className="
                                  admin-chart-audio-content
                                "
                              >

                                {/* =======================
                                    VOICE TOP
                                ======================== */}

                                <div
                                  className="
                                    admin-chart-audio-top
                                  "
                                >

                                  <span
                                    className="
                                      admin-chart-audio-label
                                    "
                                  >
                                    Voice message
                                  </span>


                                  <span
                                    className="
                                      admin-chart-audio-duration
                                    "
                                  >
                                    {formatAudioTime(
                                      duration
                                    )}
                                  </span>

                                </div>


                                {/* =======================
                                    PROGRESS
                                ======================== */}

                                <button
                                  type="button"
                                  className="
                                    admin-chart-audio-progress
                                  "
                                  onClick={(event) =>
                                    handleSeekAudio(
                                      item.id,
                                      event
                                    )
                                  }
                                  aria-label="Seek voice message"
                                >

                                  <span
                                    className="
                                      admin-chart-audio-progress-fill
                                    "
                                    style={{
                                      width:
                                        `${
                                          progress *
                                          100
                                        }%`,
                                    }}
                                  />

                                </button>


                                {/* =======================
                                    VOICE BOTTOM
                                ======================== */}

                                <div
                                  className="
                                    admin-chart-audio-bottom
                                  "
                                >

                                  <span
                                    className="
                                      admin-chart-audio-current
                                    "
                                  >
                                    {formatAudioTime(
                                      progress *
                                      duration
                                    )}
                                  </span>


                                  <button
                                    type="button"
                                    className="
                                      admin-chart-audio-mute
                                    "
                                    onClick={() =>
                                      toggleMessageMute(
                                        item
                                      )
                                    }
                                    aria-label={
                                      isMuted
                                        ? "Unmute voice message"
                                        : "Mute voice message"
                                    }
                                  >

                                    {isMuted ? (

                                      <VolumeX
                                        size={14}
                                        strokeWidth={2}
                                      />

                                    ) : (

                                      <Volume2
                                        size={14}
                                        strokeWidth={2}
                                      />

                                    )}

                                  </button>

                                </div>

                              </div>

                            </div>

                          ) : (

                            <div
                              className="
                                admin-chart-message-bubble
                              "
                            >
                              {item.message}
                            </div>

                          )}


                          {/* =============================
                              MESSAGE TIMESTAMP
                          ============================== */}

                          <time
                            className="
                              admin-chart-message-time
                            "
                          >
                            {formatTime(
                              item.created_at
                            )}
                          </time>

                        </article>

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
                REPLY
            ============================================= */}

            <form
              className="admin-chart-reply"
              onSubmit={(event) => {

                event.preventDefault();

                if (
                  audioBlob
                ) {

                  handleSendVoice();

                } else {

                  handleSend();

                }

              }}
            >

              {recording ? (

                <div
                  className="
                    admin-chart-recording
                  "
                >

                  <div
                    className="
                      admin-chart-recording-indicator
                    "
                  />

                  <span
                    className="
                      admin-chart-recording-time
                    "
                  >
                    {formatRecordingTime(
                      recordingSeconds
                    )}
                  </span>


                  <span
                    className="
                      admin-chart-recording-label
                    "
                  >
                    Recording...
                  </span>


                  <button
                    type="button"
                    className="
                      admin-chart-recording-stop
                    "
                    onClick={
                      stopRecording
                    }
                    aria-label="Stop recording"
                  >

                    <Square
                      size={14}
                      fill="currentColor"
                      strokeWidth={1.8}
                    />

                  </button>


                  <button
                    type="button"
                    className="
                      admin-chart-recording-cancel
                    "
                    onClick={
                      cancelRecording
                    }
                    aria-label="Cancel recording"
                  >

                    <X
                      size={15}
                      strokeWidth={1.8}
                    />

                  </button>

                </div>

              ) : audioPreviewUrl ? (

                <div
                  className="
                    admin-chart-recording-preview
                  "
                >

                  <button
                    type="button"
                    className="
                      admin-chart-recording-preview-button
                    "
                    onClick={
                      toggleAudioPreview
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
                        strokeWidth={1.8}
                      />

                    ) : (

                      <Play
                        size={16}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>


                  <audio
                    ref={
                      audioPreviewRef
                    }
                    src={
                      audioPreviewUrl
                    }
                    preload="metadata"
                    onPlay={() =>
                      setAudioPlaying(
                        true
                      )
                    }
                    onPause={() =>
                      setAudioPlaying(
                        false
                      )
                    }
                    onEnded={() =>
                      setAudioPlaying(
                        false
                      )
                    }
                  />


                  <span
                    className="
                      admin-chart-recording-preview-label
                    "
                  >
                    Voice message ready
                  </span>


                  <button
                    type="button"
                    className="
                      admin-chart-recording-delete
                    "
                    onClick={
                      handleDeleteRecording
                    }
                    disabled={
                      voiceSending
                    }
                    aria-label="Delete recording"
                  >

                    <Trash2
                      size={16}
                      strokeWidth={1.8}
                    />

                  </button>


                  <button
                    type="button"
                    className="
                      admin-chart-recording-send
                    "
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
                        className="
                          admin-chart-spin
                        "
                      />

                    ) : (

                      <Send
                        size={16}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>

                </div>

              ) : (

                <>

                  {/* =======================================
                      EMOJI PICKER
                  ======================================= */}

                  {emojiOpen && (

                    <div
                      className="
                        admin-chart-emoji-picker
                      "
                      role="dialog"
                      aria-label="Emoji picker"
                    >

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

                        </div>


                        <button
                          type="button"
                          className="
                            admin-chart-emoji-close
                          "
                          onClick={
                            handleCloseEmoji
                          }
                          aria-label="Close emoji picker"
                        >

                          <X
                            size={15}
                            strokeWidth={1.8}
                          />

                        </button>

                      </div>


                      <div
                        className="
                          admin-chart-emoji-categories
                        "
                      >

                        {emojiCategories.map(
                          (category) => (

                            <button
                              key={
                                category
                              }
                              type="button"
                              className={`admin-chart-emoji-category ${
                                emojiCategory ===
                                category
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => {

                                setEmojiCategory(
                                  category
                                );

                                setEmojiSearch(
                                  ""
                                );

                              }}
                            >
                              {category}
                            </button>

                          )
                        )}

                      </div>


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
                            (
                              emoji,
                              index
                            ) => (

                              <button
                                key={`${emoji}-${index}`}
                                type="button"
                                className="
                                  admin-chart-emoji
                                "
                                onClick={() =>
                                  handleEmojiClick(
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


                  <button
                    type="button"
                    className="
                      admin-chart-emoji-button
                    "
                    onClick={
                      handleToggleEmoji
                    }
                    disabled={
                      sending
                    }
                    aria-label="Open emoji picker"
                    aria-expanded={
                      emojiOpen
                    }
                  >

                    <Smile
                      size={18}
                      strokeWidth={1.8}
                    />

                  </button>


                  <textarea
                    ref={
                      inputRef
                    }
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
                    placeholder="Write a reply..."
                    aria-label="Write a reply"
                    rows={1}
                    disabled={
                      sending
                    }
                  />


                  <button
                    type="button"
                    className="
                      admin-chart-mic-button
                    "
                    onClick={
                      handleRecordingToggle
                    }
                    disabled={
                      sending ||
                      voiceSending
                    }
                    aria-label="Record voice message"
                  >

                    <Mic
                      size={17}
                      strokeWidth={1.8}
                    />

                  </button>


                  <button
                    type="submit"
                    className="
                      admin-chart-send
                    "
                    disabled={
                      sending ||
                      !messageText.trim()
                    }
                    aria-label="Send message"
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

                </>

              )}

            </form>


            {voiceError && (

              <div
                className="
                  admin-chart-voice-error
                "
                role="alert"
              >
                {voiceError}
              </div>

            )}

          </>

        )}

      </div>

    </main>

  );

}
