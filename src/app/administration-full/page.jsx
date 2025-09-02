"use client";

import TopHeader from "@/components/TopHeader";
import MainHeader from "@/components/MainHeader";
import ContactInfo from "@/components/ContactInfo";
import LocationAndFooter from "@/components/LocationAndFooter";

const adminSections = [
  {
    title: "ადმინისტრაციული მართვის განყოფილება",
    items: [
      "სამედიცინო დაწესებულების საერთო მართვა",
      "თანამშრომელთა კოორდინაცია",
      "კონსულტაციის მხარდაჭერა",
      "დოკუმენტაციის ადმინისტრირება"
    ],
    image: "/img/administration/administrator.jpg",
  },
  {
    title: "ადამიანური რესურსების განყოფილება (HR)",
    items: [
      "პერსონალის შერჩევა და აყვანა",
      "შრომითი ხელშეკრულებები",
      "ტრეინინგები და პროფესიული განვითარება",
      "შრომითი დისციპლინა და ეთიკა"
    ],
    image: "/img/administration/hr.jpg",
  },
  {
    title: "ფინანსური განყოფილება",
    items: [
      "ბუღალტრული აღრიცხვა",
      "ბიუჯეტირება და ფინანსური დაგეგმვა",
      "ხელფასების გაცემის მართვა",
      "ფინანსური ანგარიშგება და აუდიტი"
    ],
    image: "/img/administration/financial.jpg",
  },
  {
    title: "პაციენტთა რეგისტრაციისა და მისაღები განყოფილება",
    items: [
      "პაციენტების რეგისტრაცია",
      "სადაზღვევო ინფორმაციის დამუშავება",
      "პაციენტის მიმართულება შესაბამის სერვისზე"
    ],
    image: "/img/administration/registration.jpg",
  },
  {
    title: "შესყიდვებისა და მარაგების განყოფილება",
    items: [
      "სამედიცინო და ადმინისტრაციული მასალების შესყიდვა",
      "მარაგების მართვა",
      "მომწოდებლებთან კომუნიკაცია"
    ],
    image: "/img/administration/purchasing.jpg",
  },
  {
    title: "საკომუნიკაციო და მარკეტინგის განყოფილება",
    items: [
      "კლინიკის ბრენდინგი და რეკლამა",
      "სოციალური მედიის მართვა",
      "საზოგადოებასთან ურთიერთობა",
      "ინფორმაციის გავრცელება"
    ],
    image: "/img/administration/pr.jpg",
  },
  {
    title: "ინფორმაციული ტექნოლოგიების (IT) განყოფილება",
    items: [
      "ჰოსპიტალური ინფორმაციული სისტემების მხარდაჭერა",
      "ქსელური ინფრასტრუქტურა",
      "ტექნიკური დახმარება თანამშრომლებისთვის",
      "მონაცემთა უსაფრთხოება"
    ],
    image: "/img/administration/it.jpg",
  },
  {
    title: "იურიდიული განყოფილება",
    items: [
      "ხელშეკრულებების მომზადება და ანალიზი",
      "რეგულაციების დაცვა",
      "სარჩელების განხილვა და სამართლებრივი მხარდაჭერა"
    ],
    image: "/img/administration/legal.jpg",
  },
  {
    title: "დოკუმენტბრუნვის და არქივის განყოფილება",
    items: [
      "ოფიციალური დოკუმენტაციის მართვა",
      "არქივაცია და წვდომის უზრუნველყოფა"
    ],
    image: "/img/administration/archives.jpg",
  },
  {
    title: "უსაფრთხოებისა და შიდა წესების განყოფილება",
    items: [
      "ფიზიკური უსაფრთხოება",
      "ხანძარსაწინააღმდეგო და სხვა ნორმების დაცვა",
      "პერსონალის გადაადგილების კონტროლი"
    ],
    image: "/img/administration/security.jpg",
  },
  {
    title: "პაციენტთა პირადი მომსახურების სერვისი",
    items: [
      "პაციენტების ინდივიდუალური მიღება და მათთვის ინფორმაციის მიწოდება მომსახურებების შესახებ",
      "პაციენტის დაჯავშნის, ვიზიტის დაგეგმვისა და გადაადგილების პროცესში დახმარება",
      "საჭიროების შემთხვევაში თარჯიმნის, ტრანსპორტის ან დამატებითი სერვისების ორგანიზება",
      "პაციენტის მომსახურების პროცესში სხვა დეპარტამენტებთან კოორდინაცია (ექიმები, რეგისტრატურა, ფინანსური განყოფილება და სხვ.)"
    ],
    image: "/img/administration/patient-private.jpg",
  },
  {
    title: "სააფთიაქო განყოფილება",
    items: [
      "მედიკამენტური მარაგების აღრიცხვა, კონტროლი და ვადების მონიტორინგი",
      "მკაცრად აღრიცხვადი პრეპარატების უსაფრთხო და რეგულაციების შესაბამისი მართვა",
      "რეგულაციებთან, ლიცენზირებასთან და ფარმაცევტულ მოთხოვნებთან შესაბამისობის უზრუნველყოფა"
    ],
    image: "/img/administration/pharmacy.jpg",
  }
];

function AdministrationPage() {
  return (
    <>
      <TopHeader />
      <MainHeader />
      <section className="administration-section" style={styles.section}>
        <h2 className="section-title" style={styles.sectionTitle}>ადმინისტრაცია</h2>

        {adminSections.map((section, index) => (
          <div
            className={`admin-item ${index % 2 === 1 ? "reverse" : ""}`}
            style={{ ...styles.adminItem, flexDirection: index % 2 === 1 ? "row-reverse" : "row" }}
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
    flexWrap: "wrap", // აქ მთავარია responsive
  },
  adminText: {
    flex: "1 1 300px", // მინიმალური ზომა 300px
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
    flex: "0 1 300px", // სურათს მინიმალური ზომა
    marginTop: "20px",
  },
  image: {
    maxWidth: "350px",
    width: "100%",
    borderRadius: "8px",
  },
};

export default AdministrationPage;
