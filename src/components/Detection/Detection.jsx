import OfflineDetector from "./Offline/OfflineDetector.jsx";
import Effects from "./Effects/Effects.jsx";
import IdleExperience from "./IdleExpirience/IdleExpirience.jsx";
import Loader from "./Loader/Loader.jsx";

function Detection({ children }) {
  return (
    <Loader>
      <OfflineDetector>
        <Effects />
        <IdleExperience />

        {children}
      </OfflineDetector>
    </Loader>
  );
}

export default Detection;