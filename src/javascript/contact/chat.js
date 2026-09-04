/* =========================================================
   CHAT SERVICE
   Supabase communication layer for portfolio chat.

   Responsibilities:
   - Create conversations
   - Store visitor conversation locally
   - Restore conversations
   - Validate conversations
   - Load messages
   - Send visitor/admin messages
   - Recover deleted/stale conversations
   - Realtime message subscriptions
   - Delete conversations
   - Delete all conversations

   React UI is NOT handled here.

   React component:
   components/Contact/ChatController.jsx
========================================================= */

import {
  supabase,
  getChatClient,
} from "../supabase/supabaseClient.js";


/* =========================================================
   STORAGE KEYS
========================================================= */

const CONVERSATION_STORAGE_KEY =
  "portfolio_chat_conversation";

const TOKEN_STORAGE_KEY =
  "portfolio_chat_token";

const DELETED_CONVERSATIONS_KEY =
  "portfolio_deleted_conversations";


/* =========================================================
   SAFE STORAGE
========================================================= */

const hasLocalStorage =
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined";


/* =========================================================
   GET STORED CONVERSATION
========================================================= */

export function getStoredConversation() {

  if (!hasLocalStorage) {
    return null;
  }

  try {

    const stored =
      window.localStorage.getItem(
        CONVERSATION_STORAGE_KEY
      );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);

  } catch (error) {

    console.error(
      "Failed to read stored conversation:",
      error
    );

    return null;
  }
}


/* =========================================================
   STORE CONVERSATION
========================================================= */

function storeConversation(
  conversation
) {

  if (
    !hasLocalStorage ||
    !conversation
  ) {
    return;
  }

  try {

    window.localStorage.setItem(
      CONVERSATION_STORAGE_KEY,
      JSON.stringify(conversation)
    );

    if (
      conversation.access_token
    ) {

      window.localStorage.setItem(
        TOKEN_STORAGE_KEY,
        conversation.access_token
      );

    }

  } catch (error) {

    console.error(
      "Failed to store conversation:",
      error
    );

  }
}


/* =========================================================
   CLEAR STORED CONVERSATION
========================================================= */

export function clearStoredConversation() {

  if (!hasLocalStorage) {
    return;
  }

  try {

    window.localStorage.removeItem(
      CONVERSATION_STORAGE_KEY
    );

    window.localStorage.removeItem(
      TOKEN_STORAGE_KEY
    );

  } catch (error) {

    console.error(
      "Failed to clear stored conversation:",
      error
    );

  }
}


/* =========================================================
   MARK DELETED CONVERSATION
========================================================= */

function markConversationDeleted(
  conversationId
) {

  if (
    !hasLocalStorage ||
    !conversationId
  ) {
    return;
  }

  try {

    const stored =
      window.localStorage.getItem(
        DELETED_CONVERSATIONS_KEY
      );

    const ids =
      stored
        ? JSON.parse(stored)
        : [];

    const next =
      Array.isArray(ids)
        ? ids
        : [];

    if (
      !next.includes(conversationId)
    ) {

      next.push(
        conversationId
      );

    }

    const limited =
      next.slice(-50);

    window.localStorage.setItem(
      DELETED_CONVERSATIONS_KEY,
      JSON.stringify(limited)
    );

  } catch (error) {

    console.error(
      "Failed to mark conversation as deleted:",
      error
    );

  }
}


/* =========================================================
   CHECK DELETED CONVERSATION
========================================================= */

function isConversationMarkedDeleted(
  conversationId
) {

  if (
    !hasLocalStorage ||
    !conversationId
  ) {
    return false;
  }

  try {

    const stored =
      window.localStorage.getItem(
        DELETED_CONVERSATIONS_KEY
      );

    if (!stored) {
      return false;
    }

    const ids =
      JSON.parse(stored);

    return (
      Array.isArray(ids) &&
      ids.includes(conversationId)
    );

  } catch {

    return false;

  }
}


/* =========================================================
   CREATE CONVERSATION
========================================================= */

