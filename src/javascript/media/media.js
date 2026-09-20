/* =========================================================
   MEDIA
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/media/media.js

   Stores:
   - Website images
   - Website videos
   - Project images
   - Project videos
   - Avatar media
   - Background media
========================================================= */


/* =========================================================
   IMAGES
========================================================= */

import logo from "../../../public/logo.png";

import myImage from "../../assets/images/my-image.jpg";

import aboutImage from "../../assets/images/about-image.png";

import avatar from "../../assets/images/avatar.jpg";


/* =========================================================
   VIDEOS
========================================================= */

import heroBackground from "../../assets/videos/hero-background.mp4";

import avatarVideo from "../../assets/videos/avatar-viedio.mp4";

import offlineAvatarVideo from "../../assets/videos/oflline-avatar-viedio.mp4";

import myImageVideo from "../../assets/videos/my-image-viedio.mp4";


/* =========================================================
   MEDIA
========================================================= */

const media = {

  /* =======================================================
     IMAGES
  ======================================================= */

  images: {

    logo,

    myImage,

    aboutImage,

    avatar,

  },


  /* =======================================================
     VIDEOS
  ======================================================= */

  videos: {

    heroBackground,

    avatarVideo,

    offlineAvatarVideo,

    myImageVideo,

  },

};


/* =========================================================
   EXPORT
========================================================= */

export default media;