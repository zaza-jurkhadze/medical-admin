"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import TopHeader from "@/components/TopHeader";
import MainHeader from "@/components/MainHeader";
import ContactInfo from "@/components/ContactInfo";
import LocationAndFooter from "@/components/LocationAndFooter";
import MessengerButton from "@/components/MessengerChat";
import ChatbotWidget from "@/components/Chatbox";

const ITEMS_PER_PAGE = 10;

const AllDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");       // სახელით ძებნა
  const [specialtyTerm, setSpecialtyTerm] = useState(""); // სპეციალობით ძებნა
  const [page, setPage] = useState(1);
  const router = useRouter();
  const sectionRef = useRef(null); // სკროლისთვის მთლიანი სექცია
  const firstCardRef = useRef(null); // პირველი ქარდი, ძებნის დროს სკროლისთვის

  // ექიმების წამოღება
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("ვერ მოვიტანე ექიმები");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  // Filter by name + specialty
  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        doc.position.toLowerCase().includes(specialtyTerm.toLowerCase())
    );
  }, [doctors, searchTerm, specialtyTerm]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDoctors, page]);

  // Pagination ცვლილებისას სკროლი ზემოთ
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  // ძებნის დროს, პირველი ქარდი ცენტრში
  useEffect(() => {
    if (firstCardRef.current && (searchTerm || specialtyTerm) && filteredDoctors.length > 0) {
      firstCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchTerm, specialtyTerm, filteredDoctors]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <TopHeader/>
      <MainHeader/>
      <section className="all-doctors-section" ref={sectionRef}>
        <h2 className="all-doctors-title">ყველა ექიმი</h2>

        {/* ძებნა სახელით */}
        <input
          type="text"
          className="all-doctors-search"
          placeholder="მოძებნეთ ექიმი სახელით..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ძებნა სპეციალობით */}
        <input
          type="text"
          className="all-doctors-search"
          placeholder="მოძებნეთ ექიმი სპეციალობით..."
          value={specialtyTerm}
          onChange={(e) => setSpecialtyTerm(e.target.value)}
        />

        {/* ექიმების ქარდები */}
        <div className="all-doctors-grid">
          {paginatedDoctors.map((doctor, index) => (
            <div
              key={doctor._id}
              className="all-doctors-card"
              ref={index === 0 ? firstCardRef : null} // პირველი ქარდი რეფერენსი
              onClick={() => router.push(`/doctors/${doctor.doctorSlug}`)}
            >
              <img src={doctor.image || "/img/doctors/default.jpg"} alt={doctor.name} />
              <div className="doctor-name">{doctor.name}</div>
              <div className="doctor-position">{doctor.position}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="all-doctors-pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              &lt;
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              &gt;
            </button>
          </div>
        )}
      </section>
      <ContactInfo />
      <LocationAndFooter />
      <MessengerButton />
      <ChatbotWidget />
    </>
  );
};

export default AllDoctorsPage;