export async function createConversation({

  visitorName = "",

  visitorEmail = "",

} = {}) {

  const cleanName =
    String(
      visitorName
    ).trim();

  const cleanEmail =
    String(
      visitorEmail
    ).trim();


  if (!cleanName) {

    throw new Error(
      "Please enter your name before starting the chat."
    );

  }


  /* =======================================================
     ACCESS TOKEN
  ======================================================= */

  const accessToken =
    crypto.randomUUID();


  /* =======================================================
     CREATE DATABASE ROW
  ======================================================= */

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "conversations"
      )

      .insert({

        visitor_name:
          cleanName,

        visitor_email:
          cleanEmail,

        access_token:
          accessToken,

      })

      .select(`
        id,
        visitor_name,
        visitor_email,
        access_token,
        created_at
      `)

      .single();


  if (error) {

    console.error(
      "Create conversation error:",
      error
    );

    throw error;

  }


  if (!data?.id) {

    throw new Error(
      "Conversation was not created."
    );

  }


  /* =======================================================
     STORE LOCALLY
  ======================================================= */

  storeConversation(
    data
  );


  /* =======================================================
     REMOVE FROM DELETED LIST
  ======================================================= */

  if (
    hasLocalStorage
  ) {

    try {

      const stored =
        window.localStorage.getItem(
          DELETED_CONVERSATIONS_KEY
        );

      const ids =
        stored
          ? JSON.parse(stored)
          : [];

      if (
        Array.isArray(ids)
      ) {

        window.localStorage.setItem(
          DELETED_CONVERSATIONS_KEY,
          JSON.stringify(
            ids.filter(
              (id) =>
                id !== data.id
            )
          )
        );

      }

    } catch {
      /* Ignore storage cleanup errors. */
    }

  }


  /* =======================================================
     APPLICATION EVENT
  ======================================================= */

  if (
    typeof window !==
    "undefined"
  ) {

    window.dispatchEvent(
      new CustomEvent(
        "portfolio:conversation-created",
        {
          detail: {
            conversation:
              data,
          },
        }
      )
    );

  }


  return data;

}


/* =========================================================
   GET CONVERSATION
========================================================= */

export async function getConversation(
  conversationId
) {

  if (!conversationId) {
    return null;
  }


  try {

    const {
      data,
      error,
    } =
      await supabase

        .from(
          "conversations"
        )

        .select(`
          id,
          visitor_name,
          visitor_email,
          access_token,
          created_at
        `)

        .eq(
          "id",
          conversationId
        )

        .maybeSingle();


    if (error) {

      console.error(
        "Get conversation error:",
        error
      );

      throw error;

    }


    if (!data) {

      const stored =
        getStoredConversation();


      if (
        stored?.id ===
        conversationId
      ) {

        clearStoredConversation();

      }


      return null;

    }


    /* =====================================================
       KEEP LOCAL STORAGE UPDATED
    ===================================================== */

    const stored =
      getStoredConversation();


    if (
      stored?.id ===
      data.id
    ) {

      storeConversation(
        data
      );

    }


    return data;

  } catch (error) {

    if (
      error?.code ===
      "PGRST116"
    ) {

      return null;

    }

    throw error;

  }

}


/* =========================================================
   VALIDATE STORED CONVERSATION
========================================================= */

export async function validateStoredConversation() {

  const stored =
    getStoredConversation();


  if (!stored?.id) {
    return null;
  }


  const conversation =
    await getConversation(
      stored.id
    );


  if (!conversation) {

    clearStoredConversation();

    return null;

  }


  storeConversation(
    conversation
  );


  return conversation;

}


/* =========================================================
   GET MESSAGES
========================================================= */

export async function getMessages(
  conversationId
) {

  if (!conversationId) {
    return [];
  }


  const stored =
    getStoredConversation();


  let client =
    supabase;


  /*
    Visitors use the access-token client.

    Admin uses the normal Supabase client.
  */

  if (
    stored?.id ===
      conversationId &&
    stored?.access_token
  ) {

    client =
      getChatClient(
        stored.access_token
      );

  }


  const {
    data,
    error,
  } =
    await client

      .from(
        "messages"
      )

      .select(`
        id,
        conversation_id,
        message,
        sender,
        created_at
      `)

      .eq(
        "conversation_id",
        conversationId
      )

      .order(
        "created_at",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Get messages error:",
      error
    );

    throw error;

  }


  return data || [];

}


