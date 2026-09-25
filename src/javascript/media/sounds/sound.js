
import jumpSound from "../../../assets/sounds/jump.mp3";
import clickSound from "../../../assets/sounds/click.mp3";
import errorSound from "../../../assets/sounds/error.mp3";
import gameOverSound from "../../../assets/sounds/gameover.mp3";
import gameBonusSound from "../../../assets/sounds/GameBonus.mp3";
import victorySound from "../../../assets/sounds/victory.mp3";
import notificationSound from "../../../assets/sounds/notification.mp3";

// =========================================================
// SOUND CONFIG
// =========================================================

export const SOUND_CONFIG = {
  enabled: true,
  volume: 0.35,
};

// =========================================================
// SOUND FILES
// =========================================================

export const SOUND_FILES = {
  jump: jumpSound,
  click: clickSound,
  error: errorSound,
  gameover: gameOverSound,
  GameBonus: gameBonusSound,
  victory: victorySound,
  notification: notificationSound,
};

// =========================================================
// SOUND CACHE
// =========================================================

const soundCache = new Map();

// =========================================================
// SOUND STATE
// =========================================================

let soundEnabled = SOUND_CONFIG.enabled;
let soundVolume = SOUND_CONFIG.volume;

// =========================================================
// CREATE / GET SOUND
// =========================================================

function getSound(name) {
  if (!SOUND_FILES[name]) {
    console.warn(
      `[Sound] Sound "${name}" does not exist.`
    );

    return null;
  }

  if (!soundCache.has(name)) {
    const audio = new Audio(
      SOUND_FILES[name]
    );

    audio.preload = "auto";
    audio.volume = soundVolume;

    soundCache.set(
      name,
      audio
    );
  }

  return soundCache.get(name);
}

// =========================================================
// PLAY SOUND
// =========================================================

export function playSound(name) {
  if (!soundEnabled) {
    return;
  }

  const sound = getSound(name);

  if (!sound) {
    return;
  }

  try {
    sound.pause();

    sound.currentTime = 0;

    sound.volume = soundVolume;

    const promise =
      sound.play();

    if (
      promise &&
      typeof promise.catch ===
        "function"
    ) {
      promise.catch(() => {
        // Browser may block audio
        // before user interaction.
      });
    }
  } catch (error) {
    console.warn(
      `[Sound] Could not play "${name}".`,
      error
    );
  }
}

// =========================================================
// PLAY CLICK
// =========================================================

export function playClick() {
  playSound("click");
}

// =========================================================
// PLAY NOTIFICATION
// =========================================================

export function playNotification() {
  playSound("notification");
}

// =========================================================
// ENABLE SOUND
// =========================================================

export function enableSound() {
  soundEnabled = true;

  SOUND_CONFIG.enabled = true;

  return soundEnabled;
}

// =========================================================
// DISABLE SOUND
// =========================================================

export function disableSound() {
  soundEnabled = false;

  SOUND_CONFIG.enabled = false;

  return soundEnabled;
}

// =========================================================
// TOGGLE SOUND
// =========================================================

export function toggleSound() {
  soundEnabled = !soundEnabled;

  SOUND_CONFIG.enabled =
    soundEnabled;

  return soundEnabled;
}

// =========================================================
// CHECK SOUND STATE
// =========================================================

export function isSoundEnabled() {
  return soundEnabled;
}

// =========================================================
// SET VOLUME
// =========================================================

export function setSoundVolume(volume) {
  const nextVolume = Math.min(
    Math.max(Number(volume) || 0, 0),
    1
  );

  soundVolume = nextVolume;

  SOUND_CONFIG.volume =
    nextVolume;

  soundCache.forEach(
    (sound) => {
      sound.volume =
        nextVolume;
    }
  );

  return soundVolume;
}

// =========================================================
// GET VOLUME
// =========================================================

export function getSoundVolume() {
  return soundVolume;
}

// =========================================================
// PRELOAD ONE SOUND
// =========================================================

export function preloadSound(name) {
  const sound = getSound(name);

  if (!sound) {
    return;
  }

  sound.load();
}

// =========================================================
// PRELOAD MULTIPLE SOUNDS
// =========================================================

export function preloadSounds(
  names = Object.keys(
    SOUND_FILES
  )
) {
  names.forEach(
    (name) => {
      preloadSound(name);
    }
  );
}

// =========================================================
// CLEAR SOUND CACHE
// =========================================================

export function clearSoundCache() {
  soundCache.forEach(
    (sound) => {
      sound.pause();

      sound.currentTime = 0;

      sound.src = "";
    }
  );

  soundCache.clear();
}
