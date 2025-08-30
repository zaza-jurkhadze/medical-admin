/*"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";  // Next.js router
const ITEMS_PER_PAGE = 4;
const BRAND_COLOR = "#EC7C19";

const DoctorsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [randomDoctors, setRandomDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]); // DB-დან წამოღებული ექიმები
  const router = useRouter();

  // ექიმების წამოღება API-დან
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

  // ფილტრი ექიმებზე სახელით
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, doctors]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  // ექიმების გვერდით ცხრილი
  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredDoctors]);

  // 4 ექიმის რენდომი სლაიდები (5 წამში ცვლა)
  useEffect(() => {
    if (showAll || searchTerm) return;

    const changeRandom = () => {
      const shuffled = [...doctors].sort(() => 0.5 - Math.random());
      setRandomDoctors(shuffled.slice(0, ITEMS_PER_PAGE));
    };

    if (doctors.length > 0) {
      changeRandom();
      const interval = setInterval(changeRandom, 5000);
      return () => clearInterval(interval);
    }
  }, [showAll, searchTerm, doctors]);

  // თუ გვერდი მეტია მაქსიმალურზე, დაბრუნდეს 1-ზე
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  // ღილაკების ჰენდლერები
  const handleShowAllClick = () => {
    setShowAll(true);
    setPage(1);
  };

  const handleShowLessClick = () => {
    setShowAll(false);
    setSearchTerm("");
  };

  return (
    <section
      id="doctors"
      style={{
        maxWidth: 1100,
        margin: "auto",
        padding: "60px 15px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>ექიმები</h2>

      <input
        type="text"
        placeholder="მოძებნეთ ექიმი..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
          color: "#555"
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND_COLOR)}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 25,
          justifyItems: "center",
          marginBottom: 30,
        }}
      >
        {(showAll || searchTerm ? paginatedDoctors : randomDoctors).map(
          (doctor) => (
            <div
              key={doctor._id} // MongoDB-ში `_id` აქვს
              onClick={() => router.push(`/doctors/${doctor.doctorSlug}`)}
              style={{
                backgroundColor: "#FAFAFA",
                borderRadius: 12,
                padding: 20,
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
                src={doctor.image || "/img/doctors/default.jpg"} // თუ სურათი არაა, default
                alt={doctor.name}
                style={{
                  width: 150,
                  height: 150,
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
                  color: "#111"
                }}
              >
                {doctor.name}
              </div>
              <div style={{ color: "#000", fontSize: "1rem" }}>
                {doctor.position}
              </div>
            </div>
          )
        )}
      </div>

      {showAll && totalPages > 1 && (
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{
              padding: "8px 12px",
              color: "#000",
              borderRadius: 6,
              border: "1.5px solid #ddd",
              backgroundColor: "white",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                padding: "8px 12px",
                color: "#000",
                borderRadius: 6,
                border: "1.5px solid #ddd",
                backgroundColor: page === i + 1 ? BRAND_COLOR : "white",
                color: page === i + 1 ? "white" : "#333",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{
              padding: "8px 12px",
              color: "#000",
              borderRadius: 6,
              border: "1.5px solid #ddd",
              backgroundColor: "white",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            &gt;
          </button>
        </div>
      )}

      {!showAll && !searchTerm && (
        <button
          onClick={handleShowAllClick}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d66d18")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = BRAND_COLOR)
          }
        >
          ყველა ექიმის ნახვა
        </button>
      )}

      {(showAll || searchTerm) && (
        <button
          onClick={handleShowLessClick}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d66d18")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = BRAND_COLOR)
          }
        >
          ნაკლები ექიმი
        </button>
      )}
    </section>
  );
};

export default DoctorsSection;

*/
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";  // Next.js router
const ITEMS_PER_PAGE = 4;
const BRAND_COLOR = "#EC7C19";

const DoctorsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyTerm, setSpecialtyTerm] = useState("");
  const [randomDoctors, setRandomDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]); // DB-დან წამოღებული ექიმები
  const router = useRouter();

  // ექიმების წამოღება API-დან
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

  // ფილტრი ექიმებზე სახელით ან სპეციალობით
  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        doc.position.toLowerCase().includes(specialtyTerm.toLowerCase())
    );
  }, [searchTerm, specialtyTerm, doctors]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  // ექიმების გვერდებით ცხრილი
  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredDoctors]);

  // 4 ექიმის რენდომი სლაიდები (5 წამში ცვლა)
  useEffect(() => {
    if (showAll || searchTerm || specialtyTerm) return;

    const changeRandom = () => {
      const shuffled = [...doctors].sort(() => 0.5 - Math.random());
      setRandomDoctors(shuffled.slice(0, ITEMS_PER_PAGE));
    };

    if (doctors.length > 0) {
      changeRandom();
      const interval = setInterval(changeRandom, 5000);
      return () => clearInterval(interval);
    }
  }, [showAll, searchTerm, specialtyTerm, doctors]);

  // თუ გვერდი მეტია მაქსიმალურზე, დაბრუნდეს 1-ზე
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const handleShowAllClick = () => {
    setShowAll(true);
    setPage(1);
  };

  const handleShowLessClick = () => {
    setShowAll(false);
    setSearchTerm("");
    setSpecialtyTerm("");
  };

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
      <h2 style={{ fontSize: "1.6rem", marginBottom: "10px", fontWeight: "400" }}>ექიმები</h2>

      {/* ძიება სახელით */}
      <input
        type="text"
        placeholder="მოძებნეთ ექიმი სახელით..."
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

      {/* ძიება სპეციალობით */}
      <input
        type="text"
        placeholder="მოძებნეთ ექიმი სპეციალობით..."
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

      {/* ექიმების ბარათები */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
                padding: 20,
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
                  width: 150,
                  height: 150,
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
                  color: "#111"
                }}
              >
                {doctor.name}
              </div>
              <div style={{ color: "#000", fontSize: "1rem" }}>
                {doctor.position}
              </div>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {(showAll || searchTerm || specialtyTerm) && totalPages > 1 && (
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1.5px solid #ddd",
              backgroundColor: "white",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1.5px solid #ddd",
                backgroundColor: page === i + 1 ? BRAND_COLOR : "white",
                color: page === i + 1 ? "white" : "#333",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1.5px solid #ddd",
              backgroundColor: "white",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            &gt;
          </button>
        </div>
      )}

      {!showAll && !searchTerm && !specialtyTerm && (
        <button
          onClick={handleShowAllClick}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d66d18")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = BRAND_COLOR)
          }
        >
          ყველა ექიმის ნახვა
        </button>
      )}

      {(showAll || searchTerm || specialtyTerm) && (
        <button
          onClick={handleShowLessClick}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d66d18")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = BRAND_COLOR)
          }
        >
          ნაკლები ექიმი
        </button>
      )}
    </section>
  );
};

export default DoctorsSection;