/* =========================================================
   SEND MESSAGE
========================================================= */

export async function sendMessage({

  conversationId,

  message,

  sender = "visitor",

  visitorName = "",

  visitorEmail = "",

} = {}) {

  const cleanMessage =
    typeof message ===
    "string"

      ? message.trim()

      : "";


  if (!cleanMessage) {

    throw new Error(
      "Message cannot be empty."
    );

  }


  if (
    sender !== "visitor" &&
    sender !== "admin"
  ) {

    throw new Error(
      "Invalid message sender."
    );

  }


  /* =======================================================
     ADMIN MESSAGE
  ======================================================= */

  if (
    sender === "admin"
  ) {

    if (!conversationId) {

      throw new Error(
        "A conversation ID is required."
      );

    }


    const {
      data,
      error,
    } =
      await supabase

        .from(
          "messages"
        )

        .insert({

          conversation_id:
            conversationId,

          message:
            cleanMessage,

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


    if (error) {

      console.error(
        "Admin message error:",
        error
      );

      throw error;

    }


    return data;

  }


  /* =======================================================
     VISITOR MESSAGE
  ======================================================= */

  let activeConversation =
    null;


  if (
    conversationId
  ) {

    activeConversation =
      await getConversation(
        conversationId
      );

  }


  /* =======================================================
     RECOVER MISSING CONVERSATION
  ======================================================= */

  if (
    !activeConversation
  ) {

    const stored =
      getStoredConversation();


    const fallbackName =
      String(
        visitorName ||
        stored?.visitor_name ||
        ""
      ).trim();


    const fallbackEmail =
      String(
        visitorEmail ||
        stored?.visitor_email ||
        ""
      ).trim();


    if (!fallbackName) {

      throw new Error(
        "Please enter your name before sending a message."
      );

    }


    clearStoredConversation();


    activeConversation =
      await createConversation({

        visitorName:
          fallbackName,

        visitorEmail:
          fallbackEmail,

      });


    if (
      typeof window !==
      "undefined"
    ) {

      window.dispatchEvent(
        new CustomEvent(
          "portfolio:chat:conversation-recreated",
          {
            detail: {

              oldConversationId:
                conversationId ||
                null,

              conversation:
                activeConversation,

            },
          }
        )
      );

    }

  }


  /* =======================================================
     ACCESS TOKEN
  ======================================================= */

  const accessToken =
    activeConversation?.access_token;


  if (!accessToken) {

    throw new Error(
      "Conversation access token is missing."
    );

  }


  const client =
    getChatClient(
      accessToken
    );


  /* =======================================================
     INSERT VISITOR MESSAGE
  ======================================================= */

  const insertMessage =
    async (
      targetConversationId
    ) => {

      const {
        data,
        error,
      } =
        await client

          .from(
            "messages"
          )

          .insert({

            conversation_id:
              targetConversationId,

            message:
              cleanMessage,

            sender:
              "visitor",

          })

          .select(`
            id,
            conversation_id,
            message,
            sender,
            created_at
          `)

          .single();


      if (error) {
        throw error;
      }


      return data;

    };


  try {

    return await insertMessage(
      activeConversation.id
    );

  } catch (error) {

    if (
      error?.code !==
      "23503"
    ) {

      console.error(
        "Visitor message error:",
        error
      );

      throw error;

    }


    console.warn(
      "Conversation disappeared before message insertion. Creating a new conversation."
    );


    const oldConversationId =
      activeConversation.id;


    markConversationDeleted(
      oldConversationId
    );


    clearStoredConversation();


    const fallbackName =
      String(
        visitorName ||
        activeConversation.visitor_name ||
        ""
      ).trim();


    const fallbackEmail =
      String(
        visitorEmail ||
        activeConversation.visitor_email ||
        ""
      ).trim();


    if (!fallbackName) {

      throw new Error(
        "Your previous conversation was deleted. Please enter your name to start a new conversation."
      );

    }


    const newConversation =
      await createConversation({

        visitorName:
          fallbackName,

        visitorEmail:
          fallbackEmail,

      });


    const newClient =
      getChatClient(
        newConversation.access_token
      );


    const {
      data: retryData,
      error: retryError,
    } =
      await newClient

        .from(
          "messages"
        )

        .insert({

          conversation_id:
            newConversation.id,

          message:
            cleanMessage,

          sender:
            "visitor",

        })

        .select(`
          id,
          conversation_id,
          message,
          sender,
          created_at
        `)

        .single();


    if (retryError) {

      console.error(
        "Recovered message retry error:",
        retryError
      );

      throw retryError;

    }


    if (
      typeof window !==
      "undefined"
    ) {

      window.dispatchEvent(
        new CustomEvent(
          "portfolio:chat:conversation-recreated",
          {
            detail: {

              oldConversationId,

              conversation:
                newConversation,

              message:
                retryData,

            },
          }
        )
      );


      window.dispatchEvent(
        new CustomEvent(
          "portfolio:chat:message-sent",
          {
            detail: {

              message:
                retryData,

              conversation:
                newConversation,

            },
          }
        )
      );

    }


    return retryData;

  }

}


/* =========================================================
   REALTIME MESSAGE SUBSCRIPTION
========================================================= */

export function subscribeToMessages({

  conversationId,

  accessToken = null,

  onMessage,

  onUpdate,

  onDelete,

} = {}) {

  if (!conversationId) {

    return () => {};

  }


  /* =======================================================
     USE TOKEN CLIENT FOR VISITOR
  ======================================================= */

  const client =
    accessToken
      ? getChatClient(accessToken)
      : supabase;


  /* =======================================================
     UNIQUE CHANNEL
  ======================================================= */

  const channel =
    client.channel(
      `portfolio-chat-${conversationId}-${Date.now()}`
    );


  /* =======================================================
     INSERT
  ======================================================= */

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter:
        `conversation_id=eq.${conversationId}`,
    },
    (payload) => {

      console.log(
        "Realtime message received:",
        payload.new
      );


      if (
        typeof onMessage ===
        "function"
      ) {

        onMessage(
          payload.new
        );

      }

    }
  );


  /* =======================================================
     UPDATE
  ======================================================= */

  channel.on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "messages",
      filter:
        `conversation_id=eq.${conversationId}`,
    },
    (payload) => {

      if (
        typeof onUpdate ===
        "function"
      ) {

        onUpdate(
          payload.new
        );

      }

    }
  );


  /* =======================================================
     DELETE
  ======================================================= */

  channel.on(
    "postgres_changes",
    {
      event: "DELETE",
      schema: "public",
      table: "messages",
      filter:
        `conversation_id=eq.${conversationId}`,
    },
    (payload) => {

      if (
        typeof onDelete ===
        "function"
      ) {

        onDelete(
          payload.old
        );

      }

    }
  );


  /* =======================================================
     SUBSCRIBE
  ======================================================= */

  channel.subscribe(
    (status) => {

      console.log(
        `Chat realtime status: ${status}`
      );


      if (
        status ===
        "SUBSCRIBED"
      ) {

        console.log(
          "Chat realtime connected."
        );

      }


      if (
        status ===
        "CHANNEL_ERROR"
      ) {

        console.error(
          "Chat realtime channel error."
        );

      }


      if (
        status ===
        "TIMED_OUT"
      ) {

        console.warn(
          "Chat realtime subscription timed out."
        );

      }


      if (
        status ===
        "CLOSED"
      ) {

        console.warn(
          "Chat realtime channel closed."
        );

      }

    }
  );


  /* =======================================================
     CLEANUP
  ======================================================= */

  return () => {

    client.removeChannel(
      channel
    );

  };

}


