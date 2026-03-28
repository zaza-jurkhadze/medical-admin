"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import '../../../app/../i18n';
import { useTranslation } from "react-i18next";
import MainHeader from "@/components/MainHeader";
import LocationAndFooter from "@/components/LocationAndFooter";
import ContactInfo from "@/components/ContactInfo";
import ChatbotWidget from "@/components/Chatbox.jsx";
import MessengerButton from "@/components/MessengerChat.jsx";
import styles from "./DoctorDetail.module.css";

export default function DoctorDetail() {
  const { doctorSlug } = useParams();
  const { t } = useTranslation();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors?doctorSlug=${doctorSlug}`);
        if (!res.ok) throw new Error("doctorNotFound");

        const data = await res.json();
        const doctorData = Array.isArray(data) ? data[0] : data;

        if (!doctorData) throw new Error("doctorNotFound");
        if (!cancelled) setDoctor(doctorData);
      } catch (e) {
        if (!cancelled) setError(t(e.message) || t("errorOccurred"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDoctor();

    return () => {
      cancelled = true; 
    };
  }, [doctorSlug]);

  if (loading) {
  return (
    <div className={styles.loading}>
      <p>{t("loadingDoctorInfo")}</p>
    </div>
  );
}


  if (error || !doctor) {
    return (
      <div>
        <p>{error || t("doctorNotFound")}</p>
        <a href="/#doctors">← {t("backToDoctors")}</a>
      </div>
    );
  }

  return (
    <>
     <Head>
        <title>{doctor.name} | ექიმი</title>
        <meta
          name="description"
          content={`${doctor.name} - ${doctor.position}. განათლება: ${doctor.education || "ინფორმაცია არ არის"}.`}
        />
      </Head>
      
      <MainHeader />

      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.topRow}>
            <Image
              src={doctor.image || "/img/doctors/default.jpg"}
              alt={doctor.name}
              width={200}
              height={200}
              priority
              className={styles.doctorImage}
              onError={(e) => {
                e.currentTarget.src = "/img/doctors/default.jpg";
              }}
            />
            <div className={styles.info}>
              <h1 className={styles.name}>{doctor.name}</h1>
              <p className={styles.role}>{doctor.position}</p>
            </div>
          </div>

          <div className={styles.details}>
            <p>
              <strong>{t("doctorBio")}:</strong>{" "}
              {doctor.bio || t("infoComingSoon")}
            </p>
            <p>
              <strong>{t("doctorEducation")}:</strong>{" "}
              {doctor.education || t("infoComingSoon")}
            </p>
            <p>
              <strong>{t("doctorExperience")}:</strong>{" "}
              {doctor.experience || t("infoComingSoon")}
            </p>
          </div>
        </div>
      </div>

      <ContactInfo />
      <LocationAndFooter />
      <MessengerButton />
      <ChatbotWidget />
    </>
  );
}
