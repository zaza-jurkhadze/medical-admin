"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../app/styles/globals.css';
import '../app/styles/responsive.css';

const BRAND_COLOR = '#EC7C19';
const INITIAL_DISPLAY_COUNT = 4;
const RANDOM_INTERVAL = 10000; 

export default function Services({ showAllPage = false }) {
  const { t, i18n } = useTranslation();
  const [servicesData, setServicesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hydration safe mount
  useEffect(() => setMounted(true), []);

  // Client-side სერვისების წამოღება
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/servicesData'); 
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServicesData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert(t("failedFetchServices"));
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [t]);

  // Random services logic
  useEffect(() => {
    if (!mounted || showAllPage || searchTerm) return;

    const changeRandom = () => {
      const shuffled = [...servicesData].sort(() => 0.5 - Math.random());
      setDisplayedServices(shuffled.slice(0, INITIAL_DISPLAY_COUNT));
    };

    changeRandom();
    const interval = setInterval(changeRandom, RANDOM_INTERVAL);
    return () => clearInterval(interval);
  }, [mounted, servicesData, showAllPage, searchTerm]);

  // Filtering logic
  useEffect(() => {
    if (showAllPage || searchTerm) {
      setDisplayedServices(
        servicesData.filter(s => s.name?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [searchTerm, showAllPage, servicesData, i18n.language]);

  if (!mounted) return null; // Hydration safe

  return (
    <section id='services' className="services-section">
      <h2>{t("services")}</h2>
      <p>
        {t("servicesDescription").split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>

      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={e => e.target.style.borderColor = BRAND_COLOR}
        onBlur={e => e.target.style.borderColor = '#ddd'}
      />

      <div className="services-grid">
        {loading ? (
          Array(INITIAL_DISPLAY_COUNT).fill(0).map((_, i) => (
            <div key={i} className="service-card">
              <div className="placeholder">Loading...</div>
            </div>
          ))
        ) : displayedServices.length > 0 ? (
          displayedServices.map((service, i) => (
            <div
              key={service._id || service.id || i}
              className="service-card"
              onClick={() => service.slugId && router.push(`/services/${service.slugId}`)}
              style={{ cursor: service.slugId ? "pointer" : "default" }}
            >
              <div className="icon">
                <Image
                  src={service.image || service.icon || '/img/icons/default.jpg'}
                  alt={service.name[i18n.language]}
                  width={50}
                  height={50}
                  style={{
                    objectFit: 'contain',
                    filter: 'invert(32%) sepia(99%) saturate(7482%) hue-rotate(203deg) brightness(99%) contrast(101%)'
                  }}
                />
              </div>
              <span className="service-link">{service.name[i18n.language]}</span>
            </div>
          ))
        ) : (
          <div className="no-results">{t("noResults")}</div>
        )}
      </div>

      {!showAllPage && searchTerm === '' && servicesData.length > INITIAL_DISPLAY_COUNT && (
        <button
          className="show-all-btn"
          onClick={() => router.push('/services/all')}
        >
          {t("allServices")}
        </button>
      )}
    </section>
  );
}
