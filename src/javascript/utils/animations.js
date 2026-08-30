/* =========================================================
   FRAMER MOTION ANIMATIONS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/animations.js

   PURPOSE
   ---------------------------------------------------------
   Reusable Framer Motion animation presets.

   CSS animations belong in:
   animation.css

   Framer Motion animations belong here.
========================================================= */


/* =========================================================
   FADE IN
========================================================= */

export const fadeIn = {

  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  transition: {
    duration: 0.6,
    ease: "easeOut",
  },

};


/* =========================================================
   SLIDE UP
========================================================= */

export const slideUp = {

  initial: {
    opacity: 0,
    y: 25,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.6,
    ease: "easeOut",
  },

};


/* =========================================================
   SLIDE DOWN
========================================================= */

export const slideDown = {

  initial: {
    opacity: 0,
    y: -25,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.6,
    ease: "easeOut",
  },

};


/* =========================================================
   SLIDE LEFT
========================================================= */

export const slideLeft = {

  initial: {
    opacity: 0,
    x: 30,
  },

  animate: {
    opacity: 1,
    x: 0,
  },

  transition: {
    duration: 0.6,
    ease: "easeOut",
  },

};


/* =========================================================
   SLIDE RIGHT
========================================================= */

export const slideRight = {

  initial: {
    opacity: 0,
    x: -30,
  },

  animate: {
    opacity: 1,
    x: 0,
  },

  transition: {
    duration: 0.6,
    ease: "easeOut",
  },

};


/* =========================================================
   SCALE UP
========================================================= */

export const scaleUp = {

  initial: {
    opacity: 0,
    scale: 0.92,
  },

  animate: {
    opacity: 1,
    scale: 1,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   SCALE DOWN
========================================================= */

export const scaleDown = {

  initial: {
    opacity: 0,
    scale: 1.08,
  },

  animate: {
    opacity: 1,
    scale: 1,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   STAGGER ITEM
   Used for:
   - Rotating roles
   - Lists
   - Cards
   - Navigation items
========================================================= */

export const staggerItem = {

  initial: {
    opacity: 0,
    y: 12,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -12,
  },

  transition: {
    duration: 0.4,
    ease: "easeOut",
  },

};


/* =========================================================
   FADE LEFT + SCALE
========================================================= */

export const fadeLeftScale = {

  initial: {
    opacity: 0,
    x: -30,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   FADE RIGHT + SCALE
========================================================= */

export const fadeRightScale = {

  initial: {
    opacity: 0,
    x: 30,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   HERO CONTENT
========================================================= */

export const heroContent = {

  initial: {
    opacity: 0,
    y: 30,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.8,
    ease: "easeOut",
  },

};


/* =========================================================
   HERO ITEM
========================================================= */

export const heroItem = {

  initial: {
    opacity: 0,
    y: 20,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   CARD
========================================================= */

export const cardAnimation = {

  initial: {
    opacity: 0,
    y: 25,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  transition: {
    duration: 0.7,
    ease: "easeOut",
  },

};


/* =========================================================
   VIEWPORT ANIMATION
========================================================= */

export const viewportAnimation = {

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    amount: 0.2,
  },

};


/* =========================================================
   HOVER LIFT
========================================================= */

export const hoverLift = {

  whileHover: {
    y: -5,
  },

  transition: {
    duration: 0.25,
    ease: "easeOut",
  },

};


/* =========================================================
   HOVER SCALE
========================================================= */

export const hoverScale = {

  whileHover: {
    scale: 1.04,
  },

  transition: {
    duration: 0.25,
    ease: "easeOut",
  },

};


/* =========================================================
   BUTTON HOVER
========================================================= */

export const buttonHover = {

  whileHover: {
    y: -3,
    scale: 1.02,
  },

  whileTap: {
    scale: 0.97,
  },

  transition: {
    duration: 0.2,
    ease: "easeOut",
  },

};


/* =========================================================
   MOBILE MENU
========================================================= */

export const mobileMenu = {

  initial: {
    opacity: 0,
    x: 30,
  },

  animate: {
    opacity: 1,
    x: 0,
  },

  exit: {
    opacity: 0,
    x: 30,
  },

  transition: {
    duration: 0.35,
    ease: "easeOut",
  },

};


/* =========================================================
   MOBILE MENU ITEM
========================================================= */

export const mobileMenuItem = (index = 0) => ({

  initial: {
    opacity: 0,
    x: 20,
  },

  animate: {
    opacity: 1,
    x: 0,
  },

  transition: {
    duration: 0.35,
    delay: index * 0.06,
    ease: "easeOut",
  },

});


/* =========================================================
   ROTATE
========================================================= */

export const rotate = {

  animate: {
    rotate: 360,
  },

  transition: {
    duration: 12,
    repeat: Infinity,
    ease: "linear",
  },

};


/* =========================================================
   FLOAT
========================================================= */

export const float = {

  animate: {
    y: [0, -8, 0],
  },

  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },

};


/* =========================================================
   PULSE
========================================================= */

export const pulse = {

  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
  },

  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },

};


/* =========================================================
   STATUS DOT
========================================================= */

export const statusDot = {

  animate: {
    scale: [0.85, 1.15, 0.85],
    opacity: [0.5, 1, 0.5],
  },

  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

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

};