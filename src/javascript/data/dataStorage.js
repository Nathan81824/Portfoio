/* =========================================================
   DATA STORAGE
   Nathan — Frontend Developer Portfolio

   Central localStorage manager for:

   → Contact messages
   → Read / unread state
   → Searching
   → Counts
   → Date / time
   → Owner information
   → Storage subscriptions
========================================================= */


/* =========================================================
   IMPORT DATA
========================================================= */

import { getData } from "./data.js";


/* =========================================================
   STORAGE CONFIG
========================================================= */

export const STORAGE_KEY =
  "nathan_contact_messages";

export const STORAGE_VERSION =
  1;


/* =========================================================
   OWNER INFORMATION
========================================================= */

const getOwnerInfo = () => {

  const data =
    typeof getData === "function"
      ? getData()
      : {};


  const personalInfo =
    data?.personalInfo || {};


  return {

    name:
      personalInfo.displayName ||
      personalInfo.name ||
      "Nathan",

    email:
      personalInfo.email ||
      "",

  };

};


/* =========================================================
   ID GENERATOR
========================================================= */

const createId = () => {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }


  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

};


/* =========================================================
   SAFE JSON PARSER
========================================================= */

const parseStorage = (
  value
) => {

  if (!value) {
    return [];
  }


  try {

    const parsed =
      JSON.parse(value);


    if (
      !Array.isArray(parsed)
    ) {

      return [];

    }


    return parsed;

  } catch (error) {

    console.error(
      "Failed to parse contact storage:",
      error
    );


    return [];

  }

};


/* =========================================================
   NORMALIZE MESSAGE
========================================================= */

const normalizeMessage = (
  message = {}
) => {

  const owner =
    getOwnerInfo();


  return {

    id:
      message.id ||
      createId(),

    name:
      String(
        message.name ||
        "Unknown"
      ).trim(),

    email:
      String(
        message.email ||
        ""
      ).trim(),

    message:
      String(
        message.message ||
        ""
      ).trim(),

    createdAt:
      message.createdAt ||
      message.created_at ||
      new Date().toISOString(),

    read:
      Boolean(
        message.read
      ),

    ownerName:
      message.ownerName ||
      owner.name,

    ownerEmail:
      message.ownerEmail ||
      owner.email,

  };

};


/* =========================================================
   GET ALL MESSAGES
========================================================= */

const getMessages = () => {

  if (
    typeof localStorage ===
    "undefined"
  ) {

    return [];

  }


  const stored =
    localStorage.getItem(
      STORAGE_KEY
    );


  return parseStorage(
    stored
  ).map(
    normalizeMessage
  );

};


/* =========================================================
   SAVE MESSAGE
========================================================= */

const save = (
  message
) => {

  if (
    !message ||
    typeof message !== "object"
  ) {

    throw new Error(
      "A valid contact message is required."
    );

  }


  const normalized =
    normalizeMessage(
      message
    );


  if (!normalized.message) {

    throw new Error(
      "Contact message cannot be empty."
    );

  }


  const messages =
    getMessages();


  const updated = [

    normalized,

    ...messages.filter(
      (item) =>
        item.id !==
        normalized.id
    ),

  ];


  if (
    typeof localStorage !==
    "undefined"
  ) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updated
      )
    );

  }


  notifyStorageChange(
    updated
  );


  return normalized;

};


/* =========================================================
   GET MESSAGE BY ID
========================================================= */

const get = (
  id
) => {

  if (!id) {
    return null;
  }


  return (
    getMessages().find(
      (message) =>
        message.id === id
    ) || null
  );

};


/* =========================================================
   SEARCH MESSAGES
========================================================= */

const search = (
  query = ""
) => {

  const normalizedQuery =
    String(
      query
    )
      .trim()
      .toLowerCase();


  if (!normalizedQuery) {

    return getMessages();

  }


  return getMessages()
    .filter(
      (message) =>

        message.name
          .toLowerCase()
          .includes(
            normalizedQuery
          ) ||

        message.email
          .toLowerCase()
          .includes(
            normalizedQuery
          ) ||

        message.message
          .toLowerCase()
          .includes(
            normalizedQuery
          )
    );

};


/* =========================================================
   MARK MESSAGE AS READ
========================================================= */

const markAsRead = (
  id
) => {

  if (!id) {
    return null;
  }


  const messages =
    getMessages();


  const updated =
    messages.map(
      (message) =>

        message.id === id

          ? {
              ...message,
              read: true,
            }

          : message
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updated
    )
  );


  notifyStorageChange(
    updated
  );


  return (
    updated.find(
      (message) =>
        message.id === id
    ) || null
  );

};


/* =========================================================
   MARK MESSAGE AS UNREAD
========================================================= */

const markAsUnread = (
  id
) => {

  if (!id) {
    return null;
  }


  const messages =
    getMessages();


  const updated =
    messages.map(
      (message) =>

        message.id === id

          ? {
              ...message,
              read: false,
            }

          : message
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      updated
    )
  );


  notifyStorageChange(
    updated
  );


  return (
    updated.find(
      (message) =>
        message.id === id
    ) || null
  );

};


