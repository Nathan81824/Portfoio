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
   - Send messages
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
  subscribeToMessages,
  clearStoredConversation,
} from "./chat.js";


/* =========================================================
   CHAT CONTROLLER CLASS
========================================================= */

class ChatController {

  constructor() {

    /* =====================================================
       STATE
    ===================================================== */

    this.state = {

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

      error: "",

      conversation: null,

      messages: [],

      visitorName: "",

      visitorEmail: "",

    };


    /* =====================================================
       SUBSCRIBERS
    ===================================================== */

    this.listeners =
      new Set();


    /* =====================================================
       REALTIME SUBSCRIPTION
    ===================================================== */

    this.unsubscribeMessages =
      null;


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    this.initialized =
      false;

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

  setState(
    updates
  ) {

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

    const nextState =
      this.getState();


    this.listeners.forEach(
      (listener) => {

        try {

          listener(
            nextState
          );

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

  subscribe(
    listener
  ) {

    if (
      typeof listener !==
      "function"
    ) {

      return () => {};

    }


    this.listeners.add(
      listener
    );


    /*
      Immediately provide
      the current state.
    */

    listener(
      this.getState()
    );


    return () => {

      this.listeners.delete(
        listener
      );

    };

  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  async initialize() {

    if (
      this.initialized
    ) {

      return this.getState();

    }


    this.initialized =
      true;


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


      if (
        !stored?.id
      ) {

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


      if (
        !conversation
      ) {

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
      this.state.sending
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
         REALTIME SUBSCRIPTION
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

    if (
      !conversation?.id
    ) {

      return;

    }


    /* ================================================
       REMOVE OLD SUBSCRIPTION
    ================================================ */

    this.unsubscribeFromMessages();


    /* ================================================
       ACCESS TOKEN
    ================================================ */

    const accessToken =
      conversation.access_token ||
      null;


    /* ================================================
       CREATE REALTIME SUBSCRIPTION
    ================================================ */

    this.unsubscribeMessages =
      subscribeToMessages({

        conversationId:
          conversation.id,

        accessToken,

        /* ==========================================
           NEW MESSAGE
        ========================================== */

        onMessage:
          (newMessage) => {

            this.addMessage(
              newMessage
            );

          },


        /* ==========================================
           UPDATED MESSAGE
        ========================================== */

        onUpdate:
          (updatedMessage) => {

            this.updateMessage(
              updatedMessage
            );

          },


        /* ==========================================
           DELETED MESSAGE
        ========================================== */

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


    this.unsubscribeMessages =
      null;

  }


  /* =========================================================
     ADD MESSAGE
  ========================================================= */

  addMessage(
    message
  ) {

    if (
      !message?.id
    ) {

      return;

    }


    this.setState({

      messages: [

        ...this.state.messages.filter(
          (item) =>
            item.id !==
            message.id
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

    if (
      !message?.id
    ) {

      return;

    }


    this.setState({

      messages:
        this.state.messages.map(
          (item) =>
            item.id ===
            message.id

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

    if (
      !message?.id
    ) {

      return;

    }


    this.setState({

      messages:
        this.state.messages.filter(
          (item) =>
            item.id !==
            message.id
        ),

    });

  }


  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  async send(
    message
  ) {

    const cleanMessage =
      typeof message ===
      "string"

        ? message.trim()

        : "";


    if (!cleanMessage) {

      return null;

    }


    if (
      this.state.sending
    ) {

      return null;

    }


    this.setState({

      sending: true,

      error: "",

    });


    try {

      /* ================================================
         CURRENT CONVERSATION
      ================================================ */

      let conversation =
        this.state.conversation;


      /* ================================================
         CREATE CONVERSATION IF NEEDED
      ================================================ */

      if (
        !conversation?.id
      ) {

        conversation =
          await this.startConversation({

            visitorName:
              this.state.visitorName,

            visitorEmail:
              this.state.visitorEmail,

          });


        if (
          !conversation
        ) {

          throw new Error(
            "Unable to create conversation."
          );

        }

      }


      /* ================================================
         SEND TO SUPABASE
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


      /* ================================================
         RECOVER NEW CONVERSATION
         IF THE OLD ONE WAS DELETED
      ================================================ */

      if (
        sentMessage?.conversation_id &&
        sentMessage.conversation_id !==
          conversation.id
      ) {

        const newConversation =
          await getConversation(
            sentMessage.conversation_id
          );


        if (
          newConversation
        ) {

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

      }


      /* ================================================
         ADD SENT MESSAGE LOCALLY
      ================================================ */

      this.addMessage(
        sentMessage
      );


      return sentMessage;

    } catch (error) {

      console.error(
        "Send message error:",
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

  endConversation() {

    this.unsubscribeFromMessages();


    clearStoredConversation();


    this.setState({

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

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

    this.unsubscribeFromMessages();


    clearStoredConversation();


    this.setState({

      isOpen: false,

      isStarted: false,

      loading: false,

      sending: false,

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

