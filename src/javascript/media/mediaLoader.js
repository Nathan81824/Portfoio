import media from "./media";


const preloadImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = resolve;
    image.onerror = resolve;

    image.src = src;
  });
};

const preloadVideo = (src) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    video.preload = "metadata";

    video.onloadedmetadata = resolve;
    video.onerror = resolve;

    video.src = src;
    video.load();
  });
};



export const preloadMedia = async () => {
  const images = Object.values(media.images);
  const videos = Object.values(media.videos);


  await Promise.all([
    ...images.map(preloadImage),
    ...videos.map(preloadVideo),
    
  ]);

  return true;
};

export default preloadMedia;