/* =========================================================
   SUBSCRIBE TO CONVERSATIONS
========================================================= */

export function subscribeToConversations({

  onInsert,

  onUpdate,

  onDelete,

} = {}) {

  const channel =
    supabase.channel(
      `portfolio-conversations-${Date.now()}`
    );


  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "conversations",
    },
    (payload) => {

      if (
        typeof onInsert ===
        "function"
      ) {

        onInsert(
          payload.new
        );

      }

    }
  );


  channel.on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "conversations",
    },
    (payload) => {

      if (
        typeof onUpdate ===
        "function"
      ) {

        onUpdate(
          payload.new
        );

      }

    }
  );


  channel.on(
    "postgres_changes",
    {
      event: "DELETE",
      schema: "public",
      table: "conversations",
    },
    (payload) => {

      if (
        typeof onDelete ===
        "function"
      ) {

        onDelete(
          payload.old
        );

      }

    }
  );


  channel.subscribe(
    (status) => {

      console.log(
        `Conversation realtime status: ${status}`
      );

    }
  );


  return {

    channel,

    unsubscribe: () => {

      supabase.removeChannel(
        channel
      );

    },

  };

}


/* =========================================================
   DELETE ONE CONVERSATION
========================================================= */

export async function deleteConversation(
  conversationId
) {

  if (!conversationId) {

    throw new Error(
      "Conversation ID is required."
    );

  }


  /* =======================================================
     DELETE MESSAGES
  ======================================================= */

  const {
    error: messagesError,
  } =
    await supabase

      .from(
        "messages"
      )

      .delete()

      .eq(
        "conversation_id",
        conversationId
      );


  if (messagesError) {

    throw messagesError;

  }


  /* =======================================================
     DELETE CONVERSATION
  ======================================================= */

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "conversations"
      )

      .delete()

      .eq(
        "id",
        conversationId
      )

      .select("id");


  if (error) {

    throw error;

  }


  if (
    !data ||
    data.length === 0
  ) {

    throw new Error(
      "The conversation was not deleted. Check the Supabase DELETE policy."
    );

  }


  /* =======================================================
     CLEAR LOCAL STORAGE
  ======================================================= */

  const stored =
    getStoredConversation();


  if (
    stored?.id ===
    conversationId
  ) {

    clearStoredConversation();

  }


  markConversationDeleted(
    conversationId
  );


  /* =======================================================
     VERIFY
  ======================================================= */

  const {
    data: remaining,
    error: verifyError,
  } =
    await supabase

      .from(
        "conversations"
      )

      .select("id")

      .eq(
        "id",
        conversationId
      );


  if (verifyError) {

    throw verifyError;

  }


  if (
    remaining &&
    remaining.length > 0
  ) {

    throw new Error(
      "The conversation still exists after deletion."
    );

  }


  if (
    typeof window !==
    "undefined"
  ) {

    window.dispatchEvent(
      new CustomEvent(
        "portfolio:conversation-deleted",
        {
          detail: {
            conversationId,
          },
        }
      )
    );

  }


  return true;

}


