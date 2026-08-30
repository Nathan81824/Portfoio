/* =========================================================
   CONTACT STORAGE
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/contactStorage.js

   PURPOSE
   ---------------------------------------------------------
   Central browser storage system for contact messages.

   Uses:
   ---------------------------------------------------------
   localStorage

   Supports:
   ---------------------------------------------------------
   - Save messages
   - Get messages
   - Get unread messages
   - Count messages
   - Mark as read/unread
   - Delete messages
   - Clear messages
   - Search messages
   - Format dates and times
   - Live inbox updates

   IMPORTANT
   ---------------------------------------------------------
   This stores messages in the browser where the message
   was submitted.

   It does NOT send messages to another computer.
========================================================= */


/* =========================================================
   STORAGE KEY
========================================================= */

export const CONTACT_STORAGE_KEY =
  "nathan_contact_messages";


/* =========================================================
   STORAGE VERSION
========================================================= */

const STORAGE_VERSION = 1;


/* =========================================================
   CHECK LOCAL STORAGE
========================================================= */

function storageAvailable() {

  if (
    typeof window === "undefined"
  ) {

    return false;

  }


  try {

    const testKey =
      "__nathan_contact_test__";


    window.localStorage.setItem(
      testKey,
      "test"
    );


    window.localStorage.removeItem(
      testKey
    );


    return true;

  } catch (error) {

    console.warn(
      "localStorage is unavailable:",
      error
    );


    return false;

  }

}


/* =========================================================
   CREATE MESSAGE ID
========================================================= */

