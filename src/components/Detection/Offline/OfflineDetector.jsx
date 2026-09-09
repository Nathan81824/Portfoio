import { useEffect, useState } from "react";
import OflinePage from "../../../pages/Offline/OflinePage";

export default function OfflineDetector({ children }) {
const [isOffline, setIsOffline] = useState(!navigator.onLine);

useEffect(() => {
const handleOnline = () => {
setIsOffline(false);
};

const handleOffline = () => {
  setIsOffline(true);
};

window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);

return () => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
};

}, []);

if (isOffline) {
return <OflinePage />;
}

return children;
}

