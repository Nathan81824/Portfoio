import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";



function PageTransition({ children }) {
const location = useLocation();

return ( <AnimatePresence mode="wait"> <div className="page-transition" key={location.pathname}>


    {/* =====================================================
        PAGE CONTENT
    ===================================================== */}

    <motion.div
      className="page-transition-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>

    {/* =====================================================
        BLACK TRANSITION OVERLAY
    ===================================================== */}

    <motion.div
      className="page-transition-overlay"
      initial={{
        y: "100%",
      }}
      animate={{
        y: "-100%",
      }}
      exit={{
        y: "0%",
      }}
      transition={{
        duration: 0.9,
        ease: [0.79, 0, 0.24, 1],
      }}
    />

  </div>
</AnimatePresence>

);
}

export default PageTransition;
