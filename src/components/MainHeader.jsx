'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import logo from '../../public/img/logo/wrc-logo(1).png';

const MainHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // height calculation
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // click outside → close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // scroll → close menu
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  // headerHeight calculation
  useEffect(() => {
    if (!isMounted) return;

    const updateHeaderHeight = () => {
      const mainHeader = document.querySelector('.main-header');
      const topHeader = document.querySelector('.top-header');
      if (mainHeader) {
        if (window.scrollY === 0 && topHeader) {
          setHeaderHeight(mainHeader.offsetHeight + topHeader.offsetHeight);
        } else {
          setHeaderHeight(mainHeader.offsetHeight);
        }
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    window.addEventListener("scroll", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      window.removeEventListener("scroll", updateHeaderHeight);
    };
  }, [isMounted]);

  // მთავარი გვერდი
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    } else {
      router.push('/');
      setMenuOpen(false);
    }
  };

  // scroll to section by id
  const scrollToId = (e, id) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push('/#' + id);
      setMenuOpen(false);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <div className="main-header">
        {/* Logo + brand text */}
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
            თანამედროვე სამედიცინო ტექნოლოგიების<br />დასავლეთის რეგიონალური ცენტრი
          </div>
        </div>

        {/* Hamburger */}
        <div
          className="hamburger"
          ref={hamburgerRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen((prev) => !prev)}
        >
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        {/* Desktop Menu */}
        <nav className="main-right desktop-menu" aria-label="Primary navigation">
          <a href="/" onClick={handleHomeClick}>მთავარი</a>
          <Link href="/about-clinic" onClick={() => setMenuOpen(false)}>ჩვენს შესახებ</Link>
          <a href="/#services" onClick={(e) => scrollToId(e, 'services')}>სერვისები</a>
          <a href="/#doctors" onClick={(e) => scrollToId(e, 'doctors')}>ექიმები</a>
          <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>სიახლეები</a>
          <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>კონტაქტი</a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMounted && (
        <nav
          className={`mobile-menu ${menuOpen ? 'open' : ''}`}
          style={{ top: `${headerHeight}px` }}
          ref={menuRef}
          aria-label="Mobile navigation"
        >
          <a href="/" onClick={handleHomeClick}>მთავარი</a>
          <Link href="/about-clinic" onClick={() => setMenuOpen(false)}>ჩვენს შესახებ</Link>
          <a href="/#services" onClick={(e) => scrollToId(e, 'services')}>სერვისები</a>
          <a href="/#doctors" onClick={(e) => scrollToId(e, 'doctors')}>ექიმები</a>
          <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>სიახლეები</a>
          <a href="/#faq" onClick={(e) => scrollToId(e, 'faq')}>ხშირი კითხვები</a>
          <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>კონტაქტი</a>
        </nav>
      )}
    </>
  );
};

export default MainHeader;
