/* =========================================================
   CENTRAL UTILITIES
   ========================================================= */

/* =========================================================
   FORMATERS
   ========================================================= */

import * as formatersModule from "./formaters.js";

const formaters =
  formatersModule.default || formatersModule;


/* =========================================================
   ANIMATIONS
   ========================================================= */

import * as animationsModule from "./animations.js";

const animations =
  animationsModule.default || animationsModule;


/* =========================================================
   EMOJIS
   ========================================================= */

import * as emojiModule from "./emojis/emojis.js";

const emojis =
  emojiModule.default || emojiModule;

const EMOJIS =
  emojiModule.EMOJIS ||
  emojis.EMOJIS ||
  emojis.emojis ||
  {};

const EMOJI_CATEGORIES =
  emojiModule.EMOJI_CATEGORIES ||
  emojis.EMOJI_CATEGORIES ||
  emojis.categories ||
  {};

const getEmojis =
  emojiModule.getEmojis ||
  emojis.getEmojis ||
  (() => []);

const getEmojiCategories =
  emojiModule.getEmojiCategories ||
  emojis.getEmojiCategories ||
  (() => []);

const searchEmojis =
  emojiModule.searchEmojis ||
  emojis.searchEmojis ||
  (() => []);

const findEmoji =
  emojiModule.findEmoji ||
  emojis.findEmoji ||
  (() => null);

const getRandomEmoji =
  emojiModule.getRandomEmoji ||
  emojis.getRandomEmoji ||
  (() => null);


/* =========================================================
   SCROLL
   ========================================================= */

import * as scrollModule from "./scrollToSection.js";

const scroll =
  scrollModule.default || scrollModule;

const scrollToSection =
  scrollModule.scrollToSection ||
  scroll.scrollToSection ||
  (() => {});

const scrollToTop =
  scrollModule.scrollToTop ||
  scroll.scrollToTop ||
  (() => {});

const scrollToBottom =
  scrollModule.scrollToBottom ||
  scroll.scrollToBottom ||
  (() => {});


/* =========================================================
   SOUND
   ========================================================= */

import * as soundModule from "../sounds/sound.js";

const sound =
  soundModule.default || soundModule;


/* =========================================================
   CENTRAL UTILS OBJECT
   ========================================================= */

const utils = {
  /* -------------------------
     Formaters
     ------------------------- */

  formaters,

  /* -------------------------
     Animations
     ------------------------- */

  animations,

  /* -------------------------
     Emojis
     ------------------------- */

  emojis,

  EMOJIS,
  EMOJI_CATEGORIES,

  getEmojis,
  getEmojiCategories,
  searchEmojis,
  findEmoji,
  getRandomEmoji,

  /* -------------------------
     Scroll
     ------------------------- */

  scroll,

  scrollToSection,
  scrollToTop,
  scrollToBottom,

  /* -------------------------
     Sound
     ------------------------- */

  sound,
};


/* =========================================================
   NAMED EXPORTS
   ========================================================= */

export {
  formaters,
  animations,

  emojis,
  EMOJIS,
  EMOJI_CATEGORIES,

  getEmojis,
  getEmojiCategories,
  searchEmojis,
  findEmoji,
  getRandomEmoji,

  scroll,
  scrollToSection,
  scrollToTop,
  scrollToBottom,

  sound,
};


/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default utils;