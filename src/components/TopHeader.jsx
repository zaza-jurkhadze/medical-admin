'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const TopHeader = () => {
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // თავიდან ვაჩერებთ render-ს სანამ client-side hydration დასრულდება
  if (!hydrated) return null;

  return (
    <div className="top-header">
      <div className="top-left">
        <span><i className="fas fa-map-marker-alt"></i> {t('address')}</span>
        <span><i className="fas fa-phone-alt"></i> {t('phone')}</span>
        <span><i className="fas fa-envelope"></i> {t('email')}</span>
      </div>
      <div className="top-right">
        <a href="https://www.facebook.com/WRCommt" target="_blank" rel="noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/modern_medical_tecnologies" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#"><i className="fab fa-youtube"></i></a>
        <a href="https://linkedin.com/in/wrc-clinic" target="_blank" rel="noreferrer">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="https://www.tiktok.com/@wrc-clinic" target="_blank" rel="noreferrer">
          <i className="fab fa-tiktok"></i>
        </a>
      </div>
    </div>
  );
};

export default TopHeader;
