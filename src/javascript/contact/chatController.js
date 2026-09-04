/* =========================================================
   CHAT CONTROLLER
   Application-level controller for portfolio chat.

   Responsibilities:
   - Manage chat state
   - Open / close chat
   - Start conversations
   - Restore conversations
   - Load messages
   - Subscribe to realtime messages
   - Send text messages
   - Record voice messages
   - Preview voice recordings
   - Send voice messages
   - Cancel recordings
   - Handle recreated conversations
   - Reset chat
   - Notify React UI

   Supabase communication is handled by:
   ./chat.js

   React UI is handled by:
   components/Contact/ChatController.jsx
========================================================= */

import {
  createConversation,
  getStoredConversation,
  getConversation,
  getMessages,
  sendMessage,
  sendVoiceMessage,
  subscribeToMessages,
  clearStoredConversation,
} from "./chat.js";


/* =========================================================
   CHAT CONTROLLER CLASS
========================================================= */

class ChatController {

  constructor() {

    /* =======================================================
       STATE
    ======================================================= */

    this.state = {

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

      recording: false,

      recordingDuration: 0,

      voiceBlob: null,

      voicePreviewUrl: "",

      error: "",

      conversation: null,

      messages: [],

      visitorName: "",

      visitorEmail: "",

    };


    /* =======================================================
       SUBSCRIBERS
    ======================================================= */

    this.listeners = new Set();


    /* =======================================================
       REALTIME SUBSCRIPTION
    ======================================================= */

    this.unsubscribeMessages = null;


    /* =======================================================
       INITIALIZATION
    ======================================================= */

    this.initialized = false;


    /* =======================================================
       MEDIA RECORDER
    ======================================================= */

    this.mediaRecorder = null;

    this.mediaStream = null;

    this.recordingChunks = [];

    this.recordingTimer = null;

    this.recordingStartedAt = null;


    /* =======================================================
       RECORDING CANCELLATION FLAG
    ======================================================= */

    this.discardRecording = false;

  }


  /* =========================================================
     GET STATE
  ========================================================= */

  getState() {

    return {

      ...this.state,

      messages: [
        ...this.state.messages,
      ],

    };

  }


  /* =========================================================
     SET STATE
  ========================================================= */

  setState(updates) {

    this.state = {

      ...this.state,

      ...updates,

    };

    this.notify();

  }


  /* =========================================================
     NOTIFY LISTENERS
  ========================================================= */

  notify() {

    const nextState = this.getState();

    this.listeners.forEach(
      (listener) => {

        try {

          listener(nextState);

        } catch (error) {

          console.error(
            "Chat controller listener error:",
            error
          );

        }

      }
    );

  }


  /* =========================================================
     SUBSCRIBE TO STATE
  ========================================================= */

