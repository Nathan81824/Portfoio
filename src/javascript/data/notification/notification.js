/* =========================================================
   NOTIFICATION SYSTEM
   Nathan Portfolio

   Handles:
   - Browser notifications
   - Push notification preparation
   - New visitor message notifications
   - 5-minute unanswered reminders
   - Admin Chat active state
   - Notification cleanup
========================================================= */


/* =========================================================
   CONSTANTS
========================================================= */

const NOTIFICATION_STORAGE_KEY =
  "portfolio_notifications";

const PUSH_SUBSCRIPTION_KEY =
  "portfolio_push_subscription";

const ADMIN_CHAT_ACTIVE_KEY =
  "portfolio_admin_chat_active";

const UNANSWERED_TIMERS_KEY =
  "portfolio_unanswered_timers";

const UNANSWERED_DELAY =
  5 * 60 * 1000;


/* =========================================================
   INTERNAL STATE
========================================================= */

const unansweredTimers =
  new Map();


/* =========================================================
   SAFE JSON PARSE
========================================================= */

function safeParse(
  value,
  fallback
) {

  try {

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;

  }

}


/* =========================================================
   GET STORED NOTIFICATIONS
========================================================= */

export function getNotifications() {

  try {

    const stored =
      localStorage.getItem(
        NOTIFICATION_STORAGE_KEY
      );


    const notifications =
      safeParse(
        stored,
        []
      );


    return Array.isArray(
      notifications
    )
      ? notifications
      : [];

  } catch {

    return [];

  }

}


/* =========================================================
   SAVE NOTIFICATIONS
========================================================= */

function saveNotifications(
  notifications
) {

  try {

    localStorage.setItem(
      NOTIFICATION_STORAGE_KEY,

      JSON.stringify(
        notifications
      )

    );

  } catch (error) {

    console.warn(
      "Could not save notifications:",
      error
    );

  }

}


/* =========================================================
   ADD NOTIFICATION
========================================================= */

function addNotification(
  notification
) {

  const notifications =
    getNotifications();


  notifications.unshift(
    notification
  );


  /*
    Keep the notification list
    from growing forever.
  */

  const limited =
    notifications.slice(
      0,
      100
    );


  saveNotifications(
    limited
  );


  /*
    Notify React components.
  */

  dispatchNotificationEvent(
    "portfolio:notification-created",
    notification
  );


  return notification;

}


/* =========================================================
   CREATE NOTIFICATION
========================================================= */

export function createNotification({

  title,

  message,

  conversationId = null,

  type = "chat",

}) {

  const notification = {

    id:
      crypto.randomUUID(),

    title:
      title ||
      "New message",

    message:
      message ||
      "",

    conversationId,

    type,

    read:
      false,

    createdAt:
      new Date().toISOString(),

  };


  return addNotification(
    notification
  );

}


/* =========================================================
   MARK AS READ
========================================================= */

export function markNotificationRead(
  notificationId
) {

  const notifications =
    getNotifications();


  const updated =
    notifications.map(
      (notification) => {

        if (
          notification.id !==
          notificationId
        ) {

          return notification;

        }


        return {

          ...notification,

          read: true,

        };

      }
    );


  saveNotifications(
    updated
  );


  dispatchNotificationEvent(
    "portfolio:notification-read",
    {
      notificationId,
    }
  );


  return updated;

}


/* =========================================================
   MARK ALL READ
========================================================= */

export function markAllNotificationsRead() {

  const notifications =
    getNotifications();


  const updated =
    notifications.map(
      (notification) => ({

        ...notification,

        read: true,

      })
    );


  saveNotifications(
    updated
  );


  dispatchNotificationEvent(
    "portfolio:notifications-read-all",
    {}
  );


  return updated;

}


/* =========================================================
   DELETE ONE NOTIFICATION
========================================================= */

export function deleteNotification(
  notificationId
) {

  const notifications =
    getNotifications();


  const updated =
    notifications.filter(
      (notification) =>
        notification.id !==
        notificationId
    );


  saveNotifications(
    updated
  );


  dispatchNotificationEvent(
    "portfolio:notification-deleted",
    {
      notificationId,
    }
  );


  return updated;

}


