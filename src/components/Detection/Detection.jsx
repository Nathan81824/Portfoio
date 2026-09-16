import OfflineDetector from "./Offline/OfflineDetector.jsx";
import Effects from "./Effects/Effects.jsx";
import IdleExperience from "./IdleExpirience/IdleExpirience.jsx";
import Loader from "./Loader/Loader.jsx";

function Detection({ children }) {
  return (
    <OfflineDetector>
      <Loader>
        <Effects />
        <IdleExperience />
        {children}
      </Loader>
    </OfflineDetector>
  );
}

export default Detection;