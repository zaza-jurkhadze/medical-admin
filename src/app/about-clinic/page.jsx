"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TopHeader from "../../components/TopHeader";
import MainHeader from "../../components/MainHeader";
import ContactInfo from "../../components/ContactInfo";
import LocationAndFooter from "../../components/LocationAndFooter";

const AboutClinic = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Swipe references
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  const handleNavigate = () => router.push("/administration-full");
  const toggleSection = (section) => setActiveSection(activeSection === section ? null : section);
  const openModal = (index) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);
  const toggleGallery = () => {
    setGalleryOpen(!galleryOpen);
    setCurrentPage(1);
  };

  // Swipe handlers
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      setModalIndex((prev) => (prev === clinicImages.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      setModalIndex((prev) => (prev === 0 ? clinicImages.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const prevImage = (e) => { e.stopPropagation(); setModalIndex((prev) => (prev === 0 ? clinicImages.length - 1 : prev - 1)); };
  const nextImage = (e) => { e.stopPropagation(); setModalIndex((prev) => (prev === clinicImages.length - 1 ? 0 : prev + 1)); };

  const clinicImages = Array.from({ length: 20 }, (_, i) => `/img/galery/${i + 1}.jpg`);
  const imagesPerPage = 4;
  const totalPages = Math.ceil(clinicImages.length / imagesPerPage);
  const paginatedImages = clinicImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  return (
    <>
      <TopHeader />
      <MainHeader />

      <div id="about" style={styles.container}>
        <div style={styles.heroSection}>
          <img src="/img/galery/wrc.jpg" alt="კლინიკის ჰერო" style={styles.heroImage} />
        </div>

          <div style={styles.clinicInfo}>
          <h2>ჩვენს შესახებ</h2>

          <div
            className="clinic-about-text"
            style={{ lineHeight: '1.8', fontSize: '17px', textAlign: 'left' }}
          >
            <p>
              <strong>
                „თანამედროვე სამედიცინო ტექნოლოგიების დასავლეთის რეგიონალური
                ცენტრი“
              </strong>{' '}
              არის მრავალპროფილური სამედიცინო დაწესებულება, რომელიც დაარსდა იდეით
              — დასავლეთ საქართველოში შეგვექმნა ახალი სტანდარტის,
              მაღალტექნოლოგიური კლინიკა, სადაც პაციენტი დგას ყველა გადაწყვეტილების
              ცენტრში.
            </p>

            <p>
              <strong>ჩვენი ხედვაა:</strong> ვიყოთ რეგიონში ლიდერი სამედიცინო
              სერვისების მიმწოდებელი, რომელიც ინოვაციებზე, უწყვეტ გაუმჯობესებაზე
              და ჰუმანურ ღირებულებებზეა დაფუძნებული.
            </p>

            <p>
              <strong>ჩვენი მისიაა:</strong> უზრუნველვყოთ მაღალი ხარისხის,
              უსაფრთხო და ხელმისაწვდომი სამედიცინო მომსახურება ყველა პაციენტისთვის,
              თანამედროვე ტექნოლოგიებისა და პროფესიონალური გუნდის მეშვეობით.
            </p>

            <p>
              ჩვენ გვჯერა, რომ თითოეულ ადამიანს უნდა ჰქონდეს შესაძლებლობა მიიღოს
              ზუსტი დიაგნოზი, დროული მკურნალობა და ემპათიური ზრუნვა — სწორედ ეს
              იდეა განსაზღვრავს ჩვენი გუნდის ყოველდღიურ საქმიანობას.
            </p>



            <h3><strong>ძირითადი ფასეულობები:</strong></h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                <strong>პაციენტზე ორიენტირებულობა –</strong> ჩვენი ყოველი პროცესი
                აგებულია პაციენტის საჭიროებებზე. ვუსმენთ, ვგრძნობთ, ვზრუნავთ და
                ვცდილობთ შევქმნათ გარემო, სადაც პაციენტი გრძნობს, რომ მისი
                ჯანმრთელობა ჩვენს პრიორიტეტად რჩება.
              </li>
              <li>
                <strong>პროფესიონალიზმი –</strong> ჩვენი ექიმები და სამედიცინო
                პერსონალი მუდმივად გადიან საერთაშორისო და ადგილობრივ გადამზადებებს,
                იღებენ მონაწილეობას სამეცნიერო კონგრესებსა და ტრენინგებში, რაც
                უზრუნველყოფს სერვისის უმაღლეს დონეს.
              </li>
              <li>
                <strong>თანამედროვე ტექნოლოგიები –</strong> კლინიკა აღჭურვილია
                უახლესი თაობის სამედიცინო აპარატურით: ციფრული რადიოლოგია,
                ლაბორატორიული დიაგნოსტიკა, ულტრაბგერითი და კომპიუტერული
                ტომოგრაფია.
              </li>
              <li>
                <strong>ეთიკა და პატივისცემა –</strong> ვუფრთხილდებით პაციენტის
                ღირსებას, კონფიდენციალურობასა და არჩევანის თავისუფლებას.
              </li>
              <li>
                <strong>უსაფრთხოება და ხარისხი –</strong> დანერგილია შიდა
                კონტროლის მექანიზმები, სტანდარტიზებული პროცედურები და მუდმივი
                მონიტორინგის სისტემები.
              </li>
            </ul>

            <h3><strong>რატომ „თანამედროვე სამედიცინო ტექნოლოგიების დასავლეთის რეგიონალური
              ცენტრი“?</strong></h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                ✅ <strong>ინოვაციური მიდგომები მკურნალობაში –</strong> ვნერგავთ
                ახალ თერაპიულ და ქირურგიულ მეთოდებს.
              </li>
              <li>
                ✅ <strong>ინტეგრირებული მომსახურება ერთ სივრცეში –</strong>{' '}
                კონსულტაციები, დიაგნოსტიკა, ლაბორატორია, სტაციონარი და რეაბილიტაცია
                — ერთ სივრცეში.
              </li>
              <li>
                ✅ <strong>მრავალპროფილური კადრი –</strong> პროფესიონალი ექიმების
                გუნდი უზრუნველყოფს რთული შემთხვევების სწორ ანალიზს.
              </li>
              <li>
                ✅ <strong>კომფორტული გარემო –</strong> თანამედროვე ინტერიერი, დაცული
                ინფრასტრუქტურა და ფსიქოლოგიურად კომფორტული გარემო.
              </li>
            </ul>

            <h3><strong>ხარისხის პოლიტიკა</strong></h3>
            <p>
              ჩვენთვის ხარისხი მხოლოდ შედეგში არ გამოიხატება — ის იწყება თითოეული
              თანამშრომლის პასუხისმგებლობით და სრულდება პაციენტის კმაყოფილებით.
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>✅ მკაცრი ჰიგიენისა და ინფექციური კონტროლის ზომები</li>
              <li>✅ სტანდარტიზებული სამკურნალო პროტოკოლები</li>
              <li>✅ რისკების მინიმიზაცია და უსაფრთხოების გაუმჯობესება</li>
              <li>✅ პაციენტთა უკუკავშირის მუდმივი შეფასება</li>
            </ul>

            <h3><strong>სოციალური პასუხისმგებლობა</strong></h3>
            <p>
              ჩვენ გვჯერა, რომ კლინიკა არ არის მხოლოდ სერვისის მიმწოდებელი, არამედ
              საზოგადოების ნაწილია. სწორედ ამიტომ ვატარებთ პრევენციულ სკრინინგებს,
              ვზრდით ცნობიერებას და ვთანამშრომლობთ ადგილობრივ და საერთაშორისო
              ორგანიზაციებთან.
            </p>

            <p>
              <strong>ჩვენი მიზანი მარტივია:</strong> ჯანმრთელი ადამიანი – ძლიერი
              რეგიონი!
            </p>

            <p>
              „თანამედროვე სამედიცინო ტექნოლოგიების დასავლეთის რეგიონალური ცენტრი“
              მოწოდებულია გაუწიოს საუკეთესო მომსახურება ყველა ასაკისა და
              მდგომარეობის პაციენტს.
            </p>
          </div>
        </div>

        <div style={styles.galleryButtonWrapper}>
          <button onClick={toggleGallery} style={styles.galleryButton}>📸 ფოტო გალერეა</button>
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

        {/* Modal */}
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
          <button onClick={() => toggleSection("founders")} style={styles.accordionButton}>კლინიკის დამფუძნებლები</button>
          {activeSection === "founders" && (
            <div style={styles.accordionContent}>
              <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt="გია გრძელიძე" style={styles.founderImage} />
                <span>გია გრძელიძე – გენერალური დირექტორი</span>
              </div>
              <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt="ბადრი ჩაკვეტაძე" style={styles.founderImage} />
                <span>ბადრი ჩაკვეტაძე – კლინიკის დამფუძნებელი</span>
              </div>
              <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt="კობა აბუთიძე" style={styles.founderImage} />
                <span>კობა აბუთიძე – კლინიკის დამფუძნებელი</span>
              </div>
              <div style={styles.founderItem}>
                <img src="/img/founders/shota-ingorokva.png" alt="კახა ყავლაშვილი" style={styles.founderImage} />
                <span>კახა ყავლაშვილი – კლინიკის დამფუძნებელი</span>
              </div>
            </div>
          )}

          <button onClick={() => toggleSection("directors")} style={styles.accordionButton}>სამედიცინო დირექტორი</button>
          {activeSection === "directors" && (
            <div style={styles.founderItem}>
              <img src="/img/founders/levan-tkebuchava.png" alt="ლევან ტყებუჩავა" style={styles.founderImage} />
              <span>ლევან ტყებუჩავა – სამედიცინო დირექტორი</span>
            </div>
          )}

          <button onClick={() => toggleSection("admin")} style={styles.accordionButton}>ადმინისტრაცია</button>
          {activeSection === "admin" && (
            <div style={styles.founderItem}>
              <img src="/img/founders/shota-ingorokva.png" alt="თემურ ქარდავა " style={styles.founderImage} />
              <p>თემურ ქარდავა ადმინისტრაციის მენეჯერი</p>
              <button style={styles.detailsButton} onClick={handleNavigate}>ადმინისტრაცია სრულად</button>
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
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heroSection: {
    position: "relative",
    textAlign: "center",
  },
  heroImage: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  clinicInfo: {
    margin: "20px 0",
    fontSize: "18px",
    lineHeight: 1.6,
    textAlign: "left",
  },
  galleryButtonWrapper: {
    marginTop: "20px",
    textAlign: "center",
  },
  galleryButton: {
    padding: "12px 20px",
    backgroundColor: "#ec7c19",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginTop: "30px",
  },
  galleryImage: {
    width: "100%",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  pagination: {
    marginTop: "15px",
    textAlign: "center",
  },
  pageButton: {
    margin: "0 5px",
    padding: "8px 12px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
  activePage: {
    margin: "0 5px",
    padding: "8px 12px",
    border: "1px solid #ec7c19",
    backgroundColor: "#ec7c19",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalContent: {
    maxWidth: "80%",
    maxHeight: "80%",
    borderRadius: "10px",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 30,
    fontSize: 40,
    color: "white",
    cursor: "pointer",
    zIndex: 10001,
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: "30px",
    fontSize: "40px",
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
    transform: "translateY(-50%)",
    zIndex: 10001,
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: "30px",
    fontSize: "40px",
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
    transform: "translateY(-50%)",
    zIndex: 10001,
  },
  accordionSection: {
    marginTop: "30px",
    lineHeight: "30px",
    textAlign: "left",
  },
  accordionButton: {
    display: "block",
    width: "100%",
    textAlign: "left",
    margin: "10px 0",
    padding: "12px",
    backgroundColor: "#f1f1f1",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  accordionContent: {
    padding: "10px",
    background: "#f9f9f9",
  },
  founderItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  founderImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "30px",
  },
  detailsButton: {
    padding: "6px 12px",
    backgroundColor: "#EC7C19",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "100px",
  },
};

export default AboutClinic;
