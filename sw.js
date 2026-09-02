/* =========================================================
   PORTFOLIO PUSH NOTIFICATION SERVICE WORKER
========================================================= */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});


/* =========================================================
   PUSH EVENT
========================================================= */

self.addEventListener("push", (event) => {

  let data = {};

  try {

    data = event.data
      ? event.data.json()
      : {};

  } catch {

    data = {
      title: "New message",
      body: "You have a new visitor message.",
    };

  }


  const title =
    data.title ||
    "New message";


  const options = {

    body:
      data.body ||
      "You have a new visitor message.",

    icon:
      data.icon ||
      "/favicon.ico",

    badge:
      data.badge ||
      "/favicon.ico",

    tag:
      data.tag ||
      "portfolio-chat",

    renotify: true,

    requireInteraction:
      false,

    data: {

      conversationId:
        data.conversationId ||
        null,

      url:
        data.url ||
        "/",

    },

  };


  event.waitUntil(

    self.registration.showNotification(
      title,
      options
    )

  );

});


/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();


    const url =
      event.notification.data?.url ||
      "/";


    event.waitUntil(

      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clients) => {

          /*
            If the portfolio is already open,
            focus it.
          */

          for (
            const client of clients
          ) {

            if (
              "focus" in client
            ) {

              return client.focus();

            }

          }


          /*
            Otherwise open the portfolio.
          */

          if (
            self.clients.openWindow
          ) {

            return self.clients.openWindow(
              url
            );

          }

        })

    );

  }
);