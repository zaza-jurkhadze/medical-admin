'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import logo from '../../public/img/logo/wrc-logo(1).png';
import { useTranslation } from 'react-i18next';

const MainHeader = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mounted, setMounted] = useState(false); // client-only rendering

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const computeHeaderOffset = () => {
    const mainHeader = document.querySelector('.main-header');
    const topHeader = document.querySelector('.top-header');
    let offset = 0;
    if (mainHeader) offset += mainHeader.offsetHeight;
    if (topHeader) offset += Math.max(0, Math.min(topHeader.offsetHeight, topHeader.getBoundingClientRect().bottom));
    return offset;
  };

  const updateHeaderHeight = () => setHeaderHeight(computeHeaderOffset());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !hamburgerRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScrollClose = () => menuOpen && setMenuOpen(false);
    window.addEventListener('scroll', handleScrollClose);
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [menuOpen]);

  useLayoutEffect(() => {
    updateHeaderHeight();
    const mainHeader = document.querySelector('.main-header');
    const topHeader = document.querySelector('.top-header');
    const ro = new ResizeObserver(updateHeaderHeight);
    if (mainHeader) ro.observe(mainHeader);
    if (topHeader) ro.observe(topHeader);
    const onResize = () => updateHeaderHeight();
    const onScroll = () => updateHeaderHeight();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleMenu = () => {
    setHeaderHeight(computeHeaderOffset());
    setMenuOpen((prev) => !prev);
    requestAnimationFrame(() => setHeaderHeight(computeHeaderOffset()));
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else router.push('/');
    setMenuOpen(false);
  };

  const scrollToId = (e, id) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push('/').then(() => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
      setMenuOpen(false);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const changeLang = (e) => i18n.changeLanguage(e.target.value);

  if (!mounted) return null;

  return (
    <>
      <div className="main-header">
        <div className="main-left">
          <Image
            src={logo}
            alt="ლოგო"
            className="logo"
            style={{ cursor: 'pointer' }}
            onClick={() => router.push('/')}
            priority
          />
          <div className="brand-text">
            {t('brandText').split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>

        <div
          className="hamburger"
          ref={hamburgerRef}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        >
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <nav className="main-right desktop-menu" aria-label="Primary navigation">
          <a href="/" onClick={handleHomeClick}>{t('home')}</a>
          <Link href="/about-clinic">{t('about_us')}</Link>
          <a href="/services/all" onClick={(e) => { e.preventDefault(); router.push('/services/all'); }}>{t('services')}</a>
          <a href="/doctors/all" onClick={(e) => { e.preventDefault(); router.push('/doctors/all'); }}>{t('doctors')}</a>
          <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>{t('news')}</a>
          <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>{t('contact')}</a>
          {/* Language selector Desktop */}
          <div className="lang-switcher">
            <select value={i18n.language} onChange={changeLang}>
              <option value="ka">KA</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>
          </div>
        </nav>
      </div>

      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={menuOpen ? { top: `${headerHeight}px` } : undefined} ref={menuRef} aria-label="Mobile navigation">
        <a href="/" onClick={handleHomeClick}>{t('home')}</a>
        <Link href="/about-clinic">{t('about_us')}</Link>
        <a href="/services/all" onClick={(e) => { e.preventDefault(); router.push('/services/all'); }}>{t('services')}</a>
        <a href="/doctors/all" onClick={(e) => { e.preventDefault(); router.push('/doctors/all'); }}>{t('doctors')}</a>
        <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>{t('news')}</a>
        <a href="/#faq" onClick={(e) => scrollToId(e, 'faq')}>{t('faq')}</a>
        <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>{t('contact')}</a>
        {/* Language selector Mobile */}
       {/* Mobile language switcher */}
      <div className="mobile-lang-switcher">
        <button
          className={i18n.language === 'ka' ? 'active' : ''}
          onClick={() => i18n.changeLanguage('ka')}
        >
          ქარ
        </button>
        <span>/</span>
        <button
          className={i18n.language === 'en' ? 'active' : ''}
          onClick={() => i18n.changeLanguage('en')}
        >
          ENG
        </button>
        <span>/</span>
        <button
          className={i18n.language === 'ru' ? 'active' : ''}
          onClick={() => i18n.changeLanguage('ru')}
        >
          RUS
        </button>
      </div>

<style jsx>{`
  .mobile-lang-switcher {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }
  .mobile-lang-switcher button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 500;
  }
  .mobile-lang-switcher button.active {
    color: #ec7c19
  }
  .mobile-lang-switcher span {
    margin: 0 2px;
  }
`}</style>

      </nav>
    </>
  );
};

export default MainHeader;
