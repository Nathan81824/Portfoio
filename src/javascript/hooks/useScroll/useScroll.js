import { useEffect, useState } from "react";

export default function useScroll() {
  const [scrollY, setScrollY] = useState(
    () => window.scrollY
  );

  const [isScrolled, setIsScrolled] =
    useState(
      () => window.scrollY > 20
    );


  useEffect(() => {

    const handleScroll = () => {

      const currentScroll =
        window.scrollY;

      setScrollY(currentScroll);

      setIsScrolled(
        currentScroll > 20
      );
    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    handleScroll();


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  return {
    scrollY,
    isScrolled,
  };
}