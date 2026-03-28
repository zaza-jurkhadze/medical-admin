"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function FaqAccordion() {
  const { t, i18n } = useTranslation("common");
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loaded, setLoaded] = useState(false); 

  useEffect(() => {
    setLoaded(true);
    const faqArray = [
      { question: t("faq1_question"), answer: t("faq1_answer") },
      { question: t("faq2_question"), answer: t("faq2_answer") },
      { question: t("faq3_question"), answer: t("faq3_answer") },
      { question: t("faq4_question"), answer: t("faq4_answer") },
      { question: t("faq5_question"), answer: t("faq5_answer") },
      { question: t("faq6_question"), answer: t("faq6_answer") },
    ];
    setFaqs(faqArray);
  }, [i18n.language, t]);

  if (!loaded) return null; 

  const toggleAccordion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-title">{t("faq")}</h2>
      <div className="accordion-wrapper">
        {faqs.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className="accordion-toggle"
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
