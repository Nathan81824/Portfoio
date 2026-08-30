/* =========================================================
   CHAT.JS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/contact/chat.js

   PURPOSE
   ---------------------------------------------------------
   Handles two-way realtime communication between:

   CLIENT
      ↓
   SUPABASE
      ↓
   YOUR CONTACT INBOX

   And your replies:

   YOU
      ↓
   SUPABASE
      ↓
   CLIENT

   IMPORTANT
   ---------------------------------------------------------
   This file uses only the browser-safe Supabase key.

   Never use the Supabase service-role/secret key here.
========================================================= */

import { createClient } from "@supabase/supabase-js";


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;


/* =========================================================
   CONFIGURATION CHECK
========================================================= */

if (!supabaseUrl) {

  console.error(
    "Missing VITE_SUPABASE_URL in .env"
  );

}


if (!supabaseKey) {

  console.error(
    "Missing VITE_SUPABASE_ANON_KEY in .env"
  );

}


/* =========================================================
   SUPABASE CLIENT
========================================================= */

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );


/* =========================================================
   CREATE CONVERSATION
========================================================= */

/*
  Creates a new conversation.

  Example:

  const conversation =
    await createConversation({
      name: "John",
      email: "john@example.com",
    });
*/

export async function createConversation({
  name,
  email,
}) {

  if (!name || !email) {

    throw new Error(
      "Name and email are required."
    );

  }


  const {
    data,
    error,
  } = await supabase
    .from("conversations")
    .insert([
      {
        name:
          name.trim(),

        email:
          email.trim().toLowerCase(),

        status:
          "open",

        unread:
          true,
      },
    ])
    .select()
    .single();


  if (error) {

    console.error(
      "Create conversation error:",
      error
    );

    throw error;

  }


  return data;

}


/* =========================================================
   FIND EXISTING CONVERSATION
========================================================= */

/*
  Looks for a conversation using
  the client's email address.

  This prevents creating a new
  conversation every time the client
  refreshes the page.
*/

export async function getConversationByEmail(
  email
) {

  if (!email) {

    return null;

  }


  const {
    data,
    error,
  } = await supabase
    .from("conversations")
    .select("*")
    .eq(
      "email",
      email.trim().toLowerCase()
    )
    .maybeSingle();


  if (error) {

    console.error(
      "Find conversation error:",
      error
    );

    throw error;

  }


  return data;

}


/* =========================================================
   GET OR CREATE CONVERSATION
========================================================= */

export async function getOrCreateConversation({
  name,
  email,
}) {

  const existing =
    await getConversationByEmail(
      email
    );


  if (existing) {

    return existing;

  }


  return createConversation({
    name,
    email,
  });

}


/* =========================================================
   SEND MESSAGE
========================================================= */

/*
  sender:

  "client"

  or

  "owner"
*/

export async function sendMessage({
  conversationId,
  message,
  sender = "client",
}) {

  if (!conversationId) {

    throw new Error(
      "Conversation ID is required."
    );

  }


  if (!message || !message.trim()) {

    throw new Error(
      "Message cannot be empty."
    );

  }


  const {
    data,
    error,
  } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id:
          conversationId,

        sender:
          sender,

        message:
          message.trim(),

        read:
          false,
      },
    ])
    .select()
    .single();


  if (error) {

    console.error(
      "Send message error:",
      error
    );

    throw error;

  }


  /* =======================================================
     UPDATE CONVERSATION
  ======================================================= */

  await supabase
    .from("conversations")
    .update({
      updated_at:
        new Date().toISOString(),

      unread:
        sender === "client",
    })
    .eq(
      "id",
      conversationId
    );


  return data;

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


  const {
    data,
    error,
  } = await supabase
    .from("messages")
    .select("*")
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
   GET CONVERSATIONS
========================================================= */

/*
  Used by ContactInbox.jsx.

  Returns the newest conversations first.
*/

