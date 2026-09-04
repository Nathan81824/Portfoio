/* =========================================================
   CHAT CONTROLLER

   Nathan — Frontend Developer Portfolio

   PURPOSE
   ---------------------------------------------------------
   Controls the visitor chat experience.

   Handles:
   - Starting conversations
   - Restoring conversations
   - Loading messages
   - Sending visitor messages
   - Realtime message subscriptions
   - Clearing local chat state
   - Opening / closing the floating chat
   - Chat events

   DATABASE OPERATIONS
   ---------------------------------------------------------
   chat.js owns:
   - Conversations
   - Messages
   - Supabase
   - Realtime
   - Permanent deletion

   chatController.js owns:
   - Chat UI state
   - Chat interaction flow
   - Chat events

   notification.js owns:
   - Notifications
   - Browser notifications
   - Unanswered-message reminders
========================================================= */


/* =========================================================
   CHAT SERVICE
========================================================= */

import {
  getStoredConversation,
  getConversation,
  getMessages,
  sendMessage,
  subscribeToMessages,
  clearStoredConversation,
} from "./chat.js";


/* =========================================================
   EVENTS
========================================================= */

export const EVENTS = {

  OPEN:
    "floating-chat:open",

  CLOSE:
    "floating-chat:close",

  TOGGLE:
    "floating-chat:toggle",

  STARTED:
    "floating-chat:started",

  NEW_MESSAGE:
    "floating-chat:new-message",

  CLEARED:
    "floating-chat:cleared",

  ERROR:
    "floating-chat:error",

};


/* =========================================================
   EVENT DISPATCHER
========================================================= */

function emit(
  eventName,
  detail = {}
) {

  try {

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail,
        }
      )
    );

  } catch (error) {

    console.warn(
      "Could not dispatch chat event:",
      error
    );

  }

}


/* =========================================================
   CHAT CONTROLLER FACTORY
========================================================= */

