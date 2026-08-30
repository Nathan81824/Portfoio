/* =========================================================
   NAVIGATION DATA
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/navigation/navigation.js

   PURPOSE
   ---------------------------------------------------------
   Central navigation data used by:

   - Desktop Navbar
   - Mobile Navbar
   - Footer
   - React Router navigation
========================================================= */


/* =========================================================
   MAIN NAVIGATION
========================================================= */

export const navigation = [

  /* =======================================================
     HOME
  ======================================================= */

  {
    id: "home",

    name: "Home",

    label: "Home",

    href: "/",

    path: "/",

    type: "page",

    external: false,

    order: 1,

    show: true,

    desktop: true,

    mobile: true,
  },


  /* =======================================================
     ABOUT
  ======================================================= */

  {
    id: "about",

    name: "About",

    label: "About",

    href: "/about",

    path: "/about",

    type: "page",

    external: false,

    order: 2,

    show: true,

    desktop: true,

    mobile: true,
  },


  /* =======================================================
     SKILLS
  ======================================================= */

  {
    id: "skills",

    name: "Skills",

    label: "Skills",

    href: "/skills",

    path: "/skills",

    type: "page",

    external: false,

    order: 3,

    show: true,

    desktop: true,

    mobile: true,
  },


  /* =======================================================
     PROJECTS
  ======================================================= */

  {
    id: "projects",

    name: "Projects",

    label: "Projects",

    href: "/projects",

    path: "/projects",

    type: "page",

    external: false,

    order: 4,

    show: true,

    desktop: true,

    mobile: true,
  },


  /* =======================================================
     CONTACT
  ======================================================= */

  {
    id: "contact",

    name: "Contact",

    label: "Contact",

    href: "/contact",

    path: "/contact",

    type: "page",

    external: false,

    order: 5,

    show: true,

    desktop: true,

    mobile: true,
  },

];


/* =========================================================
   VISIBLE NAVIGATION
========================================================= */

export const visibleNavigation =
  navigation
    .filter(
      (item) =>
        item &&
        item.show !== false
    )
    .sort(
      (a, b) =>
        a.order - b.order
    );


/* =========================================================
   DESKTOP NAVIGATION
========================================================= */

export const desktopNavigation =
  visibleNavigation.filter(
    (item) =>
      item.desktop !== false
  );


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

export const mobileNavigation =
  visibleNavigation.filter(
    (item) =>
      item.mobile !== false
  );


/* =========================================================
   FIND BY ID
========================================================= */

export function getNavigationItem(id) {

  return navigation.find(
    (item) =>
      item.id === id
  );

}


/* =========================================================
   FIND BY PATH
========================================================= */

export function getNavigationByPath(path) {

  return navigation.find(
    (item) =>
      item.path === path
  );

}


/* =========================================================
   FIND BY NAME
========================================================= */

export function getNavigationByName(name) {

  if (
    !name ||
    typeof name !== "string"
  ) {

    return undefined;

  }


  return navigation.find(
    (item) =>
      item.name.toLowerCase() ===
      name.toLowerCase()
  );

}


/* =========================================================
   GET HREF
========================================================= */

export function getNavigationHref(item) {

  if (
    !item ||
    typeof item !== "object"
  ) {

    return "/";

  }


  return (
    item.href ||
    item.path ||
    "/"
  );

}


/* =========================================================
   GET NAVIGATION BY TYPE
========================================================= */

export function getNavigationByType(type) {

  return visibleNavigation.filter(
    (item) =>
      item.type === type
  );

}


/* =========================================================
   GET PAGE NAVIGATION
========================================================= */

export function getPageNavigation() {

  return visibleNavigation.filter(
    (item) =>
      item.type === "page"
  );

}


/* =========================================================
   GET SECTION NAVIGATION
   Useful later if you add sections inside
   a specific page.
========================================================= */

export function getSectionNavigation() {

  return visibleNavigation.filter(
    (item) =>
      item.type === "section"
  );

}


/* =========================================================
   GET DESKTOP LINKS
========================================================= */

export function getDesktopNavigation() {

  return desktopNavigation;

}


/* =========================================================
   GET MOBILE LINKS
========================================================= */

export function getMobileNavigation() {

  return mobileNavigation;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default navigation;