/* =========================================================
   DELETE ALL CONVERSATIONS
========================================================= */

export async function deleteAllConversations() {

  /* =======================================================
     DELETE ALL MESSAGES
  ======================================================= */

  const {
    error: messagesError,
  } =
    await supabase

      .from(
        "messages"
      )

      .delete()

      .not(
        "id",
        "is",
        null
      );


  if (messagesError) {

    throw messagesError;

  }


  /* =======================================================
     DELETE ALL CONVERSATIONS
  ======================================================= */

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "conversations"
      )

      .delete()

      .not(
        "id",
        "is",
        null
      )

      .select("id");


  if (error) {

    throw error;

  }


  /* =======================================================
     VERIFY
  ======================================================= */

  const {
    data: remaining,
    error: verifyError,
  } =
    await supabase

      .from(
        "conversations"
      )

      .select("id");


  if (verifyError) {

    throw verifyError;

  }


  if (
    remaining &&
    remaining.length > 0
  ) {

    throw new Error(
      "Some conversations could not be deleted. Check the Supabase DELETE policy."
    );

  }


  clearStoredConversation();


  /* =======================================================
     EVENT
  ======================================================= */

  if (
    typeof window !==
    "undefined"
  ) {

    window.dispatchEvent(
      new CustomEvent(
        "portfolio:all-conversations-deleted",
        {
          detail: {

            count:
              data?.length ||
              0,

          },
        }
      )
    );

  }


  return (
    data?.length ||
    0
  );

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const chat = {

  getStoredConversation,

  clearStoredConversation,

  createConversation,

  getConversation,

  validateStoredConversation,

  getMessages,

  sendMessage,

  subscribeToMessages,

  subscribeToConversations,

  deleteConversation,

  deleteAllConversations,

};


export default chat;
