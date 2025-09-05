"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import TopHeader from "@/components/TopHeader";
import LocationAndFooter from "@/components/LocationAndFooter";
import ContactInfo from "@/components/ContactInfo";
import ChatbotWidget from "@/components/Chatbox.jsx";
import MessengerButton from "@/components/MessengerChat.jsx";
import styles from "./ServiceDetail.module.css";

export default function ServiceDetail() {
  const { slugId } = useParams();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [errorService, setErrorService] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState("");

  // Fetch service detail
  useEffect(() => {
    let cancelled = false;
    setLoadingService(true);
    setErrorService("");
    (async () => {
      try {
        const res = await fetch(`/api/servicesDetails?slugId=${slugId}`);
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        if (!cancelled) setService(data);
      } catch (e) {
        if (!cancelled) setErrorService(e.message || "ვერ მოიძებნა სერვისი");
      } finally {
        if (!cancelled) setLoadingService(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slugId]);

  // Fetch doctors by slugId
  const fetchDoctors = async () => {
    if (showDoctors) {
      // Toggle off
      setShowDoctors(false);
      return;
    }

    setLoadingDoctors(true);
    setErrorDoctors("");
    try {
      const res = await fetch(`/api/doctors?slugId=${slugId}`);
      if (!res.ok) throw new Error("Doctors not found");
      const data = await res.json();
      setDoctors(data || []);
      setShowDoctors(true);
    } catch (e) {
      setErrorDoctors(e.message || "ექიმები ვერ მოიძებნა");
      setDoctors([]);
      setShowDoctors(true);
    } finally {
      setLoadingDoctors(false);
    }
  };

  if (loadingService) return <p className={styles.loading}>ერთი წამით...</p>;
  if (errorService || !service)
    return <p className={styles.notFound}>სერვისი ვერ მოიძებნა</p>;

  return (
    <>
      <TopHeader />
      <MainHeader />

      <div className={styles.wrapper}>
        {/* Banner */}
        <img
          src={service.image}
          alt={service.name}
          className={styles.banner}
          onError={(e) => { e.currentTarget.src = "/img/placeholder.jpg"; }}
        />

        {/* Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>{service.name}</h1>

          {service.generalDescription && (
            <section className={styles.section}>
              <p className={styles.text}>{service.generalDescription}</p>
            </section>
          )}

          {service.symptoms && (
            <section className={styles.section}>
              <p className={styles.text}>{service.symptoms}</p>
            </section>
          )}

          {service.ourApproach && (
            <section className={styles.section}>
              <p className={styles.text}>{service.ourApproach}</p>
            </section>
          )}

          {/* ექიმების ღილაკი */}
          <div className={styles.ctaRow}>
            <button
              className={styles.button}
              onClick={fetchDoctors}
              disabled={loadingDoctors}
            >
              {loadingDoctors
                ? "იტვირთება..."
                : showDoctors
                ? "დამალე ექიმები"
                : "ექიმები"}
            </button>
          </div>

          {/* ექიმების სია */}
          {showDoctors && (
            <section className={styles.section}>
              {loadingDoctors && <p>იტვირთება...</p>}

              {!loadingDoctors && errorDoctors && (
                <p className={styles.error}>{errorDoctors}</p>
              )}

              {!loadingDoctors && !errorDoctors && doctors.length === 0 && (
                <p className={styles.muted}>ამ სერვისზე ექიმები არ მოიძებნა</p>
              )}

              {!loadingDoctors && doctors.length > 0 && (
                <div className={styles.doctorsList}>
                  {doctors.map((doc) => (
                    <article key={doc._id} className={styles.doctorCard}>
                      <img
                        src={doc.image || "/img/doctors/default.jpg"}
                        alt={doc.name}
                        onError={(e) => { e.currentTarget.src = "/img/doctors/default.jpg"; }}
                      />
                      <h3>{doc.name}</h3>
                      <p className={styles.role}>{doc.position}</p>

                      {doc.doctorSlug && (
                        <a className={styles.link} href={`/doctors/${doc.doctorSlug}`}>
                          სრულად
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <ContactInfo />
      <LocationAndFooter />
      <MessengerButton />
      <ChatbotWidget />
    </>
  );
}
