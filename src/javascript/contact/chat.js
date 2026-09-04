/* =========================================================
   CHAT SERVICE
   Visitor + Admin communication service

   Responsibilities:
   - Conversations
   - Text messages
   - Voice messages
   - Private audio Storage
   - Signed audio URLs
   - Realtime messages
   - Conversation recovery
   - Conversation deletion
========================================================= */

import {
  supabase,
  getChatClient,
} from "../supabase/supabaseClient.js";


/* =========================================================
   STORAGE
========================================================= */

const CONVERSATION_STORAGE_KEY =
  "portfolio_chat_conversation";

const TOKEN_STORAGE_KEY =
  "portfolio_chat_token";

const DELETED_CONVERSATIONS_KEY =
  "portfolio_deleted_conversations";


/* =========================================================
   AUDIO STORAGE
========================================================= */

const CHAT_AUDIO_BUCKET =
  "chat-audio";

const MAX_AUDIO_SIZE =
  10 * 1024 * 1024;


/* =========================================================
   LOCAL STORAGE CHECK
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

    const raw =
      window.localStorage.getItem(
        CONVERSATION_STORAGE_KEY
      );


    if (!raw) {
      return null;
    }


    return JSON.parse(raw);

  } catch (error) {

    console.error(
      "Failed to read stored conversation:",
      error
    );

    return null;

  }

}


/* =========================================================
   GET STORED TOKEN
========================================================= */

export function getStoredConversationToken() {

  if (!hasLocalStorage) {
    return "";
  }


  try {

    return (
      window.localStorage.getItem(
        TOKEN_STORAGE_KEY
      ) || ""
    );

  } catch {

    return "";

  }

}


/* =========================================================
   STORE CONVERSATION
========================================================= */

function storeConversation(
  conversation
) {

  if (!hasLocalStorage) {
    return;
  }


  if (!conversation?.id) {
    return;
  }


  try {

    window.localStorage.setItem(
      CONVERSATION_STORAGE_KEY,
      JSON.stringify(
        conversation
      )
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
      "Failed to clear conversation:",
      error
    );

  }

}


/* =========================================================
   MARK CONVERSATION DELETED
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

    const existing =
      JSON.parse(
        window.localStorage.getItem(
          DELETED_CONVERSATIONS_KEY
        ) || "[]"
      );


    const ids =
      Array.isArray(existing)
        ? existing
        : [];


    if (
      !ids.includes(
        conversationId
      )
    ) {

      ids.push(
        conversationId
      );

    }


    window.localStorage.setItem(
      DELETED_CONVERSATIONS_KEY,
      JSON.stringify(ids)
    );

  } catch (error) {

    console.error(
      "Failed to mark conversation deleted:",
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

    const existing =
      JSON.parse(
        window.localStorage.getItem(
          DELETED_CONVERSATIONS_KEY
        ) || "[]"
      );


    return (
      Array.isArray(existing) &&
      existing.includes(
        conversationId
      )
    );

  } catch {

    return false;

  }

}


/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(
  value,
  maxLength = 500
) {

  return String(
    value || ""
  )
    .trim()
    .slice(
      0,
      maxLength
    );

}


/* =========================================================
   CREATE CONVERSATION
========================================================= */

export async function createConversation({
  visitorName = "",
  visitorEmail = "",
} = {}) {

  const cleanName =
    cleanText(
      visitorName,
      120
    );

  const cleanEmail =
    cleanText(
      visitorEmail,
      160
    );


  /*
    This token identifies the visitor conversation.

    IMPORTANT:
    This is NOT a Supabase Auth JWT.
    Storage policies must therefore be designed
    accordingly, or signed URLs must be generated
    by a trusted backend/Edge Function.
  */

  const accessToken =
    crypto.randomUUID();


  const {
    data,
    error,
  } = await supabase

    .from("conversations")

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
      "Failed to create conversation:",
      error
    );

    throw error;

  }


  storeConversation(
    data
  );


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


  const stored =
    getStoredConversation();


  const client =
    stored?.id === conversationId &&
    stored?.access_token

      ? getChatClient(
          stored.access_token
        )

      : supabase;


  const {
    data,
    error,
  } = await client

    .from("conversations")

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
      "Failed to get conversation:",
      error
    );

    throw error;

  }


  return data || null;

}


