/* =========================================================
   JAVASCRIPT
   Nathan — Frontend Developer Portfolio

   CENTRAL JAVASCRIPT ENTRY POINT

   This file provides one clean import point for:

   → API
   → Constants
   → Contact
   → Data
   → Data Storage
   → Hooks
   → Projects
   → Skills
   → Sounds
   → Supabase
   → Utilities
========================================================= */


/* =========================================================
   API
========================================================= */

export {
  default as api,
} from "./api/api.js";


/* =========================================================
   CONSTANTS
========================================================= */

export {
  default as siteConfig,
} from "./constants/SiteConfig.js";


/* =========================================================
   CONTACT
========================================================= */

export {
  default as contact,
} from "./contact/contact.js";


/* =========================================================
   DATA
========================================================= */

export {
  default as data,
} from "./data/data.js";


/* =========================================================
   DATA STORAGE
========================================================= */

export {
  default as dataStorage,
} from "./data/dataStorage.js";


/* =========================================================
   HOOKS
========================================================= */

export {
  default as hooks,
} from "./hooks/hooks.js";


/* =========================================================
   PROJECTS
========================================================= */

export {
  default as projects,
} from "./projects/projects.js";


/* =========================================================
   PROJECT HELPERS
========================================================= */

export {
  fetchProjects,
  getRemoteProjects,
  visibleProjects,
  featuredProjects,
  getProjectById,
  getProjectByName,
  getProjectGitHubUrl,
  getProjectLiveUrl,
  getProjectTechnologies,
  getProjectImage,
  getProjectScreenshotUrl,
  getProjectDeployment,
  getProjectCount,
  searchProjects,
  isProjectVisible,
  sortProjects,
} from "./projects/projects.js";


/* =========================================================
   SKILLS
========================================================= */

export {
  default as skills,
} from "./skills/skills.js";


/* =========================================================
   SKILL HELPERS
========================================================= */

export {
  visibleSkills,
  featuredSkills,
  skillCategories,
  getSkillsByCategory,
  getSkillsByType,
  getSkillById,
  getSkillByName,
  getSkillNames,
  getSkillCount,
  getFeaturedSkillCount,
  getCategoryCount,
} from "./skills/skills.js";


/* =========================================================
   SOUNDS
========================================================= */

export {
  default as sound,
} from "./sounds/sound.js";


/* =========================================================
   SOUND HELPERS
========================================================= */

export {
  SOUND_CONFIG,
  SOUND_FILES,
  playSound,
  playClick,
  playNotification,
  enableSound,
  disableSound,
  toggleSound,
  isSoundEnabled,
  setSoundVolume,
  getSoundVolume,
  preloadSound,
  preloadSounds,
  clearSoundCache,
} from "./sounds/sound.js";


/* =========================================================
   SUPABASE
========================================================= */

export {
  supabase,
  getChatClient,
  resetChatClient,
} from "./supabase/supabaseClient.js";


/* =========================================================
   UTILITIES
========================================================= */

export {
  default as utils,
} from "./utils/utils.js";