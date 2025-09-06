"use client";

import React from "react";

const ContactInfo = () => {
  return (
    <section className="section-features" id="contact-info">
      <h2>დაგვიკავშირდით</h2>

      <div className="contact-grid">
        {/* საკონტაქტო ინფორმაცია */}
        <div className="contact-column">
          <p>
            <strong>ტელეფონი:</strong>{" "}
            <a href="tel:+995599123456">0431 23 78 78</a>
          </p>
          <p>
            <strong>ელ.ფოსტა:</strong>{" "}
            <a href="mailto:info@wrcclinic.ge">info@wrcclinic.ge</a>
          </p>
        </div>

        {/* სამუშაო საათები */}
        <div className="contact-column">
          <p>
            <strong>სამუშაო საათები:</strong>
          </p>
          <p>ორშ - პარ: 09:30 – 17:30</p>
          <p>შაბათი-კვირა: დასვენების დღე</p>
        </div>

        {/* სოციალური ქსელები */}
        <div className="contact-column">
          <p>
            <strong>გვეწვიეთ სოციალურ ქსელებში:</strong>
          </p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/WRCommt"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/modern_medical_tecnologies?igsh=MXhkZXltY3o4bGswbw== "
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com/yourchannel"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="youtube"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://linkedin.com/in/wrc-clinic"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="linkedin"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a 
              href="https://www.tiktok.com/@wrc-clinic"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok" 
              className="tiktok"
              >
                <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
