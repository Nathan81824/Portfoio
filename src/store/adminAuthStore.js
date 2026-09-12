import { create } from "zustand";

const useAdminAuthStore = create((set) => ({
admin: null,
isAuthenticated: false,
isLoading: true,

setAdmin: (admin) =>
set({
admin,
isAuthenticated: !!admin,
isLoading: false,
}),

login: (admin) =>
set({
admin,
isAuthenticated: true,
isLoading: false,
}),

logout: () =>
set({
admin: null,
isAuthenticated: false,
isLoading: false,
}),

setLoading: (isLoading) =>
set({
isLoading,
}),
}));

export default useAdminAuthStore;
