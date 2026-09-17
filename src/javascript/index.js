/* =====================================================
   API
===================================================== */

export { default as api } from "./api/api.js";


/* =====================================================
   SITE CONFIG
===================================================== */
export { default as siteConfig } from "./constants/siteConfig.js";

/* =====================================================
   CONTACT
===================================================== */

export { default as contact } from "./contact/contact.js";


/* =====================================================
   DATA
===================================================== */

export * from "./data/data.js";
export { default as data } from "./data/data.js";

export { default as dataStorage } from "./data/dataStorage.js";


/* =====================================================
   HOOKS
===================================================== */

export * from "./hooks/hooks.js";
export { default as hooks } from "./hooks/hooks.js";


/* =====================================================
   PROJECTS
===================================================== */

export { default as projects } from "./projects/projects.js";


/* =====================================================
   SKILLS
===================================================== */

export { default as skills } from "./skills/skills.js";

export { default as createSkillsScene } from "./skills/skills.js";


/* =====================================================
   SOUNDS
===================================================== */

export * from "./sounds/sound.js";


/* =====================================================
   SUPABASE
===================================================== */

export {
  supabase,
  getChatClient,
  resetChatClient,
} from "./supabase/supabaseClient.js";


/* =====================================================
   UTILITIES
===================================================== */

export { default as utils } from "./utils/utils.js";

export * from "./utils/utils.js";


/* =====================================================
   PORTFOLIO CHECK
===================================================== */

export {
  default as portfolioCheck,
} from "./utils/portfolioCheck.js";