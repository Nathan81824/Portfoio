import OfflineDetector from "./Offline/OfflineDetector.jsx";
import Effects from "./Effects/Effects.jsx";
import IdleExperience from "./IdleExpirience/IdleExpirience.jsx";

function Detection({ children }) {
return ( 
  <OfflineDetector> 
    <Effects />
  <IdleExperience />
    {children}
  </OfflineDetector>


);
}

export default Detection;
