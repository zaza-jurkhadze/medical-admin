"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import ContactInfo from "@/components/ContactInfo";
import LocationAndFooter from "@/components/LocationAndFooter";
import TopHeader from "@/components/TopHeader";

const ITEMS_PER_PAGE = 12;

export default function AllServices() {
  const [servicesData, setServicesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

  // Window resize listener responsive-ისთვის
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Services fetch
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/servicesData");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServicesData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("სერვისების წამოღება ვერ მოხერხდა");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ძებნა
  const filteredServices = useMemo(() => {
    return servicesData.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, servicesData]);

    // Pagination
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
    }, [page, filteredServices]);

    // ⬇️ scroll to top როცა page იცვლება
    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);


  const startIdx = (page - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(page * ITEMS_PER_PAGE, filteredServices.length);

  // Responsive grid padding/gap
  const gridGap = windowWidth < 480 ? "12px" : "20px";
  const gridPadding = windowWidth < 480 ? "0 10px" : "0";

  return (
    <>
      <TopHeader/>
      <MainHeader />

      <main
        style={{
          padding: "40px 20px",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        <h2 style={{fontSize: "25px", textAlign: "center", marginBottom: "30px" }}>
          ყველა სერვისი
        </h2>

        {/* ძებნა */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="მოძებნეთ სერვისი..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              padding: windowWidth < 480 ? "8px 10px" : "10px 14px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "400px",
            }}
          />
        </div>
        
            {/* სერვისების grid */}
        <div
        className="services-grid"
        style={{
            display: "grid",
            gridTemplateColumns:
            windowWidth < 480
                ? "repeat(1, 1fr)" // პატარა ეკრანზე ერთი ქარდი ხაზზე
                : "repeat(auto-fit, minmax(300px, 1fr))", // სხვა ზომებზე flexible
            gap: gridGap,
            justifyItems: "center", // ქარდები ცენტრში
            padding: gridPadding,
        }}
        >
        {paginatedServices.map((service) => (
            <div
            key={service._id || service.id}
            className="service-card"
            onClick={() => router.push(`/services/${service.slugId}`)}
            style={{
                width: "100%",
                maxWidth: windowWidth < 480 ? "300px" : "none",
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 6px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
                cursor: "pointer", // მთლიანი ქარდი კლიკაბელური
            }}
            >
            <div className="icon" style={{ marginBottom: "12px" }}>
                <Image
                src={service.image || service.icon || "/img/icons/default.jpg"}
                alt={service.name}
                width={50}
                height={50}
                style={{
                    objectFit: "contain",
                    filter:
                    "invert(32%) sepia(99%) saturate(7482%) hue-rotate(203deg) brightness(99%) contrast(101%)",
                }}
                />
            </div>
            <p
                className="service-link"
                style={{
                fontWeight: 200,
                margin: 0,
                }}
            >
                {service.name}
            </p>
            </div>
        ))}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
        <div
            style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            }}
        >
            {/* Info text */}
            <p
            style={{
                fontSize: "14px",
                color: "#666",
                fontWeight: 400,
            }}
            >
            ნაჩვენებია {startIdx} – {endIdx} სერვისი {filteredServices.length}-დან
            </p>

            {/* Page controls */}
            <div
            style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                justifyContent: "center",
            }}
            >
            {/* Previous */}
            <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: page === 1 ? "#bbb" : "#333",
                cursor: page === 1 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontWeight: "bold",
                marginRight:"10px",
                }}
            >
                ‹
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => (
                <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: page === i + 1 ? "#EC7C19" : "#fff",
                    color: page === i + 1 ? "#fff" : "#555",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}
                >
                {i + 1}
                </button>
            ))}

            {/* Next */}
            <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: page === totalPages ? "#bbb" : "#333",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontWeight: "bold",
                marginLeft:"10px",
                }}
            >
                ›
            </button>
            </div>
        </div>
        )}        
      </main>

      <ContactInfo />
      <LocationAndFooter />
    </>
  );
}
