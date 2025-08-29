"use client";

import React from "react";

const LocationAndFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="location-section" id="clinic-location">
      <h2>ჩვენი ადგილმდებარეობა</h2>
      <p className="location-description">
        მოგვწვდით მარტივად — ჩვენი მისამართია ქუთაისი, ფოთის ქუჩა 40.
      </p>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2960.759447399296!2d42.27363907660192!3d42.26229007120116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x405c8c14046dfb6d%3A0x4717aa1e6c0a0fc5!2s40%20Poti%20St%2C%20Kutaisi!5e0!3m2!1sen!2sge!4v1721657263841!5m2!1sen!2sge"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div>

      <a
        href="https://www.google.com/maps/place/40+Poti+St,+Kutaisi,+Georgia/"
        target="_blank"
        rel="noopener noreferrer"
        className="map-button"
      >
        გახსენით რუკა Google Maps-ზე
      </a>

      <footer className="site-footer">
        <p>
          &copy; {currentYear} ყველა უფლება დაცულია. დამზადებულია Zaza Jurkhadze-ის მიერ.
        </p>
      </footer>
    </section>
  );
};

export default LocationAndFooter;