/* =========================================================
   DELETE NOTIFICATIONS FOR CONVERSATION
========================================================= */

export function deleteConversationNotifications(
  conversationId
) {

  if (!conversationId) {

    return;

  }


  const notifications =
    getNotifications();


  const updated =
    notifications.filter(
      (notification) =>
        notification.conversationId !==
        conversationId
    );


  saveNotifications(
    updated
  );


  /*
    Cancel unanswered timer.
  */

  cancelUnansweredReminder(
    conversationId
  );


  dispatchNotificationEvent(
    "portfolio:conversation-notifications-cleaned",
    {
      conversationId,
    }
  );

}


/* =========================================================
   DELETE ALL NOTIFICATIONS
========================================================= */

export function deleteAllNotifications() {

  saveNotifications(
    []
  );


  /*
    Cancel every unanswered timer.
  */

  unansweredTimers.forEach(
    (timer) => {

      clearTimeout(
        timer
      );

    }
  );


  unansweredTimers.clear();


  saveUnansweredTimers();


  dispatchNotificationEvent(
    "portfolio:notifications-cleared",
    {}
  );

}


/* =========================================================
   UNREAD COUNT
========================================================= */

export function getUnreadNotificationCount() {

  return getNotifications()
    .filter(
      (notification) =>
        !notification.read
    )
    .length;

}


/* =========================================================
   ADMIN CHAT ACTIVE STATE
========================================================= */

export function setAdminChatActive(
  active,
  conversationId = null
) {

  try {

    if (active) {

      localStorage.setItem(

        ADMIN_CHAT_ACTIVE_KEY,

        JSON.stringify({

          active: true,

          conversationId,

        })

      );

    } else {

      localStorage.setItem(

        ADMIN_CHAT_ACTIVE_KEY,

        JSON.stringify({

          active: false,

          conversationId: null,

        })

      );

    }

  } catch {

    // Ignore.

  }


  dispatchNotificationEvent(
    "portfolio:admin-chat-state",
    {
      active,
      conversationId,
    }
  );

}


/* =========================================================
   GET ADMIN CHAT STATE
========================================================= */

export function getAdminChatState() {

  try {

    return safeParse(

      localStorage.getItem(
        ADMIN_CHAT_ACTIVE_KEY
      ),

      {
        active: false,
        conversationId: null,
      }

    );

  } catch {

    return {

      active: false,

      conversationId: null,

    };

  }

}


/* =========================================================
   CHECK IF ADMIN CHAT IS ACTIVE
========================================================= */

export function isAdminChatActive(
  conversationId = null
) {

  const state =
    getAdminChatState();


  if (!state.active) {

    return false;

  }


  /*
    If no conversation was supplied,
    simply check whether Admin Chat
    is open.
  */

  if (!conversationId) {

    return true;

  }


  return (
    state.conversationId ===
    conversationId
  );

}


/* =========================================================
   REQUEST NOTIFICATION PERMISSION
========================================================= */

