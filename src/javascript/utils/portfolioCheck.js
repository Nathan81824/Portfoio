import { supabase } from "../supabase/supabaseClient";

import myImage from "../../assets/images/my-image.jpg";
import avatarImage from "../../assets/images/avatar.jpg";
import avatarVideo from "../../assets/videos/avater-viedio.mp4";

import useAnimationStore from "../../store/animationStore.js";
import { getData } from "../data/data.js";

/* =====================================================
REQUIRED MEDIA
===================================================== */

const requiredImages = [
{
name: "Logo",
src: "/logo.png",
},
{
name: "My image",
src: myImage,
},
{
name: "Avatar",
src: avatarImage,
},
];

const requiredVideos = [
{
name: "Avatar video",
src: avatarVideo,
},
];

/* =====================================================
CHECK APP
===================================================== */

function checkApp() {
try {


/*
  If this file is running, App.js has already
  successfully loaded the React application.

  We verify that the browser has a React root.
*/

const root =
  document.getElementById("root");


if (!root) {

  return {
    success: false,
    type: "app",
    error: "React root element was not found.",
  };

}


return {
  success: true,
  type: "app",
  message: "App.js loaded successfully.",
};


} catch (error) {


return {
  success: false,
  type: "app",
  error:
    error?.message ||
    "App check failed.",
};


}
}

/* =====================================================
CHECK ANIMATION STORE
===================================================== */

function checkAnimationStore() {
try {


if (!useAnimationStore) {

  return {
    success: false,
    type: "animation",
    error: "Animation store could not be loaded.",
  };

}


const state =
  useAnimationStore.getState();


if (!state) {

  return {
    success: false,
    type: "animation",
    error: "Animation store state is unavailable.",
  };

}


if (
  typeof state.setProgress !== "function"
) {

  return {
    success: false,
    type: "animation",
    error: "Animation store setProgress is missing.",
  };

}


if (
  typeof state.finishLoading !== "function"
) {

  return {
    success: false,
    type: "animation",
    error: "Animation store finishLoading is missing.",
  };

}


return {
  success: true,
  type: "animation",
  message: "Animation store is ready.",
};


} catch (error) {


return {
  success: false,
  type: "animation",
  error:
    error?.message ||
    "Animation store check failed.",
};


}
}

/* =====================================================
CHECK PORTFOLIO DATA
===================================================== */

function checkPortfolioData() {
try {


if (
  typeof getData !== "function"
) {

  return {
    success: false,
    type: "data",
    error: "getData function is unavailable.",
  };

}


const data = getData();


if (!data) {

  return {
    success: false,
    type: "data",
    error: "Portfolio data returned nothing.",
  };

}


return {
  success: true,
  type: "data",
  message: "Portfolio data loaded successfully.",
};


} catch (error) {


return {
  success: false,
  type: "data",
  error:
    error?.message ||
    "Portfolio data failed to load.",
};


}
}

/* =====================================================
CHECK DATA STORAGE
===================================================== */

function checkDataStorage() {
try {


const testKey =
  "__portfolio_storage_test__";


const testValue =
  "portfolio-storage-working";


localStorage.setItem(
  testKey,
  testValue
);


const storedValue =
  localStorage.getItem(
    testKey
  );


localStorage.removeItem(
  testKey
);


if (
  storedValue !== testValue
) {

  return {
    success: false,
    type: "storage",
    error: "Data storage test failed.",
  };

}


return {
  success: true,
  type: "storage",
  message: "Data storage is working.",
};


} catch (error) {


return {
  success: false,
  type: "storage",
  error:
    error?.message ||
    "Data storage is unavailable.",
};


}
}

/* =====================================================
CHECK SUPABASE
===================================================== */

async function checkSupabase() {
try {


if (!supabase) {

  return {
    success: false,
    type: "supabase",
    error: "Supabase client is unavailable.",
  };

}


const {
  error,
} = await supabase.auth.getSession();


if (error) {

  return {
    success: false,
    type: "supabase",
    error: error.message,
  };

}


return {
  success: true,
  type: "supabase",
  message: "Supabase is connected.",
};


} catch (error) {


return {
  success: false,
  type: "supabase",
  error:
    error?.message ||
    "Supabase connection failed.",
};


}
}

/* =====================================================
CHECK IMAGE
===================================================== */

