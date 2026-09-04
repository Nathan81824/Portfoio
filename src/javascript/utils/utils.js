/* =========================================================
   UTILITIES
   Nathan — Frontend Developer Portfolio

   Central utility provider.

   Utilities:
   → formaters.js
   → animations.js
   → emoji/emojis.js
   → scrollToSection.js
   → sound.js
========================================================= */


/* =========================================================
   FORMATERS
========================================================= */

import formaters, {
  capitalize,
  capitalizeWords,
  formatName,
  formatDisplayName,
  formatRole,
  formatRoles,
  formatTitle,
  formatLabel,
  formatSkillName,
  formatProjectName,
  formatDescription,
  truncateText,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  createSlug,
  formatUrl,
  formatRepositoryName,
  formatLanguage,
  formatTechnologies,
  formatArray,
  formatBoolean,
} from "./formaters.js";


/* =========================================================
   ANIMATIONS
========================================================= */

import animations, {
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleUp,
  scaleDown,
  staggerItem,
  fadeLeftScale,
  fadeRightScale,
  heroContent,
  heroItem,
  cardAnimation,
  viewportAnimation,
  hoverLift,
  hoverScale,
  buttonHover,
  mobileMenu,
  mobileMenuItem,
  rotate,
  float,
  pulse,
  statusDot,
} from "./animations.js";


/* =========================================================
   EMOJIS
========================================================= */

import emojis, {
  EMOJIS,
  EMOJI_CATEGORIES,
  getEmojis,
  getEmojiCategories,
  searchEmojis,
  findEmoji,
  getRandomEmoji,
} from "./emoji/emojis.js";


/* =========================================================
   SCROLL
========================================================= */

import scroll, {
  scrollToSection,
  scrollToTop,
  scrollToBottom,
  sectionExists,
  getSectionPosition,
  scrollToSectionWithOffset,
  scrollToElement,
  handleScrollClick,
  createScrollHandler,
} from "./scrollToSection.js";


/* =========================================================
   SOUND
========================================================= */

import sound from "./sound.js";


/* =========================================================
   UTILITIES OBJECT
========================================================= */

const utils = {

  /* =======================================================
     FORMATERS
  ======================================================= */

  formaters,

  capitalize,
  capitalizeWords,
  formatName,
  formatDisplayName,
  formatRole,
  formatRoles,
  formatTitle,
  formatLabel,
  formatSkillName,
  formatProjectName,
  formatDescription,
  truncateText,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  createSlug,
  formatUrl,
  formatRepositoryName,
  formatLanguage,
  formatTechnologies,
  formatArray,
  formatBoolean,


  /* =======================================================
     ANIMATIONS
  ======================================================= */

  animations,

  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleUp,
  scaleDown,
  staggerItem,
  fadeLeftScale,
  fadeRightScale,
  heroContent,
  heroItem,
  cardAnimation,
  viewportAnimation,
  hoverLift,
  hoverScale,
  buttonHover,
  mobileMenu,
  mobileMenuItem,
  rotate,
  float,
  pulse,
  statusDot,


  /* =======================================================
     EMOJIS
  ======================================================= */

  emojis,

  EMOJIS,
  EMOJI_CATEGORIES,
  getEmojis,
  getEmojiCategories,
  searchEmojis,
  findEmoji,
  getRandomEmoji,


  /* =======================================================
     SCROLL
  ======================================================= */

  scroll,

  scrollToSection,
  scrollToTop,
  scrollToBottom,
  sectionExists,
  getSectionPosition,
  scrollToSectionWithOffset,
  scrollToElement,
  handleScrollClick,
  createScrollHandler,


  /* =======================================================
     SOUND
  ======================================================= */

  sound,

};


/* =========================================================
   NAMED EXPORTS
========================================================= */

export {

  /* Formaters */

  formaters,

  capitalize,
  capitalizeWords,
  formatName,
  formatDisplayName,
  formatRole,
  formatRoles,
  formatTitle,
  formatLabel,
  formatSkillName,
  formatProjectName,
  formatDescription,
  truncateText,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  createSlug,
  formatUrl,
  formatRepositoryName,
  formatLanguage,
  formatTechnologies,
  formatArray,
  formatBoolean,


  /* Animations */

  animations,

  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleUp,
  scaleDown,
  staggerItem,
  fadeLeftScale,
  fadeRightScale,
  heroContent,
  heroItem,
  cardAnimation,
  viewportAnimation,
  hoverLift,
  hoverScale,
  buttonHover,
  mobileMenu,
  mobileMenuItem,
  rotate,
  float,
  pulse,
  statusDot,


  /* Emojis */

  emojis,

  EMOJIS,
  EMOJI_CATEGORIES,
  getEmojis,
  getEmojiCategories,
  searchEmojis,
  findEmoji,
  getRandomEmoji,


  /* Scroll */

  scroll,

  scrollToSection,
  scrollToTop,
  scrollToBottom,
  sectionExists,
  getSectionPosition,
  scrollToSectionWithOffset,
  scrollToElement,
  handleScrollClick,
  createScrollHandler,


  /* Sound */

  sound,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default utils;