"use client";
import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    const savedY = sessionStorage.getItem("scrollY");

    const saveScroll = () => {
      sessionStorage.setItem("scrollY", window.scrollY);
    };

    window.addEventListener("beforeunload", saveScroll);

    // პატარა დელეი, რომ DOM render-ებული იყოს
    setTimeout(() => {
      if (savedY) {
        window.scrollTo(0, parseInt(savedY, 10));
        sessionStorage.removeItem("scrollY");
      }
    }, 50); // 50ms საკმარისია

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, []);

  return null;
}