function checkImage(image) {
return new Promise((resolve) => {


const img =
  new Image();


const cleanup = () => {

  img.onload = null;
  img.onerror = null;

};


img.onload = () => {

  cleanup();


  resolve({
    success: true,
    type: "image",
    name: image.name,
    src: image.src,
    message:
      `${image.name} loaded successfully.`,
  });

};


img.onerror = () => {

  cleanup();


  resolve({
    success: false,
    type: "image",
    name: image.name,
    src: image.src,
    error:
      `${image.name} failed to load.`,
  });

};


img.src =
  image.src;


});
}

/* =====================================================
CHECK VIDEO
===================================================== */

function checkVideo(videoSource) {
return new Promise((resolve) => {


const video =
  document.createElement(
    "video"
  );


let finished = false;


const cleanup = () => {

  video.removeEventListener(
    "loadedmetadata",
    handleSuccess
  );

  video.removeEventListener(
    "error",
    handleError
  );

};


const finish = (result) => {

  if (finished) {
    return;
  }


  finished = true;


  cleanup();


  resolve(result);

};


const handleSuccess = () => {

  finish({
    success: true,
    type: "video",
    name: videoSource.name,
    src: videoSource.src,
    message:
      `${videoSource.name} loaded successfully.`,
  });

};


const handleError = () => {

  finish({
    success: false,
    type: "video",
    name: videoSource.name,
    src: videoSource.src,
    error:
      `${videoSource.name} failed to load.`,
  });

};


video.preload =
  "metadata";


video.addEventListener(
  "loadedmetadata",
  handleSuccess
);


video.addEventListener(
  "error",
  handleError
);


video.src =
  videoSource.src;


video.load();


window.setTimeout(() => {

  if (!finished) {

    finish({
      success: false,
      type: "video",
      name: videoSource.name,
      src: videoSource.src,
      error:
        `${videoSource.name} timed out while loading.`,
    });

  }

}, 10000);


});
}

/* =====================================================
MAIN PORTFOLIO CHECK
===================================================== */

async function portfolioCheck({
onProgress,
onStatus,
} = {}) {

const results = [];

const update = (
progress,
status
) => {


if (
  typeof onProgress ===
  "function"
) {

  onProgress(progress);

}


if (
  typeof onStatus ===
  "function"
) {

  onStatus(status);

}


};

/* ---------------------------------------------
1. APP
--------------------------------------------- */

update(
5,
"Checking application..."
);

const appResult =
checkApp();

results.push(
appResult
);

/* ---------------------------------------------
2. ANIMATION STORE
--------------------------------------------- */

update(
15,
"Checking animation system..."
);

const animationResult =
checkAnimationStore();

results.push(
animationResult
);

/* ---------------------------------------------
3. PORTFOLIO DATA
--------------------------------------------- */

update(
25,
"Loading portfolio data..."
);

const dataResult =
checkPortfolioData();

results.push(
dataResult
);

/* ---------------------------------------------
4. DATA STORAGE
--------------------------------------------- */

update(
35,
"Checking data storage..."
);

const storageResult =
checkDataStorage();

results.push(
storageResult
);

/* ---------------------------------------------
5. SUPABASE
--------------------------------------------- */

update(
50,
"Connecting to Supabase..."
);

const supabaseResult =
await checkSupabase();

results.push(
supabaseResult
);

/* ---------------------------------------------
6. IMAGES
--------------------------------------------- */

update(
65,
"Loading portfolio images..."
);

const imageResults =
await Promise.all(
requiredImages.map(
checkImage
)
);

results.push(
...imageResults
);

/* ---------------------------------------------
7. VIDEOS
--------------------------------------------- */

update(
80,
"Loading portfolio videos..."
);

const videoResults =
await Promise.all(
requiredVideos.map(
checkVideo
)
);

results.push(
...videoResults
);

/* ---------------------------------------------
8. FINAL CHECK
--------------------------------------------- */

update(
95,
"Finalizing portfolio..."
);

const failedChecks =
results.filter(
(result) =>
result.success === false
);

/* ---------------------------------------------
DEBUG
--------------------------------------------- */

console.log(
"===================================="
);

console.log(
"PORTFOLIO STARTUP CHECK"
);

console.log(
"===================================="
);

results.forEach(
(result) => {


  console.log(
    result.success
      ? "✓"
      : "✕",
    result.type,
    result.name || "",
    result.error || result.message || ""
  );

}


);

console.log(
"===================================="
);

/* ---------------------------------------------
SUCCESS
--------------------------------------------- */

if (
failedChecks.length === 0
) {


update(
  100,
  "Portfolio ready"
);


} else {


update(
  100,
  "Portfolio startup failed"
);


console.error(
  "Failed portfolio checks:",
  failedChecks
);


}

return {


success:
  failedChecks.length === 0,

results,

failedChecks,


};

}

export default portfolioCheck;