export function createChatController() {

  /* =======================================================
     STATE
  ======================================================= */

  let currentConversation =
    null;

  let unsubscribe =
    null;

  let isOpen =
    false;


  /* =======================================================
     START CONVERSATION
  ======================================================= */

  async function start({
    name,
    email = "",
  }) {

    const cleanName =
      String(
        name || ""
      ).trim();

    const cleanEmail =
      String(
        email || ""
      ).trim();


    if (!cleanName) {

      throw new Error(
        "Please enter your name."
      );

    }


    /*
      chat.js should handle creating or
      restoring the conversation.
    */

    const conversation =
      await getStoredConversation();


    if (
      conversation?.id &&
      conversation?.visitor_name ===
        cleanName
    ) {

      currentConversation =
        conversation;


      emit(
        EVENTS.STARTED,
        {
          conversation,
        }
      );


      return conversation;

    }


    /*
      Create a new conversation directly
      through chat.js.

      We use a dynamic import here so the
      controller remains compatible with the
      chat service architecture.
    */

    const {
      createConversation,
    } = await import(
      "./chat.js"
    );


    const newConversation =
      await createConversation({

        visitorName:
          cleanName,

        visitorEmail:
          cleanEmail,

      });


    currentConversation =
      newConversation;


    emit(
      EVENTS.STARTED,
      {
        conversation:
          newConversation,
      }
    );


    return newConversation;

  }


  /* =======================================================
     RESTORE SAVED CONVERSATION
  ======================================================= */

  async function restore() {

    try {

      const savedConversation =
        await getStoredConversation();


      if (
        !savedConversation?.id
      ) {

        return null;

      }


      /*
        Verify that the conversation still
        exists in Supabase.

        If it was permanently deleted,
        getConversation() returns null.
      */

      const conversation =
        await getConversation(
          savedConversation.id
        );


      if (!conversation) {

        currentConversation =
          null;

        return null;

      }


      currentConversation =
        conversation;


      emit(
        EVENTS.STARTED,
        {
          conversation,
        }
      );


      return conversation;

    } catch (error) {

      console.error(
        "Failed to restore conversation:",
        error
      );


      emit(
        EVENTS.ERROR,
        {
          error,
        }
      );


      return null;

    }

  }


  /* =======================================================
     LOAD MESSAGES
  ======================================================= */

  async function load(
    conversationId
  ) {

    const id =
      conversationId ||
      currentConversation?.id;


    if (!id) {

      return [];

    }


    try {

      const messages =
        await getMessages(
          id
        );


      return (
        messages || []
      );

    } catch (error) {

      emit(
        EVENTS.ERROR,
        {
          error,
        }
      );


      throw error;

    }

  }


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  async function send({
    message,
    conversationId,
  }) {

    const cleanMessage =
      String(
        message || ""
      ).trim();


    if (!cleanMessage) {

      return null;

    }


    const id =
      conversationId ||
      currentConversation?.id;


    if (!id) {

      throw new Error(
        "No active conversation."
      );

    }


    try {

      const sentMessage =
        await sendMessage({

          conversationId:
            id,

          message:
            cleanMessage,

          sender:
            "visitor",

        });


      /*
        Realtime normally delivers this
        message to the UI as well.

        This event is still useful for
        local UI updates and other systems.
      */

      emit(
        EVENTS.NEW_MESSAGE,
        {
          message:
            sentMessage,
        }
      );


      return sentMessage;

    } catch (error) {

      emit(
        EVENTS.ERROR,
        {
          error,
        }
      );


      throw error;

    }

  }


  /* =======================================================
     SUBSCRIBE TO REALTIME MESSAGES
  ======================================================= */

  function subscribe(
    conversationId,
    callback
  ) {

    const id =
      conversationId ||
      currentConversation?.id;


    if (!id) {

      return () => {};

    }


    /*
      Remove previous subscription.
    */

    if (
      typeof unsubscribe ===
      "function"
    ) {

      unsubscribe();

      unsubscribe =
        null;

    }


    /*
      chat.js returns an object containing
      an unsubscribe function.
    */

    const subscription =
      subscribeToMessages({

        conversationId:
          id,

        onMessage:
          (message) => {

            if (
              typeof callback ===
              "function"
            ) {

              callback(
                message
              );

            }


            emit(
              EVENTS.NEW_MESSAGE,
              {
                message,
              }
            );

          },

        onDelete:
          (message) => {

            emit(
              EVENTS.NEW_MESSAGE,
              {
                type:
                  "DELETE",

                message,
              }
            );

          },

      });


    unsubscribe =
      subscription?.unsubscribe ||
      null;


    return () => {

      if (
        typeof unsubscribe ===
        "function"
      ) {

        unsubscribe();

        unsubscribe =
          null;

      }

    };

  }


  /* =======================================================
     GET CURRENT CONVERSATION
  ======================================================= */

  function getConversation() {

    return currentConversation;

  }


  /* =======================================================
     CHECK ACTIVE CONVERSATION
  ======================================================= */

  function hasConversation() {

    return Boolean(
      currentConversation?.id
    );

  }


  /* =======================================================
     GET OPEN STATE
  ======================================================= */

  function getIsOpen() {

    return isOpen;

  }


  /* =======================================================
     OPEN CHAT
  ======================================================= */

  function open() {

    isOpen =
      true;


    emit(
      EVENTS.OPEN
    );


    return true;

  }


  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  function close() {

    isOpen =
      false;


    emit(
      EVENTS.CLOSE
    );


    return false;

  }


  /* =======================================================
     TOGGLE CHAT
  ======================================================= */

  function toggle() {

    isOpen =
      !isOpen;


    emit(
      isOpen
        ? EVENTS.OPEN
        : EVENTS.CLOSE
    );


    return isOpen;

  }


  /* =======================================================
     CLEAR LOCAL CHAT
     -------------------------------------------------------
     This clears the visitor's LOCAL chat state.

     It does NOT permanently delete the
     Supabase conversation.
========================================================= */

  async function clear() {

    /*
      Stop realtime first.
    */

    if (
      typeof unsubscribe ===
      "function"
    ) {

      unsubscribe();

      unsubscribe =
        null;

    }


    /*
      Remove stored conversation.
    */

    clearStoredConversation();


    /*
      Reset controller state.
    */

    currentConversation =
      null;


    /*
      Close the chat.
    */

    isOpen =
      false;


    emit(
      EVENTS.CLEARED
    );

  }


  /* =======================================================
     RESET CONTROLLER
  ======================================================= */

  function reset() {

    if (
      typeof unsubscribe ===
      "function"
    ) {

      unsubscribe();

      unsubscribe =
        null;

    }


    currentConversation =
      null;

    isOpen =
      false;

  }


  /* =======================================================
     DESTROY
  ======================================================= */

  function destroy() {

    reset();

  }


  /* =======================================================
     CONTROLLER API
  ======================================================= */

  return {

    start,

    restore,

    load,

    send,

    subscribe,

    getConversation,

    hasConversation,

    getIsOpen,

    open,

    close,

    toggle,

    clear,

    reset,

    destroy,

  };

}


/* =========================================================
   SINGLETON
========================================================= */

const chatController =
  createChatController();


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default chatController;