export async function getConversations() {

  const {
    data,
    error,
  } = await supabase
    .from("conversations")
    .select("*")
    .order(
      "updated_at",
      {
        ascending: false,
      }
    );


  if (error) {

    console.error(
      "Get conversations error:",
      error
    );

    throw error;

  }


  return data || [];

}


/* =========================================================
   MARK CONVERSATION AS READ
========================================================= */

export async function markConversationRead(
  conversationId
) {

  if (!conversationId) {

    return;

  }


  const {
    error,
  } = await supabase
    .from("conversations")
    .update({
      unread:
        false,
    })
    .eq(
      "id",
      conversationId
    );


  if (error) {

    console.error(
      "Mark conversation read error:",
      error
    );

    throw error;

  }

}


/* =========================================================
   MARK MESSAGE AS READ
========================================================= */

export async function markMessageRead(
  messageId
) {

  if (!messageId) {

    return;

  }


  const {
    error,
  } = await supabase
    .from("messages")
    .update({
      read:
        true,
    })
    .eq(
      "id",
      messageId
    );


  if (error) {

    console.error(
      "Mark message read error:",
      error
    );

    throw error;

  }

}


/* =========================================================
   REALTIME MESSAGE LISTENER
========================================================= */

/*
  Usage:

  const channel =
    subscribeToMessages(
      conversationId,
      (message) => {
        console.log(message);
      }
    );

  Later:

  unsubscribe(channel);
*/

export function subscribeToMessages(
  conversationId,
  callback
) {

  if (!conversationId) {

    return null;

  }


  const channel =
    supabase
      .channel(
        `conversation-${conversationId}`
      )
      .on(
        "postgres_changes",
        {
          event:
            "INSERT",

          schema:
            "public",

          table:
            "messages",

          filter:
            `conversation_id=eq.${conversationId}`,
        },
        (payload) => {

          if (
            typeof callback ===
            "function"
          ) {

            callback(
              payload.new
            );

          }

        }
      )
      .subscribe();


  return channel;

}


/* =========================================================
   REALTIME CONVERSATION LISTENER
========================================================= */

/*
  Used by ContactInbox.jsx.

  Detects when a client:

  - sends a message
  - creates a conversation
  - updates a conversation
*/

export function subscribeToConversations(
  callback
) {

  const channel =
    supabase
      .channel(
        "contact-inbox"
      )
      .on(
        "postgres_changes",
        {
          event:
            "*",

          schema:
            "public",

          table:
            "conversations",
        },
        (payload) => {

          if (
            typeof callback ===
            "function"
          ) {

            callback(
              payload
            );

          }

        }
      )
      .subscribe();


  return channel;

}


/* =========================================================
   UNSUBSCRIBE
========================================================= */

export async function unsubscribe(
  channel
) {

  if (!channel) {

    return;

  }


  await supabase.removeChannel(
    channel
  );

}


/* =========================================================
   DELETE CONVERSATION
========================================================= */

export async function deleteConversation(
  conversationId
) {

  if (!conversationId) {

    return;

  }


  const {
    error,
  } = await supabase
    .from("conversations")
    .delete()
    .eq(
      "id",
      conversationId
    );


  if (error) {

    console.error(
      "Delete conversation error:",
      error
    );

    throw error;

  }

}


/* =========================================================
   DELETE MESSAGE
========================================================= */

export async function deleteMessage(
  messageId
) {

  if (!messageId) {

    return;

  }


  const {
    error,
  } = await supabase
    .from("messages")
    .delete()
    .eq(
      "id",
      messageId
    );


  if (error) {

    console.error(
      "Delete message error:",
      error
    );

    throw error;

  }

}


/* =========================================================
   EXPORT DEFAULT
========================================================= */

export default {

  supabase,

  createConversation,

  getConversationByEmail,

  getOrCreateConversation,

  sendMessage,

  getMessages,

  getConversations,

  markConversationRead,

  markMessageRead,

  subscribeToMessages,

  subscribeToConversations,

  unsubscribe,

  deleteConversation,

  deleteMessage,

};
