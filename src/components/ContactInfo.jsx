"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ContactInfo = () => {
  const { t, i18n } = useTranslation("common");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true); // Client-side only
  }, []);

  if (!loaded) return null; // ნუ გამოაქვეყნებს server-side HTML

  return (
    <section className="section-features" id="contact-info">
      <h2>{t("title")}</h2>

      <div className="contact-grid">
        <div className="contact-column">
         <p>
          <strong>{t("contactPhone")}:</strong>{" "}
          <a href={`tel:${t("contactPhoneNumber")}`}>{t("contactPhoneNumberDisplay")}</a>
        </p>
        <p>
          <strong>{t("contactEmail")}:</strong>{" "}
          <a href={`mailto:${t("contactEmailAddress")}`}>{t("contactEmailAddress")}</a>
        </p>
        </div>
        

        <div className="contact-column">
          <p>
            <strong>{t("workingHours")}:</strong>
          </p>
          <p>{t("weekdays")}</p>
          <p>{t("weekend")}</p>
        </div>

        <div className="contact-column">
          <p>
            <strong>{t("socialMedia")}:</strong>
          </p>
          <div className="social-icons">
            <a href={t("facebookLink")} target="_blank" rel="noreferrer" aria-label="Facebook" className="facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href={t("instagramLink")} target="_blank" rel="noreferrer" aria-label="Instagram" className="instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={t("youtubeLink")} target="_blank" rel="noreferrer" aria-label="YouTube" className="youtube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href={t("linkedinLink")} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href={t("tiktokLink")} target="_blank" rel="noreferrer" aria-label="TikTok" className="tiktok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
