/* =========================================================
   SOUND SYSTEM
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/sound.js

   PURPOSE
   ---------------------------------------------------------
   Central sound utility for the portfolio.

   Future uses:
   - Button clicks
   - Navbar interactions
   - Notifications
   - Project slider
   - Theme toggle
   - Menu open / close
   - Success / error feedback

   Sounds:
   ---------------------------------------------------------
   /src/assets/sounds/click.mp3
   /src/assets/sounds/notification.mp3

   IMPORTANT
   ---------------------------------------------------------
   Sounds are NEVER played automatically.

   A component must explicitly call a sound function.
========================================================= */


/* =========================================================
   SOUND FILES
========================================================= */

import clickSoundFile from "../../assets/sounds/click.mp3";



/* =========================================================
   SOUND CONFIGURATION
========================================================= */

export const SOUND_CONFIG = {

  /* =======================================================
     MASTER VOLUME
  ======================================================= */

  volume:
    0.35,


  /* =======================================================
     DEFAULT VOLUME
  ======================================================= */

  clickVolume:
    0.35,

  notificationVolume:
    0.4,


  /* =======================================================
     ENABLED BY DEFAULT
  ======================================================= */

  enabled:
    true,

};


/* =========================================================
   SOUND FILES
========================================================= */

export const SOUND_FILES = {

  click:
    clickSoundFile,



};


/* =========================================================
   SOUND STATE
========================================================= */

let soundEnabled =
  SOUND_CONFIG.enabled;


/* =========================================================
   AUDIO CACHE
   ---------------------------------------------------------
   Keeps Audio objects ready for reuse.
========================================================= */

const audioCache =
  new Map();


/* =========================================================
   CREATE AUDIO
========================================================= */

function createAudio(
  src
) {

  if (
    typeof window === "undefined"
  ) {

    return null;

  }


  if (
    audioCache.has(src)
  ) {

    return audioCache.get(src);

  }


  const audio =
    new Audio(src);


  audio.preload =
    "auto";


  audio.volume =
    SOUND_CONFIG.volume;


  audioCache.set(
    src,
    audio
  );


  return audio;

}


/* =========================================================
   PLAY SOUND
========================================================= */

export function playSound(
  src,
  volume = SOUND_CONFIG.volume
) {

  if (
    !soundEnabled
  ) {

    return;

  }


  if (
    typeof window === "undefined"
  ) {

    return;

  }


  if (
    !src
  ) {

    return;

  }


  try {

    const audio =
      createAudio(src);


    if (
      !audio
    ) {

      return;

    }


    /* =====================================================
       RESET AUDIO
    ===================================================== */

    audio.pause();

    audio.currentTime =
      0;


    /* =====================================================
       SET VOLUME
    ===================================================== */

    audio.volume =
      Math.min(
        Math.max(
          volume,
          0
        ),
        1
      );


    /* =====================================================
       PLAY
    ===================================================== */

    const playPromise =
      audio.play();


    /*
      Browsers can reject audio playback if it violates
      their autoplay/user-interaction rules.

      We silently handle that case.
    */

    if (
      playPromise &&
      typeof playPromise.catch ===
        "function"
    ) {

      playPromise.catch(
        () => {}
      );

    }

  } catch (error) {

    console.warn(
      "Unable to play sound:",
      error
    );

  }

}


/* =========================================================
   CLICK SOUND
========================================================= */

export function playClick(
  volume = SOUND_CONFIG.clickVolume
) {

  playSound(
    SOUND_FILES.click,
    volume
  );

}


/* =========================================================
   NOTIFICATION SOUND
========================================================= */

export function playNotification(
  volume =
    SOUND_CONFIG.notificationVolume
) {

  playSound(
    SOUND_FILES.notification,
    volume
  );

}


/* =========================================================
   ENABLE SOUND
========================================================= */

export function enableSound() {

  soundEnabled =
    true;

}


/* =========================================================
   DISABLE SOUND
========================================================= */

export function disableSound() {

  soundEnabled =
    false;

}


/* =========================================================
   TOGGLE SOUND
========================================================= */

export function toggleSound() {

  soundEnabled =
    !soundEnabled;


  return soundEnabled;

}


/* =========================================================
   GET SOUND STATE
========================================================= */

export function isSoundEnabled() {

  return soundEnabled;

}


/* =========================================================
   SET MASTER VOLUME
========================================================= */

export function setSoundVolume(
  volume
) {

  const safeVolume =
    Math.min(
      Math.max(
        Number(volume) || 0,
        0
      ),
      1
    );


  SOUND_CONFIG.volume =
    safeVolume;


  /*
    Update already-created audio objects.
  */

  audioCache.forEach(
    (audio) => {

      audio.volume =
        safeVolume;

    }
  );

}


/* =========================================================
   GET MASTER VOLUME
========================================================= */

export function getSoundVolume() {

  return SOUND_CONFIG.volume;

}


/* =========================================================
   PRELOAD SOUND
========================================================= */

export function preloadSound(
  src
) {

  if (
    typeof window === "undefined"
  ) {

    return null;

  }


  if (
    !src
  ) {

    return null;

  }


  return createAudio(
    src
  );

}


/* =========================================================
   PRELOAD ALL SOUNDS
========================================================= */

export function preloadSounds() {

  Object.values(
    SOUND_FILES
  ).forEach(
    (src) => {

      preloadSound(
        src
      );

    }
  );

}


/* =========================================================
   CLEAR AUDIO CACHE
========================================================= */

export function clearSoundCache() {

  audioCache.forEach(
    (audio) => {

      audio.pause();

      audio.currentTime =
        0;

    }
  );


  audioCache.clear();

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  playSound,

  playClick,

  playNotification,

  enableSound,

  disableSound,

  toggleSound,

  isSoundEnabled,

  setSoundVolume,

  getSoundVolume,

  preloadSound,

  preloadSounds,

  clearSoundCache,

};
