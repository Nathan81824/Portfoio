/* =========================================================
   PORTFOLIO SERVICE WORKER
   Nathan Portfolio
========================================================= */


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  (event) => {

    console.log(
      "[SW] Installing..."
    );

    self.skipWaiting();

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  (event) => {

    event.waitUntil(

      self.clients.claim()

    );

  }
);


/* =========================================================
   PUSH NOTIFICATION
========================================================= */

self.addEventListener(
  "push",
  (event) => {

    let data = {};


    /* =====================================================
       READ PUSH DATA
    ===================================================== */

    try {

      if (event.data) {

        data =
          event.data.json();

      }

    } catch (error) {

      console.warn(
        "[SW] Could not parse push data:",
        error
      );


      data = {

        title:
          "New message",

        body:
          "You have a new visitor message.",

      };

    }


    /* =====================================================
       NOTIFICATION DATA
    ===================================================== */

    const title =
      data.title ||
      "New message";


    const body =
      data.body ||
      "You have a new visitor message.";


    const conversationId =
      data.conversationId ||
      data.conversation_id ||
      null;


    const notificationUrl =
      data.url ||
      "./admin/chat";


    /* =====================================================
       NOTIFICATION OPTIONS
    ===================================================== */

    const options = {

      body,

      icon:
        data.icon ||
        "./favicon.ico",

      badge:
        data.badge ||
        "./favicon.ico",

      tag:
        data.tag ||
        "portfolio-chat",

      renotify:
        true,

      requireInteraction:
        false,

      data: {

        conversationId,

        url:
          notificationUrl,

      },

    };


    /* =====================================================
       SHOW NOTIFICATION
    ===================================================== */

    event.waitUntil(

      self.registration.showNotification(
        title,
        options
      )

    );

  }
);


/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();


    const notificationData =
      event.notification.data ||
      {};


    const targetUrl =
      notificationData.url ||
      "./admin/chat";


    event.waitUntil(

      self.clients
        .matchAll({

          type:
            "window",

          includeUncontrolled:
            true,

        })

        .then(
          async (clients) => {

            /* =============================================
               FIND EXISTING PORTFOLIO TAB
            ============================================= */

            for (
              const client of clients
            ) {

              if (
                "focus" in client
              ) {

                try {

                  /*
                    Tell the existing page which
                    conversation was opened.
                  */

                  if (
                    notificationData.conversationId
                  ) {

                    client.postMessage({

                      type:
                        "OPEN_CHAT_CONVERSATION",

                      conversationId:
                        notificationData
                          .conversationId,

                    });

                  }


                  await client.focus();

                  return;

                } catch {

                  // Continue.

                }

              }

            }


            /* =============================================
               OPEN PORTFOLIO
            ============================================= */

            if (
              self.clients.openWindow
            ) {

              return self.clients.openWindow(
                targetUrl
              );

            }

          }
        )

    );

  }
);


/* =========================================================
   SERVICE WORKER MESSAGE
========================================================= */

self.addEventListener(
  "message",
  (event) => {

    if (
      event.data?.type ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);