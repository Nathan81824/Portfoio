/* =========================================================
   DATA
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/data/data.js

   PURPOSE
   ---------------------------------------------------------
   Central data provider for the entire website.

   Components import website data through getData().

   RAW DATA
   ---------------------------------------------------------
   personal/
   navigation/
   siteText/

   SYSTEMS
   ---------------------------------------------------------
   notification/

   This file combines everything into one data object.
========================================================= */


/* =========================================================
   PERSONAL DATA
========================================================= */

import {
  personalInfo,
  roles,
  profile,
  personalLinks,
} from "./personal/personal.js";


/* =========================================================
   NAVIGATION
========================================================= */

import {
  navigation,
} from "./navigation/navigation.js";




/* =========================================================
   NOTIFICATIONS
========================================================= */

import notifications from "./notification/notification.js";


/* =========================================================
   GET DATA
========================================================= */

export function getData() {

  return {

    /* =====================================================
       PERSONAL
    ===================================================== */

    personalInfo,

    roles,

    profile,

    personalLinks,


    /* =====================================================
       NAVIGATION
    ===================================================== */

    navigation,


    /* =====================================================
       SITE TEXT
    ===================================================== */



    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    notifications,

  };

}


/* =========================================================
   NAMED EXPORTS
========================================================= */

export {
  personalInfo,
  roles,
  profile,
  personalLinks,

  navigation,



  notifications,
};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default getData;