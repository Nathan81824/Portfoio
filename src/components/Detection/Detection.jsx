import OfflineDetector from "./Offline/OfflineDetector.jsx";
import Effects from "./Effects/Effects.jsx";

function Detection({ children }) {
return ( 
<OfflineDetector> 
  <Effects />

  {children}
</OfflineDetector>

);
}

export default Detection;
