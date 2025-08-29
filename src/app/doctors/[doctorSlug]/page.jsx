"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import MainHeader from "@/components/MainHeader";
import LocationAndFooter from "@/components/LocationAndFooter";
import ContactInfo from "@/components/ContactInfo";
import ChatbotWidget from "@/components/Chatbox.jsx";
import MessengerButton from "@/components/MessengerChat.jsx";
import styles from "./DoctorDetail.module.css";

export default function DoctorDetail() {
  const { doctorSlug } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await fetch(`/api/doctors?doctorSlug=${doctorSlug}`);
        if (!res.ok) throw new Error("ექიმი ვერ მოიძებნა");
        const data = await res.json();

        // თუ API აბრუნებს მასივს → ავიღოთ პირველი
        const doctorData = Array.isArray(data) ? data[0] : data;

        if (!doctorData) throw new Error("ექიმი ვერ მოიძებნა");
        if (!cancelled) setDoctor(doctorData);
      } catch (e) {
        if (!cancelled) setError(e.message || "შეცდომა მოხდა");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [doctorSlug]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>იტვირთება ექიმის ინფორმაცია...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className={styles.notFound}>
        <p>{error || "ექიმი ვერ მოიძებნა"}</p>
        <a href="/#doctors" className={styles.backLink}>
          ← ექიმების გვერდზე დაბრუნება
        </a>
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
              <strong>ბიოგრაფია:</strong> {doctor.bio || "ინფორმაცია მალე დაემატება."}
            </p>
            <p>
              <strong>განათლება:</strong> {doctor.education || "ინფორმაცია მალე დაემატება."}
            </p>
            <p>
              <strong>სტაჟი:</strong> {doctor.experience || "ინფორმაცია მალე დაემატება."}
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
