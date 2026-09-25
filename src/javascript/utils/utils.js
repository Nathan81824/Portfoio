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
  emojiModule.EMOJIS ??
  emojis.EMOJIS ??
  emojis.emojis ??
  {};

const EMOJI_CATEGORIES =
  emojiModule.EMOJI_CATEGORIES ??
  emojis.EMOJI_CATEGORIES ??
  emojis.categories ??
  {};


/* =========================================================
   SCROLL
========================================================= */

import * as scrollModule from "./scrollToSection.js";

const scroll =
  scrollModule.default || scrollModule;

const scrollToSection =
  scrollModule.scrollToSection ??
  scroll.scrollToSection ??
  (() => {});

const scrollToTop =
  scrollModule.scrollToTop ??
  scroll.scrollToTop ??
  (() => {});

const scrollToBottom =
  scrollModule.scrollToBottom ??
  scroll.scrollToBottom ??
  (() => {});





/* =========================================================
   CENTRAL UTILS OBJECT
========================================================= */

const utils = {
  formaters,
  animations,
  emojis,
  EMOJIS,
  EMOJI_CATEGORIES,
  scroll,
  scrollToSection,
  scrollToTop,
  scrollToBottom,
 
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
  scroll,
  scrollToSection,
  scrollToTop,
  scrollToBottom,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default utils;