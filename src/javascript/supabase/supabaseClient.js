import { createClient } from "@supabase/supabase-js";


/* =========================================================
   ENVIRONMENT
========================================================= */

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;


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
   ONE AUTHENTICATED CLIENT FOR THE ENTIRE ADMIN APP
========================================================= */

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,

      autoRefreshToken: true,

      detectSessionInUrl: true,

      storageKey:
        "portfolio-admin-session",
    },
  }
);


/* =========================================================
   VISITOR CHAT CLIENT
========================================================= */

let chatClient = null;

let chatToken = "";


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
    Reuse the visitor client when
    the token has not changed.
  */

  if (
    chatClient &&
    chatToken === token
  ) {

    return chatClient;

  }


  /*
    IMPORTANT:

    Visitor chat does NOT use
    Supabase Auth sessions.

    It therefore must NOT participate
    in the admin refresh-token cycle.
  */

  chatClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          "x-conversation-token":
            token,
        },
      },

      auth: {
        persistSession: false,

        autoRefreshToken: false,

        detectSessionInUrl: false,

        /*
          Unique storage key anyway.
        */

        storageKey:
          "portfolio-visitor-chat-client",
      },
    }
  );


  chatToken = token;


  return chatClient;

}


/* =========================================================
   RESET VISITOR CLIENT
========================================================= */

export function resetChatClient() {

  chatClient = null;

  chatToken = "";

}