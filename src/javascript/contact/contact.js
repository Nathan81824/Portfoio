/* =========================================================
   CONTACT SERVICE

   Nathan — Frontend Developer Portfolio

   Responsibilities:
   - Contact form validation
   - EmailJS contact submission
   - Contact configuration
   - Chat service access
========================================================= */


/* =========================================================
   EMAILJS
========================================================= */

import emailjs from "@emailjs/browser";


/* =========================================================
   CHAT
========================================================= */

import {
  createConversation,
  getStoredConversation,
  getStoredConversationToken,
  getConversation,
  getMessages,
  sendMessage,
  sendVoiceMessage,
  uploadVoiceMessage,
  subscribeToMessages,
  clearStoredConversation,
  deleteConversation,
  deleteAllConversations,
  resolveMessageAudioUrls,
  createAudioSignedUrl,
  getChatAudioBucket,
} from "../contact/chat.js";


/* =========================================================
   CONFIGURATION
========================================================= */

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "";

const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";

const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";


/* =========================================================
   CONTACT FORM LIMITS
========================================================= */

const MAX_NAME_LENGTH =
  120;

const MAX_EMAIL_LENGTH =
  160;

const MAX_SUBJECT_LENGTH =
  200;

const MAX_MESSAGE_LENGTH =
  5000;


/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(
  value,
  maxLength
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
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
  email
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

}


/* =========================================================
   CONTACT FORM VALIDATION
========================================================= */

export function validateContactForm(
  form = {}
) {

  const name =
    cleanText(
      form.name,
      MAX_NAME_LENGTH
    );

  const email =
    cleanText(
      form.email,
      MAX_EMAIL_LENGTH
    );

  const subject =
    cleanText(
      form.subject,
      MAX_SUBJECT_LENGTH
    );

  const message =
    cleanText(
      form.message,
      MAX_MESSAGE_LENGTH
    );


  const errors = {};


  if (!name) {

    errors.name =
      "Please enter your name.";

  }


  if (!email) {

    errors.email =
      "Please enter your email.";

  } else if (
    !isValidEmail(
      email
    )
  ) {

    errors.email =
      "Please enter a valid email address.";

  }


  if (!message) {

    errors.message =
      "Please enter your message.";

  }


  return {

    valid:
      Object.keys(
        errors
      ).length === 0,

    errors,

    values: {

      name,

      email,

      subject,

      message,

    },

  };

}


/* =========================================================
   GET CONTACT CONFIG
========================================================= */

export function getContactConfig() {

  return {

    emailjs: {

      configured:
        Boolean(
          EMAILJS_SERVICE_ID &&
          EMAILJS_TEMPLATE_ID &&
          EMAILJS_PUBLIC_KEY
        ),

      serviceId:
        EMAILJS_SERVICE_ID,

      templateId:
        EMAILJS_TEMPLATE_ID,

    },

  };

}


/* =========================================================
   SEND CONTACT FORM
========================================================= */

export async function sendContactForm(
  form = {}
) {

  const validation =
    validateContactForm(
      form
    );


  if (
    !validation.valid
  ) {

    const error =
      new Error(
        "Please correct the contact form."
      );


    error.validation =
      validation.errors;


    throw error;

  }


  if (
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY
  ) {

    throw new Error(
      "Email service is not configured."
    );

  }


  const {
    name,
    email,
    subject,
    message,
  } =
    validation.values;


  const templateParams = {

    name,

    email,

    subject,

    message,

    from_name:
      name,

    from_email:
      email,

    reply_to:
      email,

    user_name:
      name,

    user_email:
      email,

    user_message:
      message,

  };


  try {

    const response =
      await emailjs.send(

        EMAILJS_SERVICE_ID,

        EMAILJS_TEMPLATE_ID,

        templateParams,

        EMAILJS_PUBLIC_KEY

      );


    return {

      success:
        true,

      status:
        response.status,

      text:
        response.text,

    };

  } catch (error) {

    console.error(
      "Contact form submission failed:",
      error
    );


    throw error;

  }

}


/* =========================================================
   GET STORED CHAT
========================================================= */

export function getStoredChat() {

  return getStoredConversation();

}


/* =========================================================
   GET CHAT TOKEN
========================================================= */

export function getChatToken() {

  return getStoredConversationToken();

}


/* =========================================================
   CREATE CHAT
========================================================= */

export async function startChat({
  visitorName = "",
  visitorEmail = "",
} = {}) {

  return createConversation({

    visitorName,

    visitorEmail,

  });

}


/* =========================================================
   GET CHAT CONVERSATION
========================================================= */

export async function getChatConversation(
  conversationId
) {

  return getConversation(
    conversationId
  );

}


/* =========================================================
   GET CHAT MESSAGES
========================================================= */

export async function getChatMessages(
  conversationId
) {

  return getMessages(
    conversationId
  );

}


/* =========================================================
   SEND CHAT MESSAGE
========================================================= */

export async function sendChatMessage(
  options = {}
) {

  return sendMessage(
    options
  );

}


/* =========================================================
   SEND VOICE CHAT MESSAGE
========================================================= */

export async function sendChatVoiceMessage(
  options = {}
) {

  return sendVoiceMessage(
    options
  );

}


/* =========================================================
   UPLOAD CHAT VOICE
========================================================= */

export async function uploadChatVoice(
  options = {}
) {

  return uploadVoiceMessage(
    options
  );

}


/* =========================================================
   CHAT REALTIME
========================================================= */

export function subscribeToChat(
  options = {}
) {

  return subscribeToMessages(
    options
  );

}


/* =========================================================
   CLEAR LOCAL CHAT
========================================================= */

export function clearChat() {

  return clearStoredConversation();

}


/* =========================================================
   DELETE CHAT
========================================================= */

export async function deleteChat(
  conversationId
) {

  return deleteConversation(
    conversationId
  );

}


/* =========================================================
   DELETE ALL CHATS
========================================================= */

export async function deleteAllChats() {

  return deleteAllConversations();

}


/* =========================================================
   RESOLVE CHAT AUDIO
========================================================= */

export async function resolveChatAudio(
  messages = [],
  expiresIn = 3600,
  conversationId = null
) {

  return resolveMessageAudioUrls(

    messages,

    expiresIn,

    conversationId

  );

}


/* =========================================================
   CREATE CHAT AUDIO URL
========================================================= */

export async function getChatAudioUrl(
  audioPath,
  expiresIn = 3600,
  conversationId = null
) {

  return createAudioSignedUrl(

    audioPath,

    expiresIn,

    conversationId

  );

}


/* =========================================================
   GET CHAT AUDIO BUCKET
========================================================= */

export function getAudioBucket() {

  return getChatAudioBucket();

}


/* =========================================================
   DEFAULT CONTACT OBJECT
========================================================= */

const contact = {

  validateContactForm,

  getContactConfig,

  sendContactForm,

  getStoredChat,

  getChatToken,

  startChat,

  getChatConversation,

  getChatMessages,

  sendChatMessage,

  sendChatVoiceMessage,

  uploadChatVoice,

  subscribeToChat,

  clearChat,

  deleteChat,

  deleteAllChats,

  resolveChatAudio,

  getChatAudioUrl,

  getAudioBucket,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default contact;