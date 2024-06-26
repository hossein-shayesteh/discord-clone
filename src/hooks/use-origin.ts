"use client";

import { useEffect, useState } from "react";

const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render CardModal only when component is mounted to prevent hydration errors
  if (!isMounted) return "";

  // Check if window is defined and retrieve the origin of the current location
  return typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "";
};

export default useOrigin;
