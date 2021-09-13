import { useState, useEffect } from "react";

export default () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth > 768);

    const updateIsLargeScreen = e => setIsLargeScreen(window.innerWidth > 768);

    window.addEventListener("resize", updateIsLargeScreen);

    return () => window.removeEventListener("resize", updateIsLargeScreen);
  }, [isLargeScreen]);

  return isLargeScreen;
};
