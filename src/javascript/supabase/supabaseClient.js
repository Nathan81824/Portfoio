import { createClient } from "@supabase/supabase-js";


/* =========================================================
   ENVIRONMENT
========================================================= */

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;


/* =========================================================
   ENVIRONMENT VALIDATION
========================================================= */

if (!supabaseUrl) {

  throw new Error(
    "Missing VITE_SUPABASE_URL."
  );

}


if (!supabaseAnonKey) {

  throw new Error(
    "Missing VITE_SUPABASE_ANON_KEY."
  );

}


/* =========================================================
   ADMIN SUPABASE CLIENT
========================================================= */

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {

        /*
          Admin authentication is allowed
          to persist between page refreshes.
        */

        persistSession:
          true,

        autoRefreshToken:
          true,

        detectSessionInUrl:
          true,

        storageKey:
          "portfolio-admin-session",

      },
    }
  );


/* =========================================================
   VISITOR CHAT CLIENT
========================================================= */

/*
  Visitor chat does NOT use the admin
  authentication session.

  Instead, every visitor conversation
  has its own conversation token.

  The token is sent through:

    x-conversation-token

  Your Supabase RLS / database policies
  can use that header to identify the
  conversation.
*/

let chatClient =
  null;

let chatToken =
  "";


/* =========================================================
   CREATE VISITOR CHAT CLIENT
========================================================= */

function createVisitorChatClient(
  conversationToken
) {

  const token =
    String(
      conversationToken || ""
    ).trim();


  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {

      /* ===================================================
         GLOBAL HEADERS
      =================================================== */

      global: {

        headers: {

          "x-conversation-token":
            token,

        },

      },


      /* ===================================================
         AUTH
      =================================================== */

      auth: {

        /*
          Do NOT share the admin session
          with the visitor client.
        */

        persistSession:
          false,

        autoRefreshToken:
          false,

        detectSessionInUrl:
          false,

        /*
          Separate storage key so this
          client can never overwrite the
          admin authentication session.
        */

        storageKey:
          "portfolio-visitor-chat-client",

      },

    }
  );

}


/* =========================================================
   GET VISITOR CHAT CLIENT
========================================================= */

export function getChatClient(
  conversationToken = ""
) {

  const token =
    String(
      conversationToken || ""
    ).trim();


  /*
    No token means there is no
    authenticated conversation context.
  */

  if (!token) {

    /*
      Still return a client so normal
      public operations can function.

      IMPORTANT:
      Protected conversation operations
      should still fail through RLS if
      no token is supplied.
    */

    if (
      chatClient &&
      chatToken === ""
    ) {

      return chatClient;

    }


    chatClient =
      createVisitorChatClient(
        ""
      );

    chatToken =
      "";

    return chatClient;

  }


  /*
    Reuse the existing client when
    the conversation token has not changed.
  */

  if (
    chatClient &&
    chatToken === token
  ) {

    return chatClient;

  }


  /*
    Create a new visitor client
    for the new conversation token.
  */

  chatClient =
    createVisitorChatClient(
      token
    );

  chatToken =
    token;


  return chatClient;

}


/* =========================================================
   RESET VISITOR CLIENT
========================================================= */

export function resetChatClient() {

  chatClient =
    null;

  chatToken =
    "";

}


/* =========================================================
   GET CURRENT CHAT TOKEN
========================================================= */

export function getChatToken() {

  return chatToken;

}


/* =========================================================
   CHECK CHAT CLIENT
========================================================= */

export function hasChatClient() {

  return Boolean(
    chatClient
  );

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const supabaseClients = {

  supabase,

  getChatClient,

  resetChatClient,

  getChatToken,

  hasChatClient,

};


export default supabaseClients;