export async function requestNotificationPermission() {

  if (
    typeof window ===
    "undefined"
  ) {

    return "denied";

  }


  if (
    !("Notification" in window)
  ) {

    console.warn(
      "This browser does not support notifications."
    );

    return "denied";

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


    dispatchNotificationEvent(
      "portfolio:notification-permission",
      {
        permission,
      }
    );


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
   GET SERVICE WORKER REGISTRATION
========================================================= */

export async function getServiceWorkerRegistration() {

  if (
    !("serviceWorker" in navigator)
  ) {

    return null;

  }


  try {

    const registration =
      await navigator.serviceWorker.ready;


    return registration;

  } catch (error) {

    console.error(
      "Service Worker unavailable:",
      error
    );


    return null;

  }

}


/* =========================================================
   SHOW LOCAL NOTIFICATION
========================================================= */

export async function showNotification({

  title =
    "New message",

  body =
    "You have a new visitor message.",

  conversationId = null,

  tag =
    "portfolio-chat",

}) {

  /*
    Don't notify if Admin Chat is
    currently viewing this conversation.
  */

  if (
    isAdminChatActive(
      conversationId
    )
  ) {

    dispatchNotificationEvent(
      "portfolio:chat-message-visible",
      {
        conversationId,
      }
    );


    return null;

  }


  const permission =
    await requestNotificationPermission();


  if (
    permission !==
    "granted"
  ) {

    return null;

  }


  const notification =
    createNotification({

      title,

      message: body,

      conversationId,

      type: "chat",

    });


  /*
    Prefer the Service Worker when
    available.
  */

  const registration =
    await getServiceWorkerRegistration();


  if (registration) {

    try {

      await registration.showNotification(
        title,
        {

          body,

          icon:
            `${import.meta.env.BASE_URL}favicon.ico`,

          badge:
            `${import.meta.env.BASE_URL}favicon.ico`,

          tag,

          renotify:
            true,

          data: {

            conversationId,

            url:
              `${import.meta.env.BASE_URL}admin/chat`,

          },

        }
      );


      return notification;

    } catch (error) {

      console.warn(
        "Service Worker notification failed:",
        error
      );

    }

  }


  /*
    Fallback for browsers where the
    Service Worker isn't available.
  */

  try {

    const browserNotification =
      new Notification(
        title,
        {

          body,

          tag,

        }
      );


    browserNotification.onclick =
      () => {

        window.focus();

        browserNotification.close();

        dispatchNotificationEvent(
          "portfolio:notification-clicked",
          {
            conversationId,
          }
        );

      };


  } catch (error) {

    console.warn(
      "Browser notification failed:",
      error
    );

  }


  return notification;

}


/* =========================================================
   NEW MESSAGE NOTIFICATION
========================================================= */

export async function notifyNewMessage({

  conversationId,

  visitorName =
    "Visitor",

  message,

}) {

  if (!message) {

    return null;

  }


  /*
    If admin is currently looking at
    this conversation, don't send a
    notification.
  */

  if (
    isAdminChatActive(
      conversationId
    )
  ) {

    dispatchNotificationEvent(
      "portfolio:chat-live-message",
      {
        conversationId,
        visitorName,
        message,
      }
    );


    return null;

  }


  const notification =
    await showNotification({

      title:
        `${visitorName} sent a message`,

      body:
        message,

      conversationId,

      tag:
        `chat-${conversationId}`,

    });


  /*
    Start the 5-minute reminder.
  */

  startUnansweredReminder({

    conversationId,

    visitorName,

  });


  return notification;

}


/* =========================================================
   COMPATIBILITY EXPORT
========================================================= */

export async function notifyNewContact(
  payload
) {

  return notifyNewMessage(
    payload
  );

}


/* =========================================================
   UNANSWERED TIMER STORAGE
========================================================= */

function getUnansweredTimers() {

  try {

    return safeParse(

      localStorage.getItem(
        UNANSWERED_TIMERS_KEY
      ),

      {}

    );

  } catch {

    return {};

  }

}


/* =========================================================
   SAVE UNANSWERED TIMERS
========================================================= */

function saveUnansweredTimers() {

  try {

    const timers = {};


    unansweredTimers.forEach(
      (_, conversationId) => {

        timers[
          conversationId
        ] = true;

      }
    );


    localStorage.setItem(

      UNANSWERED_TIMERS_KEY,

      JSON.stringify(
        timers
      )

    );

  } catch {

    // Ignore.

  }

}


/* =========================================================
   START UNANSWERED REMINDER
========================================================= */

export function startUnansweredReminder({

  conversationId,

  visitorName =
    "Visitor",

}) {

  if (!conversationId) {

    return;

  }


  /*
    Don't create duplicate timers.
  */

  if (
    unansweredTimers.has(
      conversationId
    )
  ) {

    return;

  }


  /*
    If admin is already looking at
    the conversation, no reminder.
  */

  if (
    isAdminChatActive(
      conversationId
    )
  ) {

    return;

  }


  const timer =
    setTimeout(
      async () => {

        unansweredTimers.delete(
          conversationId
        );


        saveUnansweredTimers();


        /*
          Check again after five minutes.
        */

        if (
          isAdminChatActive(
            conversationId
          )
        ) {

          return;

        }


        await showNotification({

          title:
            "Unanswered message",

          body:
            `${visitorName} is waiting for a reply.`,

          conversationId,

          tag:
            `unanswered-${conversationId}`,

        });

      },

      UNANSWERED_DELAY

    );


  unansweredTimers.set(
    conversationId,
    timer
  );


  saveUnansweredTimers();

}


/* =========================================================
   CANCEL UNANSWERED REMINDER
========================================================= */

export function cancelUnansweredReminder(
  conversationId
) {

  if (!conversationId) {

    return;

  }


  const timer =
    unansweredTimers.get(
      conversationId
    );


  if (timer) {

    clearTimeout(
      timer
    );

  }


  unansweredTimers.delete(
    conversationId
  );


  saveUnansweredTimers();

}


/* =========================================================
   ADMIN REPLIED
========================================================= */

export function adminReplied(
  conversationId
) {

  if (!conversationId) {

    return;

  }


  cancelUnansweredReminder(
    conversationId
  );


  /*
    Remove normal message notifications
    for the conversation after replying.
  */

  deleteConversationNotifications(
    conversationId
  );


  dispatchNotificationEvent(
    "portfolio:admin-replied",
    {
      conversationId,
    }
  );

}


/* =========================================================
   PUSH SUBSCRIPTION
========================================================= */

export async function getPushSubscription() {

  const registration =
    await getServiceWorkerRegistration();


  if (!registration) {

    return null;

  }


  try {

    const subscription =
      await registration.pushManager
        .getSubscription();


    return subscription;

  } catch (error) {

    console.error(
      "Could not get push subscription:",
      error
    );


    return null;

  }

}


/* =========================================================
   STORE PUSH SUBSCRIPTION
========================================================= */

function storePushSubscription(
  subscription
) {

  try {

    if (!subscription) {

      localStorage.removeItem(
        PUSH_SUBSCRIPTION_KEY
      );

      return;

    }


    localStorage.setItem(

      PUSH_SUBSCRIPTION_KEY,

      JSON.stringify(
        subscription
      )

    );

  } catch (error) {

    console.warn(
      "Could not store push subscription:",
      error
    );

  }

}


/* =========================================================
   GET STORED PUSH SUBSCRIPTION
========================================================= */

export function getStoredPushSubscription() {

  try {

    return safeParse(

      localStorage.getItem(
        PUSH_SUBSCRIPTION_KEY
      ),

      null

    );

  } catch {

    return null;

  }

}


/* =========================================================
   CREATE PUSH SUBSCRIPTION
========================================================= */

export async function subscribeToPush(
  applicationServerKey
) {

  if (
    !applicationServerKey
  ) {

    console.warn(
      "Push subscription requires a VAPID public key."
    );


    return null;

  }


  const permission =
    await requestNotificationPermission();


  if (
    permission !==
    "granted"
  ) {

    return null;

  }


  const registration =
    await getServiceWorkerRegistration();


  if (!registration) {

    return null;

  }


  try {

    let subscription =
      await registration.pushManager
        .getSubscription();


    if (!subscription) {

      subscription =
        await registration.pushManager
          .subscribe({

            userVisibleOnly:
              true,

            applicationServerKey,

          });

    }


    storePushSubscription(
      subscription.toJSON()
    );


    dispatchNotificationEvent(
      "portfolio:push-subscribed",
      {
        subscription:
          subscription.toJSON(),
      }
    );


    return subscription;

  } catch (error) {

    console.error(
      "Push subscription failed:",
      error
    );


    return null;

  }

}


/* =========================================================
   UNSUBSCRIBE PUSH
========================================================= */

export async function unsubscribeFromPush() {

  const subscription =
    await getPushSubscription();


  if (!subscription) {

    return true;

  }


  try {

    await subscription.unsubscribe();


    storePushSubscription(
      null
    );


    dispatchNotificationEvent(
      "portfolio:push-unsubscribed",
      {}
    );


    return true;

  } catch (error) {

    console.error(
      "Push unsubscribe failed:",
      error
    );


    return false;

  }

}


/* =========================================================
   CHAT EVENT LISTENERS
========================================================= */

function setupChatEventListeners() {

  if (
    typeof window ===
    "undefined"
  ) {

    return () => {};

  }


  /* =======================================================
     NEW CHAT MESSAGE
  ======================================================= */

  const handleNewMessage =
    (event) => {

      const message =
        event.detail;


      if (!message) {

        return;

      }


      /*
        Only visitor messages should
        notify the admin.

        If your database uses another
        sender name, adjust this check.
      */

      if (
        message.sender !==
        "visitor"
      ) {

        return;

      }


      notifyNewMessage({

        conversationId:
          message.conversation_id,

        visitorName:
          message.visitor_name ||
          "Visitor",

        message:
          message.message ||
          message.content ||
          "",

      });

    };


  /* =======================================================
     SINGLE CONVERSATION DELETED
  ======================================================= */

  const handleConversationDeleted =
    (event) => {

      const conversationId =
        event.detail?.conversationId;


      if (!conversationId) {

        return;

      }


      deleteConversationNotifications(
        conversationId
      );

    };


  /* =======================================================
     ALL CONVERSATIONS DELETED
  ======================================================= */

  const handleAllDeleted =
    () => {

      deleteAllNotifications();

    };


  window.addEventListener(

    "portfolio:chat:new-message",

    handleNewMessage

  );


  window.addEventListener(

    "portfolio:conversation-deleted",

    handleConversationDeleted

  );


  window.addEventListener(

    "portfolio:all-conversations-deleted",

    handleAllDeleted

  );


  return () => {

    window.removeEventListener(

      "portfolio:chat:new-message",

      handleNewMessage

    );


    window.removeEventListener(

      "portfolio:conversation-deleted",

      handleConversationDeleted

    );


    window.removeEventListener(

      "portfolio:all-conversations-deleted",

      handleAllDeleted

    );

  };

}


/* =========================================================
   GLOBAL EVENT DISPATCHER
========================================================= */

function dispatchNotificationEvent(
  eventName,
  detail
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

  } catch {

    // Ignore.

  }

}


/* =========================================================
   INITIALIZE NOTIFICATION SYSTEM
========================================================= */

export function initializeNotifications() {

  if (
    typeof window ===
    "undefined"
  ) {

    return () => {};

  }


  const cleanup =
    setupChatEventListeners();


  /*
    Let the application know the
    notification system is ready.
  */

  dispatchNotificationEvent(

    "portfolio:notifications-ready",

    {}

  );


  return cleanup;

}


/* =========================================================
   AUTO INITIALIZATION
========================================================= */

let cleanupNotificationSystem =
  null;


export function startNotificationSystem() {

  if (
    cleanupNotificationSystem
  ) {

    return cleanupNotificationSystem;

  }


  cleanupNotificationSystem =
    initializeNotifications();


  return cleanupNotificationSystem;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  getNotifications,

  createNotification,

  showNotification,

  notifyNewMessage,

  notifyNewContact,

  markNotificationRead,

  markAllNotificationsRead,

  deleteNotification,

  deleteConversationNotifications,

  deleteAllNotifications,

  getUnreadNotificationCount,

  setAdminChatActive,

  getAdminChatState,

  isAdminChatActive,

  requestNotificationPermission,

  getServiceWorkerRegistration,

  getPushSubscription,

  getStoredPushSubscription,

  subscribeToPush,

  unsubscribeFromPush,

  startUnansweredReminder,

  cancelUnansweredReminder,

  adminReplied,

  initializeNotifications,

  startNotificationSystem,

};