/* =========================================================
   GET VISITOR CLIENT
========================================================= */

function getVisitorClient(
  conversationId
) {

  const stored =
    getStoredConversation();


  if (
    stored?.id === conversationId &&
    stored?.access_token
  ) {

    return getChatClient(
      stored.access_token
    );

  }


  return supabase;

}


/* =========================================================
   VALIDATE STORED CONVERSATION
========================================================= */

export async function validateStoredConversation() {

  const stored =
    getStoredConversation();


  if (
    !stored?.id
  ) {

    return null;

  }


  if (
    isConversationMarkedDeleted(
      stored.id
    )
  ) {

    clearStoredConversation();

    return null;

  }


  try {

    const conversation =
      await getConversation(
        stored.id
      );


    if (!conversation) {

      clearStoredConversation();

      return null;

    }


    if (
      conversation.access_token &&
      stored.access_token &&
      conversation.access_token !==
        stored.access_token
    ) {

      clearStoredConversation();

      return null;

    }


    return conversation;

  } catch (error) {

    console.error(
      "Conversation validation failed:",
      error
    );

    return null;

  }

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


  const client =
    getVisitorClient(
      conversationId
    );


  const {
    data,
    error,
  } = await client

    .from("messages")

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
      "Failed to get messages:",
      error
    );

    throw error;

  }


  /*
    IMPORTANT:

    Storage paths such as:

    conversation-id/voice-file.webm

    are NOT playable URLs.

    Resolve every audio path into a
    signed URL before returning messages.
  */

  return resolveMessageAudioUrls(
    data || [],
    3600,
    conversationId
  );

}


/* =========================================================
   SEND TEXT MESSAGE
========================================================= */