  subscribe(listener) {

    if (
      typeof listener !== "function"
    ) {

      return () => {};

    }


    this.listeners.add(listener);

    listener(
      this.getState()
    );


    return () => {

      this.listeners.delete(listener);

    };

  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  async initialize() {

    if (this.initialized) {

      return this.getState();

    }


    this.initialized = true;


    this.setState({

      loading: true,

      error: "",

    });


    try {

      /* ================================================
         RESTORE STORED CONVERSATION
      ================================================ */

      const stored =
        getStoredConversation();


      if (!stored?.id) {

        this.setState({

          loading: false,

          isStarted: false,

          conversation: null,

          messages: [],

        });


        return this.getState();

      }


      /* ================================================
         VERIFY CONVERSATION
      ================================================ */

      const conversation =
        await getConversation(
          stored.id
        );


      if (!conversation) {

        clearStoredConversation();


        this.setState({

          loading: false,

          isStarted: false,

          conversation: null,

          messages: [],

        });


        return this.getState();

      }


      /* ================================================
         STORE VISITOR DETAILS
      ================================================ */

      this.setState({

        conversation,

        visitorName:
          conversation.visitor_name ||
          "",

        visitorEmail:
          conversation.visitor_email ||
          "",

        isStarted: true,

      });


      /* ================================================
         LOAD MESSAGES
      ================================================ */

      await this.loadMessages(
        conversation.id
      );


      /* ================================================
         REALTIME
      ================================================ */

      this.subscribeToConversation(
        conversation
      );


      this.setState({

        loading: false,

      });


      return this.getState();

    } catch (error) {

      console.error(
        "Chat initialization error:",
        error
      );


      this.setState({

        loading: false,

        error:
          "Unable to restore the conversation.",

      });


      return this.getState();

    }

  }


  /* =========================================================
     START CONVERSATION
  ========================================================= */

  async startConversation({

    visitorName = "",

    visitorEmail = "",

  } = {}) {

    if (
      this.state.sending ||
      this.state.recording
    ) {

      return null;

    }


    const cleanName =
      String(
        visitorName
      ).trim();


    const cleanEmail =
      String(
        visitorEmail
      ).trim();


    if (!cleanName) {

      this.setError(
        "Please enter your name before starting the chat."
      );


      return null;

    }


    this.setState({

      loading: true,

      error: "",

      visitorName:
        cleanName,

      visitorEmail:
        cleanEmail,

    });


    try {

      /* ================================================
         REMOVE OLD SUBSCRIPTION
      ================================================ */

      this.unsubscribeFromMessages();


      /* ================================================
         CREATE CONVERSATION
      ================================================ */

      const conversation =
        await createConversation({

          visitorName:
            cleanName,

          visitorEmail:
            cleanEmail,

        });


      /* ================================================
         UPDATE STATE
      ================================================ */

      this.setState({

        conversation,

        visitorName:
          conversation.visitor_name ||
          cleanName,

        visitorEmail:
          conversation.visitor_email ||
          cleanEmail,

        messages: [],

        isStarted: true,

        loading: false,

        error: "",

      });


      /* ================================================
         REALTIME
      ================================================ */

      this.subscribeToConversation(
        conversation
      );


      return conversation;

    } catch (error) {

      console.error(
        "Start conversation error:",
        error
      );


      this.setState({

        loading: false,

        error:
          error?.message ||
          "Unable to start the conversation.",

      });


      return null;

    }

  }


  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  async loadMessages(
    conversationId
  ) {

    if (!conversationId) {

      this.setState({

        messages: [],

      });


      return [];

    }


    try {

      const messages =
        await getMessages(
          conversationId
        );


      this.setState({

        messages:
          Array.isArray(messages)
            ? messages
            : [],

      });


      return messages;

    } catch (error) {

      console.error(
        "Load messages error:",
        error
      );


      this.setError(
        "Unable to load messages."
      );


      return [];

    }

  }


  /* =========================================================
     SUBSCRIBE TO CONVERSATION
  ========================================================= */

  subscribeToConversation(
    conversation
  ) {

    if (!conversation?.id) {

      return;

    }


    this.unsubscribeFromMessages();


    const accessToken =
      conversation.access_token ||
      null;


    this.unsubscribeMessages =
      subscribeToMessages({

        conversationId:
          conversation.id,

        accessToken,


        onMessage:
          (newMessage) => {

            this.addMessage(
              newMessage
            );

          },


        onUpdate:
          (updatedMessage) => {

            this.updateMessage(
              updatedMessage
            );

          },


        onDelete:
          (deletedMessage) => {

            this.removeMessage(
              deletedMessage
            );

          },

      });

  }


  /* =========================================================
     UNSUBSCRIBE
  ========================================================= */

  unsubscribeFromMessages() {

    if (
      typeof this.unsubscribeMessages ===
      "function"
    ) {

      try {

        this.unsubscribeMessages();

      } catch (error) {

        console.error(
          "Chat unsubscribe error:",
          error
        );

      }

    }


    this.unsubscribeMessages = null;

  }


  /* =========================================================
     ADD MESSAGE
  ========================================================= */

  addMessage(
    message
  ) {

    if (!message?.id) {

      return;

    }


    this.setState({

      messages: [

        ...this.state.messages.filter(
          (item) =>
            item.id !== message.id
        ),

        message,

      ],

    });

  }


  /* =========================================================
     UPDATE MESSAGE
  ========================================================= */

  updateMessage(
    message
  ) {

    if (!message?.id) {

      return;

    }


    this.setState({

      messages:
        this.state.messages.map(
          (item) =>
            item.id === message.id
              ? message
              : item
        ),

    });

  }


  /* =========================================================
     REMOVE MESSAGE
  ========================================================= */

  removeMessage(
    message
  ) {

    if (!message?.id) {

      return;

    }


    this.setState({

      messages:
        this.state.messages.filter(
          (item) =>
            item.id !== message.id
        ),

    });

  }


  /* =========================================================
     SEND TEXT MESSAGE
  ========================================================= */

  async send(
    message
  ) {

    const cleanMessage =
      typeof message === "string"
        ? message.trim()
        : "";


    if (!cleanMessage) {

      return null;

    }


    if (
      this.state.sending ||
      this.state.recording
    ) {

      return null;

    }


    this.setState({

      sending: true,

      error: "",

    });


    try {

      let conversation =
        this.state.conversation;


      /* ================================================
         CREATE CONVERSATION IF NEEDED
      ================================================ */

      if (!conversation?.id) {

        conversation =
          await this.startConversation({

            visitorName:
              this.state.visitorName,

            visitorEmail:
              this.state.visitorEmail,

          });


        if (!conversation) {

          throw new Error(
            "Unable to create conversation."
          );

        }

      }


      /* ================================================
         SEND TEXT THROUGH CHAT SERVICE
      ================================================ */

      const sentMessage =
        await sendMessage({

          conversationId:
            conversation.id,

          message:
            cleanMessage,

          sender:
            "visitor",

          visitorName:
            this.state.visitorName,

          visitorEmail:
            this.state.visitorEmail,

        });


      if (!sentMessage) {

        throw new Error(
          "The message could not be sent."
        );

      }


      /* ================================================
         HANDLE RECOVERED CONVERSATION
      ================================================ */

      await this.handleRecoveredConversation(
        sentMessage,
        conversation
      );


      /* ================================================
         ADD LOCALLY
      ================================================ */

      this.addMessage(
        sentMessage
      );


      return sentMessage;

    } catch (error) {

      console.error(
        "Send text message error:",
        error
      );


      this.setError(
        error?.message ||
        "Failed to send message."
      );


      return null;

    } finally {

      this.setState({

        sending: false,

      });

    }

  }


  /* =========================================================
     SEND MESSAGE ALIAS
     ---------------------------------------------------------
     ChatController.jsx calls:
       chatController.sendMessage(message)

     Internally:
       this.send(message)
  ========================================================= */

  async sendMessage(
    message
  ) {

    return await this.send(
      message
    );

  }


  /* =========================================================
     SEND VOICE MESSAGE
  ========================================================= */

  async sendVoice(
    blob
  ) {

    if (
      !blob ||
      !(blob instanceof Blob)
    ) {

      this.setError(
        "No voice recording is available."
      );

      return null;

    }


    if (
      this.state.sending ||
      this.state.recording
    ) {

      return null;

    }


    this.setState({

      sending: true,

      error: "",

    });


    try {

      let conversation =
        this.state.conversation;


      /* ================================================
         CREATE CONVERSATION IF NEEDED
      ================================================ */

      if (!conversation?.id) {

        conversation =
          await this.startConversation({

            visitorName:
              this.state.visitorName,

            visitorEmail:
              this.state.visitorEmail,

          });


        if (!conversation) {

          throw new Error(
            "Unable to create conversation."
          );

        }

      }


      /* ================================================
         SEND VOICE MESSAGE
      ================================================ */

      const sentMessage =
        await sendVoiceMessage({

          conversationId:
            conversation.id,

          audioBlob:
            blob,

          visitorName:
            this.state.visitorName,

          visitorEmail:
            this.state.visitorEmail,

        });


      if (!sentMessage) {

        throw new Error(
          "The voice message could not be sent."
        );

      }


      /* ================================================
         HANDLE RECOVERY
      ================================================ */

      await this.handleRecoveredConversation(
        sentMessage,
        conversation
      );


      /* ================================================
         ADD MESSAGE
      ================================================ */

      this.addMessage(
        sentMessage
      );


      return sentMessage;

    } catch (error) {

      console.error(
        "Send voice message error:",
        error
      );


      this.setError(
        error?.message ||
        "Failed to send voice message."
      );


      return null;

    } finally {

      this.setState({

        sending: false,

      });

    }

  }


  /* =========================================================
     SEND VOICE MESSAGE ALIAS
  ========================================================= */

  async sendVoiceMessage(
    blob
  ) {

    const result =
      await this.sendVoice(
        blob
      );


    if (result) {

      this.clearVoicePreview();

      this.setState({

        recordingDuration: 0,

      });

    }


    return result;

  }


  /* =========================================================
     HANDLE RECOVERED CONVERSATION
  ========================================================= */

  async handleRecoveredConversation(
    sentMessage,
    conversation
  ) {

    if (
      !sentMessage?.conversation_id ||
      sentMessage.conversation_id ===
        conversation.id
    ) {

      return;

    }


    const newConversation =
      await getConversation(
        sentMessage.conversation_id
      );


    if (!newConversation) {

      return;

    }


    this.unsubscribeFromMessages();


    this.setState({

      conversation:
        newConversation,

      visitorName:
        newConversation.visitor_name ||
        this.state.visitorName,

      visitorEmail:
        newConversation.visitor_email ||
        this.state.visitorEmail,

      isStarted: true,

    });


    this.subscribeToConversation(
      newConversation
    );

  }


  /* =========================================================
     START VOICE RECORDING
  ========================================================= */

  async startRecording() {

    if (
      this.state.recording ||
      this.state.sending
    ) {

      return false;

    }


    if (!this.state.isStarted) {

      this.setError(
        "Start the conversation before recording a voice message."
      );

      return false;

    }


    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {

      this.setError(
        "Voice recording is not supported by this browser."
      );

      return false;

    }


    try {

      this.clearError();


      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });


      this.mediaStream =
        stream;


      const mimeTypes = [

        "audio/webm;codecs=opus",

        "audio/webm",

        "audio/mp4",

        "audio/ogg;codecs=opus",

        "audio/ogg",

      ];


      const supportedMimeType =
        mimeTypes.find(
          (type) =>
            typeof MediaRecorder !==
              "undefined" &&
            MediaRecorder.isTypeSupported(
              type
            )
        ) || "";


      this.recordingChunks =
        [];


      this.discardRecording =
        false;


      this.mediaRecorder =
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


      this.mediaRecorder.ondataavailable =
        (event) => {

          if (
            event.data &&
            event.data.size > 0
          ) {

            this.recordingChunks.push(
              event.data
            );

          }

        };


      this.mediaRecorder.onstop =
        () => {

          const mimeType =
            this.mediaRecorder?.mimeType ||
            supportedMimeType ||
            "audio/webm";


          const blob =
            new Blob(
              this.recordingChunks,
              {
                type:
                  mimeType,
              }
            );


          this.recordingChunks =
            [];


          this.stopMediaStream();


          if (
            this.discardRecording
          ) {

            this.discardRecording =
              false;

            this.mediaRecorder =
              null;

            return;

          }


          if (blob.size > 0) {

            this.createVoicePreview(
              blob
            );

          } else {

            this.mediaRecorder =
              null;

            this.setState({

              recording: false,

              recordingDuration: 0,

            });

          }

        };


      this.mediaRecorder.onerror =
        (event) => {

          console.error(
            "MediaRecorder error:",
            event
          );


          this.stopMediaStream();

          this.mediaRecorder =
            null;

          this.recordingChunks =
            [];


          this.setState({

            recording: false,

            recordingDuration: 0,

          });


          this.setError(
            "Voice recording failed."
          );

        };


      this.mediaRecorder.start();


      this.recordingStartedAt =
        Date.now();


      this.recordingTimer =
        window.setInterval(
          () => {

            const elapsed =
              Math.floor(
                (
                  Date.now() -
                  this.recordingStartedAt
                ) / 1000
              );


            this.setState({

              recordingDuration:
                elapsed,

            });

          },
          250
        );


      this.setState({

        recording: true,

        recordingDuration: 0,

        voiceBlob: null,

        voicePreviewUrl: "",

        error: "",

      });


      return true;

    } catch (error) {

      console.error(
        "Start recording error:",
        error
      );


      this.stopMediaStream();

      this.mediaRecorder =
        null;


      this.setState({

        recording: false,

        recordingDuration: 0,

      });


      if (
        error?.name ===
        "NotAllowedError"
      ) {

        this.setError(
          "Microphone permission was denied."
        );

      } else if (
        error?.name ===
        "NotFoundError"
      ) {

        this.setError(
          "No microphone was found."
        );

      } else {

        this.setError(
          "Unable to access your microphone."
        );

      }


      return false;

    }

  }


  /* =========================================================
     STOP RECORDING
  ========================================================= */

  stopRecording() {

    if (
      !this.mediaRecorder ||
      this.mediaRecorder.state ===
        "inactive"
    ) {

      return null;

    }


    this.clearRecordingTimer();


    try {

      this.mediaRecorder.stop();

    } catch (error) {

      console.error(
        "Stop recording error:",
        error
      );

      this.stopMediaStream();

    }


    return true;

  }


  /* =========================================================
     CREATE VOICE PREVIEW
  ========================================================= */

  createVoicePreview(
    blob
  ) {

    this.clearVoicePreview();


    const previewUrl =
      URL.createObjectURL(
        blob
      );


    this.setState({

      recording: false,

      recordingDuration:
        this.state.recordingDuration,

      voiceBlob:
        blob,

      voicePreviewUrl:
        previewUrl,

    });


    this.mediaRecorder =
      null;

  }


  /* =========================================================
     CANCEL VOICE RECORDING
  ========================================================= */

  cancelRecording() {

    this.clearRecordingTimer();


    this.discardRecording =
      true;


    if (this.mediaRecorder) {

      try {

        if (
          this.mediaRecorder.state !==
          "inactive"
        ) {

          this.mediaRecorder.stop();

        }

      } catch {

        this.mediaRecorder =
          null;

      }

    }


    this.stopMediaStream();

    this.mediaRecorder =
      null;

    this.recordingChunks =
      [];


    this.clearVoicePreview();


    this.setState({

      recording: false,

      recordingDuration: 0,

      voiceBlob: null,

      voicePreviewUrl: "",

    });

  }


  /* =========================================================
     SEND CURRENT VOICE PREVIEW
  ========================================================= */

  async sendRecordedVoice() {

    const blob =
      this.state.voiceBlob;


    if (!blob) {

      this.setError(
        "No voice recording is ready to send."
      );

      return null;

    }


    const result =
      await this.sendVoice(
        blob
      );


    if (result) {

      this.clearVoicePreview();

      this.setState({

        recordingDuration: 0,

      });

    }


    return result;

  }


  /* =========================================================
     CLEAR VOICE PREVIEW
  ========================================================= */

  clearVoicePreview() {

    const previewUrl =
      this.state.voicePreviewUrl;


    if (previewUrl) {

      try {

        URL.revokeObjectURL(
          previewUrl
        );

      } catch {
        /* Ignore URL cleanup errors. */
      }

    }


    this.setState({

      voiceBlob: null,

      voicePreviewUrl: "",

    });

  }


  /* =========================================================
     RECORDING TIMER
  ========================================================= */

  clearRecordingTimer() {

    if (this.recordingTimer) {

      clearInterval(
        this.recordingTimer
      );

      this.recordingTimer =
        null;

    }

  }


  /* =========================================================
     STOP MEDIA STREAM
  ========================================================= */

  stopMediaStream() {

    if (this.mediaStream) {

      this.mediaStream
        .getTracks()
        .forEach(
          (track) => {

            try {

              track.stop();

            } catch {
              /* Ignore track cleanup errors. */
            }

          }
        );

    }


    this.mediaStream =
      null;

  }


  /* =========================================================
     SET VISITOR
  ========================================================= */

  setVisitor({

    visitorName = "",

    visitorEmail = "",

  } = {}) {

    this.setState({

      visitorName:
        String(
          visitorName
        ).trim(),

      visitorEmail:
        String(
          visitorEmail
        ).trim(),

    });

  }


  /* =========================================================
     ERROR
  ========================================================= */

  setError(
    error
  ) {

    this.setState({

      error:
        error || "",

    });

  }


  clearError() {

    this.setState({

      error: "",

    });

  }


  /* =========================================================
     OPEN CHAT
  ========================================================= */

  open() {

    this.setState({

      isOpen: true,

    });

  }


  /* =========================================================
     CLOSE CHAT
  ========================================================= */

  close() {

    this.setState({

      isOpen: false,

    });

  }


  /* =========================================================
     TOGGLE CHAT
  ========================================================= */

  toggle() {

    this.setState({

      isOpen:
        !this.state.isOpen,

    });

  }


  /* =========================================================
     END CONVERSATION
  ========================================================= */

  async endConversation() {

    this.cancelRecording();

    this.unsubscribeFromMessages();

    clearStoredConversation();


    this.setState({

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

      recording: false,

      recordingDuration: 0,

      voiceBlob: null,

      voicePreviewUrl: "",

      error: "",

      conversation: null,

      messages: [],

      visitorName: "",

      visitorEmail: "",

    });

  }


  /* =========================================================
     RESET
  ========================================================= */

  reset() {

    this.cancelRecording();

    this.unsubscribeFromMessages();

    clearStoredConversation();


    this.setState({

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

      recording: false,

      recordingDuration: 0,

      voiceBlob: null,

      voicePreviewUrl: "",

      error: "",

      conversation: null,

      messages: [],

      visitorName: "",

      visitorEmail: "",

    });

  }


  /* =========================================================
     GET CONVERSATION
  ========================================================= */

  getConversation() {

    return this.state.conversation;

  }


  /* =========================================================
     GET MESSAGES
  ========================================================= */

  getMessages() {

    return [
      ...this.state.messages,
    ];

  }


  /* =========================================================
     HAS CONVERSATION
  ========================================================= */

  hasConversation() {

    return Boolean(
      this.state.conversation?.id
    );

  }


  /* =========================================================
     IS OPEN
  ========================================================= */

  getIsOpen() {

    return this.state.isOpen;

  }


  /* =========================================================
     DISPATCH EVENT
  ========================================================= */

  dispatchEvent(
    eventName,
    detail = {}
  ) {

    if (
      typeof window ===
      "undefined"
    ) {

      return;

    }


    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail,
        }
      )
    );

  }


  /* =========================================================
     DESTROY
  ========================================================= */

  destroy() {

    this.cancelRecording();

    this.unsubscribeFromMessages();

    this.listeners.clear();

    this.initialized =
      false;

  }

}


/* =========================================================
   SINGLETON
========================================================= */

const chatController =
  new ChatController();


export default chatController;


export {
  ChatController,
};