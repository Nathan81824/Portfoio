import { fetchGitHubProjects } from "./github.js";

const PROJECT_CONFIG = {
onlyGitHubPages: true,
exclude: ["Portfoio"],
maxProjects: 20,
};

let cachedProjects = [];
let projectsPromise = null;
let hasLoaded = false;

function normalizeProject(project) {
if (!project) {
return null;
}

const name =
project.name ||
project.title ||
"Untitled Project";

const title =
project.title ||
name
.replace(/[-_]+/g, " ")
.replace(/\b\w/g, (letter) =>
letter.toUpperCase()
);

const githubUrl =
project.githubUrl ||
project.html_url ||
project.repository?.html_url ||
"";

const liveUrl =
project.liveUrl ||
project.pagesUrl ||
project.homepage ||
"";

const description =
project.description ||
"A frontend project built with modern web technologies.";

const technologies =
Array.isArray(project.technologies)
? project.technologies
: [];

return {
...project,


id:
  project.id ||
  project.node_id ||
  name,

name,

title,

description,

githubUrl,

liveUrl,

pagesUrl:
  project.pagesUrl ||
  liveUrl,

technologies,

screenshotUrl:
  project.screenshotUrl ||
  project.image ||
  project.thumbnail ||
  getAutomaticScreenshotUrl(
    liveUrl
  ),

visible:
  project.visible !== false,

featured:
  project.featured === true,

source: "github",


};
}

function isGitHubPagesProject(project) {
if (!project) {
return false;
}

const liveUrl =
project.liveUrl ||
project.pagesUrl ||
project.homepage ||
"";

return (
typeof liveUrl === "string" &&
liveUrl.includes("github.io")
);
}

function isExcludedProject(project) {
if (!project) {
return true;
}

const projectName = (
project.name ||
project.title ||
""
).toLowerCase();

return PROJECT_CONFIG.exclude.some(
(excludedName) =>
projectName ===
excludedName.toLowerCase()
);
}

function getAutomaticScreenshotUrl(
liveUrl
) {
if (!liveUrl) {
return "";
}

return (
"https://image.thum.io/get/" +
"width/1400/" +
"crop/900/" +
"noanimate/" +
liveUrl
);
}

function processProjects(projects) {
if (!Array.isArray(projects)) {
return [];
}

return projects
.map(normalizeProject)
.filter(Boolean)
.filter(
(project) =>
!isExcludedProject(project)
)
.filter((project) => {
if (
!PROJECT_CONFIG.onlyGitHubPages
) {
return true;
}


  return isGitHubPagesProject(project);
})
.filter(
  (project) =>
    project.visible !== false
)
.slice(
  0,
  PROJECT_CONFIG.maxProjects
);


}

async function loadProjectsInBackground() {
if (projectsPromise) {
return projectsPromise;
}

projectsPromise = (async () => {
try {
const result =
await fetchGitHubProjects();


  const processed =
    processProjects(result);

  cachedProjects = processed;
  hasLoaded = true;

  return cachedProjects;
} catch (error) {
  console.error(
    "Background project loading failed:",
    error
  );

  hasLoaded = true;

  return cachedProjects;
}


})();

return projectsPromise;
}

export const projects = cachedProjects;

export async function fetchProjects() {
if (hasLoaded) {
return cachedProjects;
}

return loadProjectsInBackground();
}

export function getProjects() {
return cachedProjects;
}

export function getRemoteProjects() {
return cachedProjects;
}

export function getVisibleProjects() {
return cachedProjects.filter(
(project) =>
project.visible !== false
);
}

export function getFeaturedProjects() {
return cachedProjects.filter(
(project) =>
project.featured === true
);
}

export function getProjectById(id) {
return cachedProjects.find(
(project) =>
project.id === id
);
}

export function getProjectByName(name) {
if (!name) {
return undefined;
}

return cachedProjects.find(
(project) =>
project.name?.toLowerCase() ===
name.toLowerCase()
);
}

export function getProjectGitHubUrl(
project
) {
return (
project?.githubUrl ||
""
);
}

export function getProjectLiveUrl(
project
) {
return (
project?.liveUrl ||
""
);
}

export function getProjectTechnologies(
project
) {
return Array.isArray(
project?.technologies
)
? project.technologies
: [];
}

export function getProjectImage(
project
) {
return (
project?.screenshotUrl ||
project?.image ||
project?.thumbnail ||
""
);
}

export function getProjectScreenshot(
project
) {
return (
project?.screenshotUrl ||
""
);
}

export function getProjectDeployment(
project
) {
return (
project?.pagesUrl ||
project?.liveUrl ||
""
);
}

export function getProjectCount() {
return cachedProjects.length;
}

export function searchProjects(query) {
if (!query) {
return cachedProjects;
}

const search =
query.toLowerCase();

return cachedProjects.filter(
(project) => {
const title =
project.title?.toLowerCase() ||
"";


  const description =
    project.description?.toLowerCase() ||
    "";

  const technologies =
    project.technologies
      ?.join(" ")
      .toLowerCase() ||
    "";

  return (
    title.includes(search) ||
    description.includes(search) ||
    technologies.includes(search)
  );
}


);
}

export function isProjectVisible(
project
) {
return (
project?.visible !== false
);
}

export function sortProjects(
projectsToSort = cachedProjects
) {
return [...projectsToSort].sort(
(a, b) => {
if (
a.featured &&
!b.featured
) {
return -1;
}


  if (
    !a.featured &&
    b.featured
  ) {
    return 1;
  }

  return (
    a.title || ""
  ).localeCompare(
    b.title || ""
  );
}


);
}

export function startProjectLoading() {
loadProjectsInBackground();
}

export default {
projects,
fetchProjects,
getProjects,
getRemoteProjects,
getVisibleProjects,
getFeaturedProjects,
getProjectById,
getProjectByName,
getProjectGitHubUrl,
getProjectLiveUrl,
getProjectTechnologies,
getProjectImage,
getProjectScreenshot,
getProjectDeployment,
getProjectCount,
searchProjects,
isProjectVisible,
sortProjects,
startProjectLoading,
};

startProjectLoading();
