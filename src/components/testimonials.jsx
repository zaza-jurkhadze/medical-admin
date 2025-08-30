"use client"; 

import React from "react";
import doctorImg from "../../public/img/testimonials/1.jpg";

const testimonials = [
  {
    text: "საოცარი პროფესიონალები და თბილი გარემო. ყოველი ვიზიტი უსაფრთხოების განცდას მიტოვებდა...ბევრი ექიმი ვნახე მანამდე, მაგრამ თქვენს კლინიკაში პირველად ვიგრძენი ნდობა და სიმშვიდე...",
    name: "ალექსანდრე დვარაკოვსკი",
    image: doctorImg,
  },
  {
    text: "ექიმების ყურადღება და ზრუნვა დაუვიწყარია. სწორი დიაგნოზი, სწრაფი რეაგირება...ბევრი ექიმი ვნახე მანამდე, მაგრამ თქვენს კლინიკაში პირველად ვიგრძენი ნდობა და სიმშვიდე...",
    name: "ალექსანდრე დვარაკოვსკი",
    image: doctorImg,
  },
  {
    text: "ბევრი ექიმი ვნახე მანამდე, მაგრამ თქვენს კლინიკაში პირველად ვიგრძენი ნდობა და სიმშვიდე...ბევრი ექიმი ვნახე მანამდე, მაგრამ თქვენს კლინიკაში პირველად ვიგრძენი ნდობა და სიმშვიდე...",
    name: "ალექსანდრე დვარაკოვსკი",
    image: doctorImg,
  },
];

const PatientSection = () => {
  return (
    <section className="patient-section" id="patients">
      <div className="section-header">
        <h2 style={{ fontSize: "1.6rem", marginBottom: "10px", fontWeight: "400", }}>მადლიერი პაციენტები</h2>
      </div>

      <div className="patient-grid">
        {testimonials.map((t, index) => (
          <div key={index} className="patient-card">
            <blockquote>
              “{t.text}”
              <cite>
                <img src={t.image.src} alt={t.name} />
                <span>{t.name}</span>
              </cite>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientSection;
