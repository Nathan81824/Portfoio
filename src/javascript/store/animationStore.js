import { create } from "zustand";

const useAnimationStore = create((set) => ({
isLoading: true,
progress: 0,
isReady: false,
status: "Starting portfolio...",

setProgress: (progress) =>
set({
progress,
}),

setStatus: (status) =>
set({
status,
}),

setLoading: (isLoading) =>
set({
isLoading,
}),

setReady: (isReady) =>
set({
isReady,
}),

finishLoading: () =>
set({
progress: 100,
status: "Portfolio ready",
isLoading: false,
isReady: true,
}),
}));

export default useAnimationStore;