/* =========================================================
   DELETE MESSAGE
========================================================= */

const remove = (
  id
) => {

  if (!id) {
    return false;
  }


  const messages =
    getMessages();


  const updated =
    messages.filter(
      (message) =>
        message.id !== id
    );


  const removed =
    updated.length !==
    messages.length;


  if (removed) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updated
      )
    );


    notifyStorageChange(
      updated
    );

  }


  return removed;

};


/* =========================================================
   DELETE ALL MESSAGES
========================================================= */

const clear = () => {

  if (
    typeof localStorage !==
    "undefined"
  ) {

    localStorage.removeItem(
      STORAGE_KEY
    );

  }


  notifyStorageChange(
    []
  );


  return true;

};


/* =========================================================
   GET UNREAD MESSAGES
========================================================= */

const getUnread = () => {

  return getMessages()
    .filter(
      (message) =>
        message.read === false
    );

};


/* =========================================================
   GET READ MESSAGES
========================================================= */

const getRead = () => {

  return getMessages()
    .filter(
      (message) =>
        message.read === true
    );

};


/* =========================================================
   COUNTS
========================================================= */

const getCount = () => {

  return getMessages().length;

};


const getUnreadCount = () => {

  return getUnread().length;

};


const getReadCount = () => {

  return getRead().length;

};


/* =========================================================
   DATE HELPER
========================================================= */

const getMessageDate = (
  id
) => {

  const message =
    get(id);


  if (!message) {
    return null;
  }


  const date =
    new Date(
      message.createdAt
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

};


/* =========================================================
   TIME HELPER
========================================================= */

const getMessageTime = (
  id
) => {

  const message =
    get(id);


  if (!message) {
    return null;
  }


  const date =
    new Date(
      message.createdAt
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date.toLocaleTimeString(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

};


/* =========================================================
   STORAGE SUBSCRIBERS
========================================================= */

const subscribers =
  new Set();


/* =========================================================
   NOTIFY STORAGE CHANGE
========================================================= */

function notifyStorageChange(
  messages
) {

  /*
    Notify JavaScript subscribers.
  */

  subscribers.forEach(
    (callback) => {

      try {

        callback(
          messages
        );

      } catch (error) {

        console.error(
          "Storage subscriber error:",
          error
        );

      }

    }
  );


  /*
    Notify browser components.
  */

  if (
    typeof window !==
    "undefined"
  ) {

    window.dispatchEvent(
      new CustomEvent(
        "contact:storage-change",
        {
          detail: messages,
        }
      )
    );

  }

}


/* =========================================================
   SUBSCRIBE
========================================================= */

const subscribe = (
  callback
) => {

  if (
    typeof callback !==
    "function"
  ) {

    return () => {};

  }


  subscribers.add(
    callback
  );


  /*
    Immediately provide
    the current messages.
  */

  callback(
    getMessages()
  );


  /*
    Return unsubscribe function.
  */

  return () => {

    subscribers.delete(
      callback
    );

  };

};


/* =========================================================
   CROSS-TAB STORAGE EVENT
========================================================= */

const handleStorageEvent = (
  event
) => {

  if (
    event.key !==
    STORAGE_KEY
  ) {

    return;

  }


  const messages =
    parseStorage(
      event.newValue
    ).map(
      normalizeMessage
    );


  notifyStorageChange(
    messages
  );

};


if (
  typeof window !==
  "undefined"
) {

  window.addEventListener(
    "storage",
    handleStorageEvent
  );

}


/* =========================================================
   STORAGE INFORMATION
========================================================= */

const getStorageInfo = () => {

  const messages =
    getMessages();


  return {

    key:
      STORAGE_KEY,

    version:
      STORAGE_VERSION,

    total:
      messages.length,

    unread:
      messages.filter(
        (message) =>
          !message.read
      ).length,

    read:
      messages.filter(
        (message) =>
          message.read
      ).length,

  };

};


/* =========================================================
   OWNER INFORMATION
========================================================= */

const getOwner = () => {

  return getOwnerInfo();

};


/* =========================================================
   EXPORT OBJECT
========================================================= */

const dataStorage = {

  /* Messages */

  save,

  get,

  getMessages,

  search,

  remove,

  clear,


  /* Read / unread */

  markAsRead,

  markAsUnread,

  getRead,

  getUnread,


  /* Counts */

  getCount,

  getReadCount,

  getUnreadCount,


  /* Date / time */

  getMessageDate,

  getMessageTime,


  /* Storage */

  getStorageInfo,

  subscribe,


  /* Owner */

  getOwner,

};


/* =========================================================
   NAMED EXPORTS
========================================================= */

export {

  save,

  get,

  getMessages,

  search,

  remove,

  clear,

  markAsRead,

  markAsUnread,

  getRead,

  getUnread,

  getCount,

  getReadCount,

  getUnreadCount,

  getMessageDate,

  getMessageTime,

  getStorageInfo,

  subscribe,

  getOwner,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default dataStorage;

