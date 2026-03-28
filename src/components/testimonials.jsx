"use client";

import React, { useState, useEffect } from "react";
import doctorImg from "../../public/img/testimonials/1.jpg";
import { useTranslation } from "react-i18next";

const testimonials = [
  { textKey: "testimonial1", nameKey: "testimonialName1", image: doctorImg },
  { textKey: "testimonial2", nameKey: "testimonialName2", image: doctorImg },
  { textKey: "testimonial3", nameKey: "testimonialName3", image: doctorImg },
];

const PatientSection = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // დარწმუნება, რომ component fully loaded on client
  }, []);

  if (!mounted) return null;
  return (
    <section className="patient-section" id="patients">
      <div className="section-header">
        <h2>{t("patientSectionTitle")}</h2>
      </div>

      <div className="patient-grid">
        {testimonials.map((tst, index) => (
          <div key={index} className="patient-card">
            <blockquote>
              “{t(tst.textKey)}”
              <cite>
                <img src={tst.image.src} alt={t(tst.nameKey)} />
                <span>{t(tst.nameKey)}</span>
              </cite>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientSection;