export async function sendMessage({
  conversationId,
  message,
  sender = "visitor",
  visitorName = "",
  visitorEmail = "",
} = {}) {

  const text =
    cleanText(
      message,
      5000
    );


  if (!text) {
    throw new Error(
      "Message cannot be empty."
    );
  }


  if (!conversationId) {
    throw new Error(
      "Conversation ID is required."
    );
  }


  /* =======================================================
     ADMIN
  ======================================================= */

  if (
    sender === "admin"
  ) {

    const {
      data,
      error,
    } = await supabase

      .from("messages")

      .insert({

        conversation_id:
          conversationId,

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


    if (error) {
      throw error;
    }


    return data;

  }


  /* =======================================================
     VISITOR
  ======================================================= */

  let conversation =
    await validateStoredConversation();


  /*
    Recover conversation if the
    supplied ID is still valid.
  */

  if (
    !conversation ||
    conversation.id !== conversationId
  ) {

    try {

      conversation =
        await getConversation(
          conversationId
        );

    } catch {

      conversation = null;

    }

  }


  /*
    If conversation disappeared,
    create a new one.
  */

  if (!conversation) {

    conversation =
      await createConversation({
        visitorName,
        visitorEmail,
      });

    conversationId =
      conversation.id;

  }


  const client =
    getVisitorClient(
      conversationId
    );


  let {
    data,
    error,
  } = await client

    .from("messages")

    .insert({

      conversation_id:
        conversationId,

      message:
        text,

      sender:
        "visitor",

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


  /*
    Conversation may have been deleted
    between validation and insertion.

    Recreate once.
  */

  if (
    error &&
    String(
      error.code
    ) === "23503"
  ) {

    clearStoredConversation();


    conversation =
      await createConversation({
        visitorName,
        visitorEmail,
      });


    conversationId =
      conversation.id;


    const retryClient =
      getVisitorClient(
        conversationId
      );


    const retryResult =
      await retryClient

        .from("messages")

        .insert({

          conversation_id:
            conversationId,

          message:
            text,

          sender:
            "visitor",

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


    data =
      retryResult.data;

    error =
      retryResult.error;

  }


  if (error) {
    throw error;
  }


  return data;

}


/* =========================================================
   AUDIO EXTENSION
========================================================= */

function getAudioExtension(
  mimeType = ""
) {

  const type =
    String(
      mimeType
    ).toLowerCase();


  if (
    type.includes("webm")
  ) {

    return "webm";

  }


  if (
    type.includes("mp4")
  )
  {

    return "mp4";

  }


  if (
    type.includes("ogg")
  )
  {

    return "ogg";

  }


  if (
    type.includes("mpeg")
  )
  {

    return "mp3";

  }


  if (
    type.includes("wav")
  )
  {

    return "wav";

  }


  return "webm";

}


/* =========================================================
   UPLOAD VOICE MESSAGE
========================================================= */

export async function uploadVoiceMessage({
  conversationId,
  audioBlob,
} = {}) {

  if (!conversationId) {

    throw new Error(
      "Conversation ID is required."
    );

  }


  if (!audioBlob) {

    throw new Error(
      "Audio recording is required."
    );

  }


  if (
    typeof audioBlob.size !==
    "number"
  ) {

    throw new Error(
      "Invalid audio recording."
    );

  }


  if (
    audioBlob.size === 0
  ) {

    throw new Error(
      "The audio recording is empty."
    );

  }


  if (
    audioBlob.size >
    MAX_AUDIO_SIZE
  ) {

    throw new Error(
      "Audio recording is too large. Maximum size is 10 MB."
    );

  }


  const mimeType =
    audioBlob.type ||
    "audio/webm";


  const extension =
    getAudioExtension(
      mimeType
    );


  const uniqueId =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;


  const filePath =
    `${conversationId}/voice-${uniqueId}.${extension}`;


  const client =
    getVisitorClient(
      conversationId
    );


  const {
    error,
  } = await client

    .storage

    .from(
      CHAT_AUDIO_BUCKET
    )

    .upload(
      filePath,
      audioBlob,
      {

        cacheControl:
          "3600",

        contentType:
          mimeType,

        upsert:
          false,

      }
    );


  if (error) {

    console.error(
      "Voice upload failed:",
      error
    );

    throw error;

  }


  return {

    path:
      filePath,

    bucket:
      CHAT_AUDIO_BUCKET,

    mimeType:
      mimeType,

    size:
      audioBlob.size,

  };

}


/* =========================================================
   SEND VOICE MESSAGE
========================================================= */

export async function sendVoiceMessage(
  voiceInput = {}
) {

  /*
    Supports:

    sendVoiceMessage(blob)

    OR

    sendVoiceMessage({
      conversationId,
      audioBlob,
    })
  */

  let conversationId =
    null;

  let audioBlob =
    null;


  if (
    voiceInput instanceof Blob
  ) {

    audioBlob =
      voiceInput;

  } else if (
    voiceInput &&
    typeof voiceInput === "object"
  ) {

    conversationId =
      voiceInput.conversationId ||
      null;

    audioBlob =
      voiceInput.audioBlob ||
      null;

  }


  const stored =
    getStoredConversation();


  if (!conversationId) {

    conversationId =
      stored?.id ||
      null;

  }


  if (!conversationId) {

    throw new Error(
      "No active conversation."
    );

  }


  if (!audioBlob) {

    throw new Error(
      "No audio recording."
    );

  }


  /*
    Make sure the conversation still exists.
  */

  const conversation =
    await getConversation(
      conversationId
    );


  if (!conversation) {

    throw new Error(
      "This conversation is no longer available."
    );

  }


  let uploaded;


  try {

    uploaded =
      await uploadVoiceMessage({
        conversationId,
        audioBlob,
      });

  } catch (error) {

    console.error(
      "Voice upload failed:",
      error
    );

    throw error;

  }


  try {

    const client =
      getVisitorClient(
        conversationId
      );


    const {
      data,
      error,
    } = await client

      .from("messages")

      .insert({

        conversation_id:
          conversationId,

        message:
          "",

        sender:
          "visitor",

        message_type:
          "audio",

        /*
          Store the Storage PATH
          in the database.

          Never store an expiring signed
          URL as the permanent database value.
        */

        audio_url:
          uploaded.path,

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


    if (error) {

      /*
        Remove uploaded audio if
        message insertion fails.
      */

      try {

        await client

          .storage

          .from(
            CHAT_AUDIO_BUCKET
          )

          .remove([
            uploaded.path,
          ]);

      } catch (
        cleanupError
      ) {

        console.error(
          "Failed to clean up uploaded audio:",
          cleanupError
        );

      }


      throw error;

    }


    /*
      Resolve the Storage path into a
      playable signed URL for the UI.
    */

    const resolvedMessages =
      await resolveMessageAudioUrls(
        [data],
        3600,
        conversationId
      );


    return (
      resolvedMessages[0] ||
      data
    );

  } catch (error) {

    console.error(
      "Failed to send voice message:",
      error
    );

    throw error;

  }

}


/* =========================================================
   CREATE SIGNED AUDIO URL
========================================================= */

export async function createAudioSignedUrl(
  audioPath,
  expiresIn = 3600,
  conversationId = null
) {

  if (!audioPath) {
    return "";
  }


  /*
    Already a URL.
  */

  if (
    typeof audioPath === "string" &&
    (
      audioPath.startsWith(
        "http://"
      ) ||
      audioPath.startsWith(
        "https://"
      )
    )
  ) {

    return audioPath;

  }


  /*
    Use visitor client when a
    conversation ID is available.
  */

  let client =
    supabase;


  if (
    conversationId
  ) {

    client =
      getVisitorClient(
        conversationId
      );

  }


  const {
    data,
    error,
  } = await client

    .storage

    .from(
      CHAT_AUDIO_BUCKET
    )

    .createSignedUrl(
      audioPath,
      expiresIn
    );


  if (error) {

    throw error;

  }


  return (
    data?.signedUrl ||
    ""
  );

}


/* =========================================================
   RESOLVE AUDIO URLS
========================================================= */

export async function resolveMessageAudioUrls(
  messages = [],
  expiresIn = 3600,
  conversationId = null
) {

  if (
    !Array.isArray(
      messages
    )
  ) {

    return [];

  }


  return Promise.all(

    messages.map(
      async (message) => {

        if (
          !message ||
          message.message_type !==
            "audio" ||
          !message.audio_url
        ) {

          return message;

        }


        /*
          If it is already a full URL,
          don't sign it again.
        */

        if (
          message.audio_url.startsWith(
            "http://"
          ) ||
          message.audio_url.startsWith(
            "https://"
          )
        ) {

          return message;

        }


        try {

          const signedUrl =
            await createAudioSignedUrl(
              message.audio_url,
              expiresIn,
              conversationId ||
                message.conversation_id ||
                null
            );


          return {

            ...message,

            audio_url:
              signedUrl,

          };

        } catch (error) {

          console.error(
            "Failed to resolve audio URL:",
            error
          );


          /*
            Keep the original object.

            The UI can then display an
            unavailable-audio state instead
            of crashing.
          */

          return message;

        }

      }
    )

  );

}


/* =========================================================
   SUBSCRIBE TO MESSAGES
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


  const client =
    accessToken
      ? getChatClient(
          accessToken
        )
      : getVisitorClient(
          conversationId
        );


  const channel =
    client

      .channel(
        `chat-messages-${conversationId}`
      )


      /* ===============================================
         INSERT
      =============================================== */

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter:
            `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {

          let message =
            payload.new;


          /*
            Realtime audio payloads contain
            Storage paths, not playable URLs.
          */

          if (
            message?.message_type ===
              "audio" &&
            message?.audio_url
          ) {

            try {

              const resolved =
                await resolveMessageAudioUrls(
                  [message],
                  3600,
                  conversationId
                );


              message =
                resolved[0] ||
                message;

            } catch (error) {

              console.error(
                "Failed to resolve realtime audio:",
                error
              );

            }

          }


          if (
            typeof onMessage ===
            "function"
          ) {

            onMessage(
              message
            );

          }

        }
      )


      /* ===============================================
         UPDATE
      =============================================== */

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter:
            `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {

          let message =
            payload.new;


          if (
            message?.message_type ===
              "audio" &&
            message?.audio_url
          ) {

            try {

              const resolved =
                await resolveMessageAudioUrls(
                  [message],
                  3600,
                  conversationId
                );


              message =
                resolved[0] ||
                message;

            } catch (error) {

              console.error(
                "Failed to resolve updated audio:",
                error
              );

            }

          }


          if (
            typeof onUpdate ===
            "function"
          ) {

            onUpdate(
              message
            );

          }

        }
      )


      /* ===============================================
         DELETE
      =============================================== */

      .on(
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
      )


      .subscribe();


  return () => {

    try {

      client.removeChannel(
        channel
      );

    } catch (error) {

      console.error(
        "Failed to remove chat channel:",
        error
      );

    }

  };

}


/* =========================================================
   DELETE CONVERSATION AUDIO
========================================================= */

export async function deleteConversationAudio(
  conversationId
) {

  if (!conversationId) {
    return;
  }


  try {

    const client =
      getVisitorClient(
        conversationId
      );


    const {
      data: files,
      error: listError,
    } = await client

      .storage

      .from(
        CHAT_AUDIO_BUCKET
      )

      .list(
        conversationId,
        {
          limit: 100,
        }
      );


    if (listError) {

      console.warn(
        "Unable to list conversation audio:",
        listError
      );

      return;

    }


    if (
      !files ||
      files.length === 0
    ) {

      return;

    }


    const paths =
      files
        .filter(
          (file) =>
            file?.name
        )
        .map(
          (file) =>
            `${conversationId}/${file.name}`
        );


    if (
      paths.length === 0
    ) {

      return;

    }


    const {
      error: removeError,
    } = await client

      .storage

      .from(
        CHAT_AUDIO_BUCKET
      )

      .remove(
        paths
      );


    if (removeError) {

      console.warn(
        "Unable to delete conversation audio:",
        removeError
      );

    }

  } catch (error) {

    console.warn(
      "Conversation audio cleanup failed:",
      error
    );

  }

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


  /*
    Delete audio first.
  */

  await deleteConversationAudio(
    conversationId
  );


  /*
    Delete messages.
  */

  const {
    error: messagesError,
  } = await supabase

    .from("messages")

    .delete()

    .eq(
      "conversation_id",
      conversationId
    );


  if (messagesError) {

    throw messagesError;

  }


  /*
    Delete conversation.
  */

  const {
    data,
    error,
  } = await supabase

    .from("conversations")

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
      "Conversation was not deleted."
    );

  }


  markConversationDeleted(
    conversationId
  );


  const stored =
    getStoredConversation();


  if (
    stored?.id ===
    conversationId
  ) {

    clearStoredConversation();

  }


  return data[0];

}


/* =========================================================
   DELETE ALL CONVERSATIONS
========================================================= */

export async function deleteAllConversations() {

  /*
    Get conversations first so
    their audio folders can be cleaned.
  */

  const {
    data: conversations,
    error: fetchError,
  } = await supabase

    .from("conversations")

    .select("id");


  if (fetchError) {

    throw fetchError;

  }


  /*
    Delete audio for each conversation.
  */

  for (
    const conversation
    of conversations || []
  ) {

    try {

      await deleteConversationAudio(
        conversation.id
      );

    } catch (error) {

      console.warn(
        "Failed to clean conversation audio:",
        error
      );

    }

  }


  /*
    Delete messages.
  */

  const {
    error: messagesError,
  } = await supabase

    .from("messages")

    .delete()

    .not(
      "id",
      "is",
      null
    );


  if (messagesError) {

    throw messagesError;

  }


  /*
    Delete conversations.
  */

  const {
    data,
    error,
  } = await supabase

    .from("conversations")

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


  /*
    Clear local visitor state.
  */

  clearStoredConversation();


  return data || [];

}


/* =========================================================
   GET AUDIO BUCKET
========================================================= */

export function getChatAudioBucket() {

  return CHAT_AUDIO_BUCKET;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const chat = {

  getStoredConversation,

  getStoredConversationToken,

  clearStoredConversation,

  createConversation,

  getConversation,

  validateStoredConversation,

  getMessages,

  sendMessage,

  uploadVoiceMessage,

  sendVoiceMessage,

  createAudioSignedUrl,

  resolveMessageAudioUrls,

  subscribeToMessages,

  deleteConversationAudio,

  deleteConversation,

  deleteAllConversations,

  getChatAudioBucket,

};


export default chat;

