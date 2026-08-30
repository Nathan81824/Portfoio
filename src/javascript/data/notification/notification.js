/* =========================================================
   BROWSER NOTIFICATION SYSTEM
   Nathan — Frontend Developer Portfolio

   Browser-only contact notification system.
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY =
  "portfolio_contact_messages";

const NOTIFICATION_ICON =
  "/favicon.ico";

const MAX_MESSAGE_PREVIEW =
  120;


/* =========================================================
   CHECK SUPPORT
========================================================= */

export function notificationsSupported() {

  return (
    typeof window !== "undefined" &&
    "Notification" in window
  );

}


/* =========================================================
   GET PERMISSION
========================================================= */

export function getNotificationPermission() {

  if (
    !notificationsSupported()
  ) {

    return "unsupported";

  }

  return Notification.permission;

}


/* =========================================================
   REQUEST PERMISSION
========================================================= */

export async function requestNotificationPermission() {

  if (
    !notificationsSupported()
  ) {

    return "unsupported";

  }


  if (
    Notification.permission ===
    "granted"
  ) {

    return "granted";

  }


  if (
    Notification.permission ===
    "denied"
  ) {

    return "denied";

  }


  try {

    const permission =
      await Notification.requestPermission();

    return permission;

  } catch (error) {

    console.error(
      "Notification permission error:",
      error
    );

    return "denied";

  }

}


/* =========================================================
   SAVE CONTACT MESSAGE
========================================================= */

export function saveContactMessage({

  name = "",

  email = "",

  message = "",

} = {}) {

  const contactMessage = {

    id:
      Date.now(),

    name:
      String(name).trim(),

    email:
      String(email).trim(),

    message:
      String(message).trim(),

    createdAt:
      new Date().toISOString(),

    read:
      false,

  };


  try {

    const existing =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "[]"
      );


    existing.unshift(
      contactMessage
    );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing)
    );


    return contactMessage;

  } catch (error) {

    console.error(
      "Unable to save contact message:",
      error
    );

    return contactMessage;

  }

}


/* =========================================================
   GET CONTACT MESSAGES
========================================================= */

export function getContactMessages() {

  try {

    return JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) || "[]"
    );

  } catch (error) {

    console.error(
      "Unable to read contact messages:",
      error
    );

    return [];

  }

}


/* =========================================================
   MARK AS READ
========================================================= */

export function markMessageAsRead(
  messageId
) {

  const messages =
    getContactMessages();


  const updated =
    messages.map(
      (message) => {

        if (
          message.id ===
          messageId
        ) {

          return {
            ...message,
            read: true,
          };

        }

        return message;

      }
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );


  return updated;

}


/* =========================================================
   DELETE MESSAGE
========================================================= */

export function deleteContactMessage(
  messageId
) {

  const messages =
    getContactMessages();


  const updated =
    messages.filter(
      (message) =>
        message.id !== messageId
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );


  return updated;

}


/* =========================================================
   CLEAR MESSAGES
========================================================= */

export function clearContactMessages() {

  localStorage.removeItem(
    STORAGE_KEY
  );

}


/* =========================================================
   CREATE REPLY LINK
========================================================= */

export function createReplyLink({

  email = "",

  subject =
    "Re: Your portfolio message",

} = {}) {

  const cleanEmail =
    String(email).trim();


  if (!cleanEmail) {

    return "";

  }


  return (
    `mailto:${encodeURIComponent(cleanEmail)}` +
    `?subject=${encodeURIComponent(subject)}`
  );

}


/* =========================================================
   REPLY TO VISITOR
========================================================= */

export function replyToVisitor({

  email = "",

  subject =
    "Re: Your portfolio message",

} = {}) {

  const replyLink =
    createReplyLink({
      email,
      subject,
    });


  if (!replyLink) {

    return false;

  }


  window.location.href =
    replyLink;


  return true;

}


/* =========================================================
   SHOW BROWSER NOTIFICATION
========================================================= */

