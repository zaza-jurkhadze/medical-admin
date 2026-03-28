"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; // i18n hook

const ITEMS_PER_PAGE = 4;
const BRAND_COLOR = "#EC7C19";

const DoctorsSection = () => {
  const { t, i18n } = useTranslation(); // client-side translation
  const [mounted, setMounted] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyTerm, setSpecialtyTerm] = useState("");
  const [randomDoctors, setRandomDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  // avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("ვერ მოვიტანე ექიმები");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("შეცდომა ექიმების წამოღებისას:", err);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        doc.position.toLowerCase().includes(specialtyTerm.toLowerCase())
    );
  }, [searchTerm, specialtyTerm, doctors]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredDoctors]);


  {/*  // random 4 doctors
  useEffect(() => {
    if (showAll || searchTerm || specialtyTerm) return;
    if (doctors.length > 0) {
      const shuffled = [...doctors].sort(() => 0.5 - Math.random());
      setRandomDoctors(shuffled.slice(0, ITEMS_PER_PAGE));
    }
  }, [showAll, searchTerm, specialtyTerm, doctors]); */}

  // random 4 doctors
    useEffect(() => {
      if (showAll || searchTerm || specialtyTerm) return;
      if (doctors.length > 0) {
        // პირველი ჩატვირთვისას მოვხსნათ
        const pickRandom = () => {
          const shuffled = [...doctors].sort(() => 0.5 - Math.random());
          setRandomDoctors(shuffled.slice(0, ITEMS_PER_PAGE));
        };

        pickRandom(); // პირველად დატვირთვისას

        const interval = setInterval(() => {
          pickRandom(); // ყოველ 10 წამში
        }, 10000);

        return () => clearInterval(interval); // cleanup
      }
    }, [showAll, searchTerm, specialtyTerm, doctors]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const handleShowAllClick = () => {
    setShowAll(true);
    setPage(1);
  };

  if (!mounted) {
    // არ ვაჩვენებთ არაფერს სანამ client side არ გაეშვება
    return null;
  }

  return (
    <section
      id="doctors"
      style={{
        maxWidth: 1100,
        margin: "auto",
        padding: "60px 15px",
        textAlign: "center",
        scrollMarginTop: "30px",
      }}
    >
      <h2 style={{ fontSize: "1.6rem", marginBottom: "10px", fontWeight: "400" }}>
        {t("doctorsSectionTitle")}
      </h2>

      {/* Search by name */}
      <input
        type="text"
        placeholder={t("searchByName")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px 15px",
          width: "100%",
          maxWidth: 400,
          marginBottom: 15,
          fontSize: "1rem",
          border: "2px solid #ddd",
          borderRadius: 8,
          outline: "none",
          transition: "border-color 0.3s",
          color: "#555",
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND_COLOR)}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />

      {/* Search by specialty */}
      <input
        type="text"
        placeholder={t("searchBySpecialty")}
        value={specialtyTerm}
        onChange={(e) => setSpecialtyTerm(e.target.value)}
        style={{
          padding: "10px 15px",
          width: "100%",
          maxWidth: 400,
          marginBottom: 30,
          fontSize: "1rem",
          border: "2px solid #ddd",
          borderRadius: 8,
          outline: "none",
          transition: "border-color 0.3s",
          color: "#555",
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND_COLOR)}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 25,
          justifyItems: "center",
          marginBottom: 30,
        }}
      >
        {(showAll || searchTerm || specialtyTerm ? paginatedDoctors : randomDoctors).map(
          (doctor) => (
            <div
              key={doctor._id}
              onClick={() => router.push(`/doctors/${doctor.doctorSlug}`)}
              style={{
                backgroundColor: "#FAFAFA",
                borderRadius: 12,
                padding: 10,
                boxShadow: "0 4px 8px rgba(236, 124, 25, 0.2)",
                textAlign: "center",
                cursor: "pointer",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: 250,
              }}
            >
              <img
                src={doctor.image || "/img/doctors/default.jpg"}
                alt={doctor.name}
                style={{
                  width: 200,
                  height: "auto",
                  borderRadius: "3%",
                  objectFit: "cover",
                  marginBottom: 15,
                  minHeight: 40,
                }}
              />
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "1.05rem",
                  marginBottom: 6,
                  minHeight: 30,
                  color: "#111",
                }}
              >
                {doctor.name}
              </div>
              <div style={{ color: "#000", fontSize: "1rem" }}>{doctor.position}</div>
            </div>
          )
        )}
      </div>

      {/* Show all doctors button */}
      {!showAll && !searchTerm && !specialtyTerm && (
        <button
          onClick={() => router.push("/doctors/all")}
          style={{
            padding: "12px 30px",
            fontSize: "1.1rem",
            backgroundColor: BRAND_COLOR,
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d66d18")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND_COLOR)}
        >
          {t("seeAllDoctors")}
        </button>
      )}
    </section>
  );
};

export default DoctorsSection;
