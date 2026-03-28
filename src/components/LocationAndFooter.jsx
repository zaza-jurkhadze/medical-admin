"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LocationAndFooter = () => {
  const { t, i18n } = useTranslation("common");
  const [loaded, setLoaded] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setLoaded(true); // Client-side only
  }, []);

  if (!loaded) return null;

  return (
    <section className="location-section" id="clinic-location">
      <h2>{t("locationTitle")}</h2>
      <p className="location-description">{t("locationDescription")}</p>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2960.759447399296!2d42.27363907660192!3d42.26229007120116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x405c8c14046dfb6d%3A0x4717aa1e6c0a0fc5!2s40%20Poti%20St%2C%20Kutaisi!5e0!3m2!1sen!2sge!4v1721657263841!5m2!1sen!2sge"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div>

      <a
        href="https://www.google.com/maps/place/40+Poti+St,+Kutaisi,+Georgia/"
        target="_blank"
        rel="noopener noreferrer"
        className="map-button"
      >
        {t("mapButton")}
      </a>

      <footer className="site-footer">
        <p>
          &copy; {currentYear} {t("footerText")}
        </p>
      </footer>
    </section>
  );
};

export default LocationAndFooter;