export async function showContactNotification(
  contactMessage
) {

  if (
    !notificationsSupported()
  ) {

    console.warn(
      "Browser notifications are not supported."
    );

    return null;

  }


  let permission =
    Notification.permission;


  if (
    permission ===
    "default"
  ) {

    permission =
      await requestNotificationPermission();

  }


  if (
    permission !==
    "granted"
  ) {

    console.warn(
      "Notification permission was not granted."
    );

    return null;

  }


  const {

    id,
    name,
    email,
    message,

  } =
    contactMessage;


  let preview =
    message ||
    "New portfolio message.";


  if (
    preview.length >
    MAX_MESSAGE_PREVIEW
  ) {

    preview =
      preview.slice(
        0,
        MAX_MESSAGE_PREVIEW
      ) +
      "...";

  }


  try {

    const notification =
      new Notification(

        `New message from ${
          name || "Visitor"
        }`,

        {

          body:
            `${email}\n${preview}`,

          icon:
            NOTIFICATION_ICON,

          tag:
            `portfolio-contact-${id}`,

          renotify:
            true,

          requireInteraction:
            true,

        }

      );


    notification.onclick =
      () => {

        window.focus();

        notification.close();

      };


    return notification;

  } catch (error) {

    console.error(
      "Notification creation error:",
      error
    );

    return null;

  }

}


/* =========================================================
   RECEIVE CONTACT MESSAGE
========================================================= */

export async function receiveContactMessage({

  name = "",

  email = "",

  message = "",

} = {}) {

  const cleanName =
    String(name).trim();

  const cleanEmail =
    String(email).trim();

  const cleanMessage =
    String(message).trim();


  if (!cleanName) {

    throw new Error(
      "Name is required."
    );

  }


  if (!cleanEmail) {

    throw new Error(
      "Email is required."
    );

  }


  if (!cleanMessage) {

    throw new Error(
      "Message is required."
    );

  }


  const contactMessage =
    saveContactMessage({

      name:
        cleanName,

      email:
        cleanEmail,

      message:
        cleanMessage,

    });


  await showContactNotification(
    contactMessage
  );


  return contactMessage;

}


/* =========================================================
   ⭐ NOTIFY NEW CONTACT
   This is the function your FloatingContact.jsx imports.
========================================================= */

export async function notifyNewContact({

  name = "",

  email = "",

  message = "",

} = {}) {

  return receiveContactMessage({

    name,

    email,

    message,

  });

}


/* =========================================================
   TEST NOTIFICATION
========================================================= */

export async function testNotification() {

  return showContactNotification({

    id:
      Date.now(),

    name:
      "Test Visitor",

    email:
      "test@example.com",

    message:
      "Your browser notification system is working.",

  });

}


/* =========================================================
   ENABLE NOTIFICATIONS
========================================================= */

export async function enableNotifications() {

  const permission =
    await requestNotificationPermission();


  if (
    permission ===
    "granted"
  ) {

    await testNotification();

  }


  return permission;

}


/* =========================================================
   UNREAD COUNT
========================================================= */

export function getUnreadMessageCount() {

  return getContactMessages()
    .filter(
      (message) =>
        message.read !== true
    )
    .length;

}


/* =========================================================
   LATEST MESSAGE
========================================================= */

export function getLatestContactMessage() {

  const messages =
    getContactMessages();


  return (
    messages[0] ||
    null
  );

}


/* =========================================================
   REPLY TO SAVED MESSAGE
========================================================= */

export function replyToMessage(
  message
) {

  if (
    !message ||
    !message.email
  ) {

    return false;

  }


  return replyToVisitor({

    email:
      message.email,

    subject:
      `Re: Message from ${
        message.name ||
        "Visitor"
      }`,

  });

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  notificationsSupported,

  getNotificationPermission,

  requestNotificationPermission,

  saveContactMessage,

  getContactMessages,

  markMessageAsRead,

  deleteContactMessage,

  clearContactMessages,

  createReplyLink,

  replyToVisitor,

  showContactNotification,

  receiveContactMessage,

  notifyNewContact,

  testNotification,

  enableNotifications,

  getUnreadMessageCount,

  getLatestContactMessage,

  replyToMessage,

};
