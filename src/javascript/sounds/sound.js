/* =========================================================
   SOUND SYSTEM
========================================================= */

const sounds = {
  click: "/sounds/click.mp3",
  hover: "/sounds/hover.mp3",
  notification: "/sounds/notification.mp3",
};


/* =========================================================
   PLAY SOUND
========================================================= */

export function playSound(type, volume = 0.35) {

  const sound = sounds[type];

  if (!sound) return;

  const audio = new Audio(sound);

  audio.volume = volume;

  audio.currentTime = 0;

  audio.play().catch(() => {
    // Browser may block audio until user interaction.
  });
}


/* =========================================================
   SOUND HELPERS
========================================================= */

export function playClick() {
  playSound("click", 0.35);
}


export function playHover() {
  playSound("hover", 0.2);
}


export function playNotification() {
  playSound("notification", 0.4);
}