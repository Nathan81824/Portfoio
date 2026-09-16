export const publicRoutes = [
  "/",
  "/about",
  "/skills",
  "/projects",
  "/contact",
];

export const adminRoutes = [
  "/admin",
  "/admin/chat",
];

export const isAdminRoute = (pathname) => {
  return adminRoutes.includes(pathname);
};

export const isPublicRoute = (pathname) => {
  return publicRoutes.includes(pathname);
};

export const isAdminLoginRoute = (pathname) => {
  return pathname === "/admin/login";
};