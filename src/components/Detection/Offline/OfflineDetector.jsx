import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


// import OflinePage from "../../../pages/Offline/OflinePage.jsx";
import OfflineGame from "../../../components/Detection/Offline/OfflineGame/OflineGame.jsx";
import App from "../../../App.jsx";

export default function OfflineDetector({ children }) {
  const location = useLocation();

  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine;
  });

  const [wasInGame, setWasInGame] = useState(() => {
    return location.pathname === "/offline-game";
  });

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

  useEffect(() => {
    if (location.pathname === "/offline-game") {
      setWasInGame(true);
    }
  }, [location.pathname]);

  const isGamePage = location.pathname === "/offline-game";

  /*
    If the user is already inside the game,
    NEVER replace the game just because the
    network connection changed.
  */
  if (isGamePage) {
    return <OfflineGame />;
  }

  /*
    Normal offline behavior.
  */
  if (isOffline && !wasInGame) {
    return <App />;
  }

  return children;
}