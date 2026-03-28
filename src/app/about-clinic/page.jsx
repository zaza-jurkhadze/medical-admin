"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import TopHeader from "../../components/TopHeader";
import MainHeader from "../../components/MainHeader";
import ContactInfo from "../../components/ContactInfo";
import LocationAndFooter from "../../components/LocationAndFooter";

const AboutClinic = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clinicImages, setClinicImages] = useState([]);

  const [isClient, setIsClient] = useState(false); // client-side check

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  // მხოლოდ client-side სურათების ინიციალიზაცია
  useEffect(() => {
    setIsClient(true); // ახლა უკვე client-side ვ jeste
    const images = Array.from({ length: 20 }, (_, i) => `/img/galery/${i + 1}.jpg`);
    setClinicImages(images);
  }, []);

  const handleNavigate = () => router.push("/administration-full");
  const toggleSection = (section) => setActiveSection(activeSection === section ? null : section);
  const openModal = (index) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);
  const toggleGallery = () => {
    setGalleryOpen(!galleryOpen);
    setCurrentPage(1);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      setModalIndex(prev => (prev === clinicImages.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      setModalIndex(prev => (prev === 0 ? clinicImages.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const prevImage = (e) => { e.stopPropagation(); setModalIndex(prev => (prev === 0 ? clinicImages.length - 1 : prev - 1)); };
  const nextImage = (e) => { e.stopPropagation(); setModalIndex(prev => (prev === clinicImages.length - 1 ? 0 : prev + 1)); };

  const imagesPerPage = 4;
  const totalPages = Math.ceil(clinicImages.length / imagesPerPage);
  const paginatedImages = clinicImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  // ყველა ტექსტი მხოლოდ client-side
  const aboutData = isClient ? t("aboutClinic", { returnObjects: true }) : null;

  if (!isClient) return null; // SSR–ის დროს არაფერი არ ვაჩვენოთ

  return (
    <>
    <TopHeader />
      <MainHeader />
      <div id="about" style={styles.container}>
        <div style={styles.heroSection}>
          <img src="/img/galery/wrc.jpg" alt={aboutData.heroAlt} style={styles.heroImage} />
        </div>

        <div style={styles.clinicInfo}>
          <h2>{aboutData.title}</h2>
          <div className="clinic-about-text" style={{ lineHeight: '1.8', fontSize: '17px', textAlign: 'left' }}>
            <p>{aboutData.paragraph1}</p>
            <p><strong>{aboutData.visionTitle}</strong> {aboutData.visionText}</p>
            <p><strong>{aboutData.missionTitle}</strong> {aboutData.missionText}</p>
            <p>{aboutData.paragraph2}</p>

            <h3><strong>{aboutData.valuesTitle}</strong></h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>{aboutData.values.patient}</li>
              <li>{aboutData.values.professionalism}</li>
              <li>{aboutData.values.technology}</li>
              <li>{aboutData.values.ethics}</li>
              <li>{aboutData.values.safety}</li>
            </ul>

            <h3><strong>{aboutData.whyTitle}</strong></h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>{aboutData.why.innovation}</li>
              <li>{aboutData.why.integration}</li>
              <li>{aboutData.why.multidisciplinary}</li>
              <li>{aboutData.why.comfort}</li>
            </ul>

            <h3><strong>{aboutData.qualityPolicyTitle}</strong></h3>
            <p>{aboutData.qualityPolicyText}</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>{aboutData.quality.hygiene}</li>
              <li>{aboutData.quality.protocols}</li>
              <li>{aboutData.quality.risks}</li>
              <li>{aboutData.quality.feedback}</li>
            </ul>

            <h3><strong>{aboutData.socialResponsibilityTitle}</strong></h3>
            <p>{aboutData.socialResponsibilityText}</p>

            <p><strong>{aboutData.goalTitle}</strong> {aboutData.goalText}</p>
            <p>{aboutData.finalParagraph}</p>
          </div>
        </div>

        <div style={styles.galleryButtonWrapper}>
          <button onClick={toggleGallery} style={styles.galleryButton}>📸 {aboutData.galleryButton}</button>
        </div>

        {galleryOpen && (
          <>
            <div style={styles.galleryGrid}>
              {paginatedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`კლინიკა ${index + 1}`}
                  onClick={() => openModal((currentPage - 1) * imagesPerPage + index)}
                  style={styles.galleryImage}
                />
              ))}
            </div>

            <div style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={currentPage === i + 1 ? styles.activePage : styles.pageButton}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {modalIndex !== null && (
          <div
            style={styles.modal}
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span style={styles.closeButton} onClick={closeModal}>&times;</span>
            <button onClick={prevImage} style={styles.arrowLeft}>&#10094;</button>
            <img
              style={styles.modalContent}
              src={clinicImages[modalIndex]}
              alt="გადიდებული სურათი"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={nextImage} style={styles.arrowRight}>&#10095;</button>
          </div>
        )}

        <div style={styles.accordionSection}>
          <button onClick={() => toggleSection("founders")} style={styles.accordionButton}>{aboutData.foundersTitle}</button>
          {activeSection === "founders" && (
            <div style={styles.accordionContent}>
              <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt={aboutData.founder1} style={styles.founderImage} />
                <span>{aboutData.founder1}</span>
              </div>
               <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt={aboutData.founder2} style={styles.founderImage} />
                <span>{aboutData.founder2}</span>
              </div>
               <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt={aboutData.founder3} style={styles.founderImage} />
                <span>{aboutData.founder3}</span>
              </div>
               <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt={aboutData.founder4} style={styles.founderImage} />
                <span>{aboutData.founder4}</span>
              </div>
            </div>
          )}

          <button onClick={() => toggleSection("directors")} style={styles.accordionButton}>{aboutData.directorTitle}</button>
          {activeSection === "directors" && (
            <div style={styles.founderItem}>
              <img src="/img/founders/levan-tkebuchava.png" alt={aboutData.directorName} style={styles.founderImage} />
              <span>{aboutData.directorName}</span>
            </div>
          )}

          <button onClick={() => toggleSection("admin")} style={styles.accordionButton}>{aboutData.adminTitle}</button>
          {activeSection === "admin" && (
            <div style={styles.founderItem}>
              <img src="/img/founders/shota-ingorokva.png" alt={aboutData.adminManager} style={styles.founderImage} />
              <p>{aboutData.adminManager}</p>
              <button style={styles.detailsButton} onClick={handleNavigate}>{aboutData.adminFull}</button>
            </div>
          )}
        </div>
      </div>

      <ContactInfo />
      <LocationAndFooter />
    </>
  );
};

const styles = {
  container: { maxWidth: "1000px", margin: "40px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" },
  heroSection: { position: "relative", textAlign: "center" },
  heroImage: { width: "100%", height: "320px", objectFit: "cover", borderRadius: "5px" },
  clinicInfo: { margin: "20px 0", fontSize: "18px", lineHeight: 1.6, textAlign: "left" },
  galleryButtonWrapper: { marginTop: "20px", textAlign: "center" },
  galleryButton: { padding: "12px 20px", backgroundColor: "#ec7c19", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
  galleryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginTop: "30px" },
  galleryImage: { width: "100%", borderRadius: "8px", cursor: "pointer", transition: "transform 0.3s" },
  pagination: { marginTop: "15px", textAlign: "center" },
  pageButton: { margin: "0 5px", padding: "8px 12px", border: "1px solid #ccc", backgroundColor: "#fff", cursor: "pointer", borderRadius: "5px" },
  activePage: { margin: "0 5px", padding: "8px 12px", border: "1px solid #ec7c19", backgroundColor: "#ec7c19", color: "#fff", cursor: "pointer", borderRadius: "5px" },
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modalContent: { maxWidth: "80%", maxHeight: "80%", borderRadius: "10px" },
  closeButton: { position: "absolute", top: 20, right: 30, fontSize: 40, color: "white", cursor: "pointer", zIndex: 10001 },
  arrowLeft: { position: "absolute", top: "50%", left: "30px", fontSize: "40px", color: "white", background: "none", border: "none", cursor: "pointer", transform: "translateY(-50%)", zIndex: 10001 },
  arrowRight: { position: "absolute", top: "50%", right: "30px", fontSize: "40px", color: "white", background: "none", border: "none", cursor: "pointer", transform: "translateY(-50%)", zIndex: 10001 },
  accordionSection: { marginTop: "30px", lineHeight: "30px", textAlign: "left" },
  accordionButton: { display: "block", width: "100%", textAlign: "left", margin: "10px 0", padding: "12px", backgroundColor: "#f1f1f1", border: "none", fontSize: "16px", cursor: "pointer", borderRadius: "5px", transition: "background-color 0.3s" },
  accordionContent: { padding: "10px", background: "#f9f9f9" },
  founderItem: { display: "flex", alignItems: "center", marginBottom: "8px" },
  founderImage: { width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginRight: "30px" },
  detailsButton: { padding: "6px 12px", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", margin: "30px" },
};

export default AboutClinic;