function createMessageId() {

  return (
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .slice(2, 10)}`
  );

}


/* =========================================================
   NORMALIZE MESSAGE
========================================================= */

function normalizeMessage(
  message
) {

  if (
    !message ||
    typeof message !== "object"
  ) {

    return null;

  }


  return {

    id:
      message.id ||
      createMessageId(),


    name:
      typeof message.name === "string"
        ? message.name.trim()
        : "",


    email:
      typeof message.email === "string"
        ? message.email.trim()
        : "",


    message:
      typeof message.message === "string"
        ? message.message.trim()
        : "",


    createdAt:
      message.createdAt ||
      new Date().toISOString(),


    read:
      message.read === true,


    version:
      STORAGE_VERSION,

  };

}


/* =========================================================
   READ RAW STORAGE
========================================================= */

function readStorage() {

  if (
    !storageAvailable()
  ) {

    return [];

  }


  try {

    const raw =
      window.localStorage.getItem(
        CONTACT_STORAGE_KEY
      );


    if (!raw) {

      return [];

    }


    const parsed =
      JSON.parse(raw);


    /* =====================================================
       SUPPORT OLD ARRAY FORMAT
    ===================================================== */

    if (
      Array.isArray(parsed)
    ) {

      return parsed
        .map(normalizeMessage)
        .filter(Boolean);

    }


    /* =====================================================
       SUPPORT CURRENT OBJECT FORMAT
    ===================================================== */

    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.messages)
    ) {

      return parsed.messages
        .map(normalizeMessage)
        .filter(Boolean);

    }


    return [];

  } catch (error) {

    console.error(
      "Could not read contact storage:",
      error
    );


    return [];

  }

}


/* =========================================================
   WRITE STORAGE
========================================================= */

function writeStorage(
  messages
) {

  if (
    !storageAvailable()
  ) {

    return false;

  }


  try {

    const normalizedMessages =
      messages
        .map(normalizeMessage)
        .filter(Boolean);


    const storageData = {

      version:
        STORAGE_VERSION,


      updatedAt:
        new Date().toISOString(),


      messages:
        normalizedMessages,

    };


    window.localStorage.setItem(
      CONTACT_STORAGE_KEY,
      JSON.stringify(
        storageData
      )
    );


    return true;

  } catch (error) {

    console.error(
      "Could not write contact storage:",
      error
    );


    return false;

  }

}


/* =========================================================
   DISPATCH STORAGE EVENT
========================================================= */

function dispatchContactEvent(
  eventName,
  detail = null
) {

  if (
    typeof window === "undefined"
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
   SAVE CONTACT MESSAGE
========================================================= */

export function saveContactMessage(
  message
) {

  const normalized =
    normalizeMessage(
      message
    );


  if (!normalized) {

    throw new Error(
      "Invalid contact message."
    );

  }


  /* =======================================================
     VALIDATION
  ======================================================= */

  if (
    !normalized.name
  ) {

    throw new Error(
      "Name is required."
    );

  }


  if (
    !normalized.email
  ) {

    throw new Error(
      "Email is required."
    );

  }


  if (
    !normalized.message
  ) {

    throw new Error(
      "Message is required."
    );

  }


  const messages =
    readStorage();


  /* =======================================================
     PREVENT DUPLICATE IDS
  ======================================================= */

  const existingIndex =
    messages.findIndex(
      (item) =>
        item.id ===
        normalized.id
    );


  if (
    existingIndex >= 0
  ) {

    messages[
      existingIndex
    ] = normalized;

  } else {

    /*
      Newest messages go first.
    */

    messages.unshift(
      normalized
    );

  }


  const saved =
    writeStorage(
      messages
    );


  if (!saved) {

    throw new Error(
      "Could not save contact message."
    );

  }


  /* =======================================================
     UPDATE UI
  ======================================================= */

  dispatchContactEvent(
    "contact:updated",
    normalized
  );


  dispatchContactEvent(
    "contact:new",
    normalized
  );


  return normalized;

}


/* =========================================================
   GET ALL CONTACT MESSAGES
========================================================= */

export function getContactMessages() {

  return readStorage();

}


/* =========================================================
   GET CONTACT BY ID
========================================================= */

export function getContactMessageById(
  id
) {

  if (!id) {

    return undefined;

  }


  return readStorage().find(
    (message) =>
      message.id === id
  );

}


/* =========================================================
   GET LATEST MESSAGE
========================================================= */

export function getLatestContactMessage() {

  const messages =
    readStorage();


  return messages.length
    ? messages[0]
    : null;

}


/* =========================================================
   GET UNREAD MESSAGES
========================================================= */

export function getUnreadContactMessages() {

  return readStorage().filter(
    (message) =>
      message.read !== true
  );

}


/* =========================================================
   GET READ MESSAGES
========================================================= */

export function getReadContactMessages() {

  return readStorage().filter(
    (message) =>
      message.read === true
  );

}


/* =========================================================
   GET UNREAD COUNT
========================================================= */

export function getUnreadContactCount() {

  return (
    getUnreadContactMessages()
      .length
  );

}


/* =========================================================
   GET TOTAL COUNT
========================================================= */

export function getContactCount() {

  return (
    readStorage()
      .length
  );

}


/* =========================================================
   MARK AS READ
========================================================= */

export function markContactAsRead(
  id
) {

  if (!id) {

    return false;

  }


  const messages =
    readStorage();


  const message =
    messages.find(
      (item) =>
        item.id === id
    );


  if (!message) {

    return false;

  }


  message.read = true;


  const saved =
    writeStorage(
      messages
    );


  if (!saved) {

    return false;

  }


  dispatchContactEvent(
    "contact:read",
    message
  );


  dispatchContactEvent(
    "contact:updated",
    message
  );


  return true;

}


/* =========================================================
   MARK AS UNREAD
========================================================= */

export function markContactAsUnread(
  id
) {

  if (!id) {

    return false;

  }


  const messages =
    readStorage();


  const message =
    messages.find(
      (item) =>
        item.id === id
    );


  if (!message) {

    return false;

  }


  message.read = false;


  const saved =
    writeStorage(
      messages
    );


  if (!saved) {

    return false;

  }


  dispatchContactEvent(
    "contact:unread",
    message
  );


  dispatchContactEvent(
    "contact:updated",
    message
  );


  return true;

}


/* =========================================================
   MARK ALL AS READ
========================================================= */

export function markAllContactsAsRead() {

  const messages =
    readStorage();


  if (!messages.length) {

    return true;

  }


  const updatedMessages =
    messages.map(
      (message) => ({
        ...message,
        read: true,
      })
    );


  const saved =
    writeStorage(
      updatedMessages
    );


  if (!saved) {

    return false;

  }


  dispatchContactEvent(
    "contact:all-read"
  );


  dispatchContactEvent(
    "contact:updated"
  );


  return true;

}


/* =========================================================
   DELETE CONTACT MESSAGE
========================================================= */

export function deleteContactMessage(
  id
) {

  if (!id) {

    return false;

  }


  const messages =
    readStorage();


  const message =
    messages.find(
      (item) =>
        item.id === id
    );


  if (!message) {

    return false;

  }


  const updatedMessages =
    messages.filter(
      (item) =>
        item.id !== id
    );


  const saved =
    writeStorage(
      updatedMessages
    );


  if (!saved) {

    return false;

  }


  dispatchContactEvent(
    "contact:deleted",
    {
      id,
      message,
    }
  );


  dispatchContactEvent(
    "contact:updated"
  );


  return true;

}


/* =========================================================
   CLEAR ALL CONTACTS
========================================================= */

export function clearContactMessages() {

  if (
    typeof window === "undefined"
  ) {

    return false;

  }


  if (
    !storageAvailable()
  ) {

    return false;

  }


  try {

    window.localStorage.removeItem(
      CONTACT_STORAGE_KEY
    );


    dispatchContactEvent(
      "contact:cleared"
    );


    dispatchContactEvent(
      "contact:updated"
    );


    return true;

  } catch (error) {

    console.error(
      "Could not clear contact storage:",
      error
    );


    return false;

  }

}


/* =========================================================
   SEARCH CONTACTS
========================================================= */

export function searchContactMessages(
  query
) {

  const messages =
    readStorage();


  if (
    !query ||
    typeof query !== "string"
  ) {

    return messages;

  }


  const search =
    query
      .trim()
      .toLowerCase();


  if (!search) {

    return messages;

  }


  return messages.filter(
    (message) => {

      const name =
        message.name
          .toLowerCase();


      const email =
        message.email
          .toLowerCase();


      const text =
        message.message
          .toLowerCase();


      return (
        name.includes(search) ||
        email.includes(search) ||
        text.includes(search)
      );

    }
  );

}


/* =========================================================
   GET MESSAGES BY EMAIL
========================================================= */

export function getContactMessagesByEmail(
  email
) {

  if (
    !email ||
    typeof email !== "string"
  ) {

    return [];

  }


  const normalizedEmail =
    email
      .trim()
      .toLowerCase();


  return readStorage().filter(
    (message) =>
      message.email
        .toLowerCase() ===
      normalizedEmail
  );

}


/* =========================================================
   FORMAT DATE
========================================================= */

export function formatContactDate(
  date
) {

  if (!date) {

    return "";

  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return "";

  }


  try {

    return new Intl.DateTimeFormat(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(
      parsedDate
    );

  } catch (error) {

    return parsedDate
      .toLocaleString();

  }

}


/* =========================================================
   FORMAT TIME
========================================================= */

export function formatContactTime(
  date
) {

  if (!date) {

    return "";

  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return "";

  }


  try {

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(
      parsedDate
    );

  } catch (error) {

    return "";

  }

}


/* =========================================================
   FORMAT DATE ONLY
========================================================= */

export function formatContactDateOnly(
  date
) {

  if (!date) {

    return "";

  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return "";

  }


  try {

    return new Intl.DateTimeFormat(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(
      parsedDate
    );

  } catch (error) {

    return "";

  }

}


/* =========================================================
   SUBSCRIBE TO CONTACT UPDATES
========================================================= */

export function subscribeToContactStorage(
  callback
) {

  if (
    typeof window === "undefined"
  ) {

    return () => {};

  }


  if (
    typeof callback !== "function"
  ) {

    return () => {};

  }


  const update =
    () => {

      callback(
        readStorage()
      );

    };


  /* =======================================================
     BROWSER STORAGE EVENT
     Works across browser tabs/windows.
  ======================================================= */

  window.addEventListener(
    "storage",
    update
  );


  /* =======================================================
     SAME-PAGE EVENTS
  ======================================================= */

  const events = [

    "contact:new",

    "contact:updated",

    "contact:read",

    "contact:unread",

    "contact:all-read",

    "contact:deleted",

    "contact:cleared",

  ];


  events.forEach(
    (eventName) => {

      window.addEventListener(
        eventName,
        update
      );

    }
  );


  /* =======================================================
     CLEANUP
  ======================================================= */

  return () => {

    window.removeEventListener(
      "storage",
      update
    );


    events.forEach(
      (eventName) => {

        window.removeEventListener(
          eventName,
          update
        );

      }
    );

  };

}


/* =========================================================
   EXPORT DEFAULT
========================================================= */

export default {

  saveContactMessage,

  getContactMessages,

  getContactMessageById,

  getLatestContactMessage,

  getUnreadContactMessages,

  getReadContactMessages,

  getUnreadContactCount,

  getContactCount,

  markContactAsRead,

  markContactAsUnread,

  markAllContactsAsRead,

  deleteContactMessage,

  clearContactMessages,

  searchContactMessages,

  getContactMessagesByEmail,

  formatContactDate,

  formatContactTime,

  formatContactDateOnly,

  subscribeToContactStorage,

};
