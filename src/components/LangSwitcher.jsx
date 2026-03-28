'use client';
import React, { useState, useEffect } from 'react';
import i18n from '../i18n';

export default function LangSwitcher() {
  const [currentLang, setCurrentLang] = useState('ka');

  useEffect(() => {
    setCurrentLang(i18n.language || 'ka'); // თავიდან ასაწყობი ენა
  }, []);

  const changeLang = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    setCurrentLang(selectedLang);
  };

  return (
    <div className="lang-switcher">
      <select
        onChange={changeLang}
        value={currentLang}
        className="border rounded p-1"
      >
        <option value="ka">KA</option>
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
    </div>
  );
}
