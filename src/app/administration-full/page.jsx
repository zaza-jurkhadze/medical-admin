"use client";

import React, { useState, useEffect } from "react";
import TopHeader from "@/components/TopHeader";
import MainHeader from "@/components/MainHeader";
import ContactInfo from "@/components/ContactInfo";
import LocationAndFooter from "@/components/LocationAndFooter";
import { useTranslation } from "react-i18next";

function AdministrationPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Hydration-safe render only on client
  }, []);

  if (!mounted) return null; // Prevent mismatch on SSR

  const adminSections = t("administrationSections", { returnObjects: true });

  return (
    <>
      <TopHeader />
      <MainHeader />
      <section className="administration-section" style={styles.section}>
        <h2 className="section-title" style={styles.sectionTitle}>
          {t("administrationTitle")}
        </h2>

        {adminSections.map((section, index) => (
          <div
            className={`admin-item ${index % 2 === 1 ? "reverse" : ""}`}
            style={{
              ...styles.adminItem,
              flexDirection: index % 2 === 1 ? "row-reverse" : "row",
            }}
            key={index}
          >
            <div className="admin-text" style={styles.adminText}>
              <h3 style={styles.adminTitle}>{section.title}</h3>
              <ul style={styles.list}>
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="admin-image" style={styles.adminImage}>
              <img src={section.image} alt={section.title} style={styles.image} />
            </div>
          </div>
        ))}
      </section>
      <ContactInfo />
      <LocationAndFooter />
    </>
  );
}

const styles = {
  section: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: "50px",
    fontSize: "32px",
    fontWeight: "700",
    color: "#111",
  },
  adminItem: {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start",
    marginBottom: "50px",
    flexWrap: "wrap",
  },
  adminText: {
    flex: "1 1 300px",
    color: "#222",
    lineHeight: "1.7",
  },
  adminTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#111",
  },
  list: {
    listStyleType: "disc",
    paddingLeft: "20px",
    margin: 0,
    color: "#222",
    lineHeight: "1.6",
  },
  adminImage: {
    flex: "0 1 300px",
    marginTop: "20px",
  },
  image: {
    maxWidth: "350px",
    width: "100%",
    borderRadius: "8px",
  },
};

export default AdministrationPage;
