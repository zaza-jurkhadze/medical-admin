'use client';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import logo from '../../public/img/logo/wrc-logo(1).png';

const MainHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  const computeHeaderOffset = () => {
    const mainHeader = document.querySelector('.main-header');
    const topHeader = document.querySelector('.top-header');

    let offset = 0;
    if (mainHeader) offset += mainHeader.offsetHeight;

    if (topHeader) {
      const rect = topHeader.getBoundingClientRect();
      if (rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, topHeader.offsetHeight);
        offset += visibleHeight;
      }
    }
    return offset;
  };

  const updateHeaderHeight = () => {
    setHeaderHeight(computeHeaderOffset());
  };

  // click outside → close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !hamburgerRef.current?.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // scroll → close menu 
  useEffect(() => {
    const handleScrollClose = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScrollClose);
    return () => window.removeEventListener('scroll', handleScrollClose);
  }, [menuOpen]);

  useLayoutEffect(() => {
    updateHeaderHeight();

    const mainHeader = document.querySelector('.main-header');
    const topHeader = document.querySelector('.top-header');

    const ro = new ResizeObserver(() => updateHeaderHeight());
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
  
    const offset = computeHeaderOffset();
    setHeaderHeight(offset);
    setMenuOpen((prev) => !prev);

    requestAnimationFrame(() => {
      setHeaderHeight(computeHeaderOffset());
    });
  };


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
          onClick={toggleMenu}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        >
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        {/* Desktop Menu */}
     <nav className="main-right desktop-menu" aria-label="Primary navigation">
        <a href="/" onClick={handleHomeClick}>მთავარი</a>
        <Link href="/about-clinic" onClick={() => setMenuOpen(false)}>ჩვენს შესახებ</Link>
        <a
          href="/services/all"
          onClick={(e) => {
            e.preventDefault();
            router.push('/services/all');
            setMenuOpen(false);
          }}
        >
          სერვისები
        </a>
        <a
          href="/doctors/all"
          onClick={(e) => {
            e.preventDefault();
            router.push('/doctors/all');
            setMenuOpen(false);
          }}
        >
          ექიმები
        </a>
        <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>სიახლეები</a>
        <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>კონტაქტი</a>
      </nav>
      </div>

      {/* Mobile Menu */}
      <nav
      className={`mobile-menu ${menuOpen ? 'open' : ''}`}
      style={menuOpen ? { top: `${headerHeight}px` } : undefined}
      ref={menuRef}
      aria-label="Mobile navigation"
    >
      <a href="/" onClick={handleHomeClick}>მთავარი</a>
      <Link href="/about-clinic" onClick={() => setMenuOpen(false)}>ჩვენს შესახებ</Link>
      <a
        href="/services/all"
        onClick={(e) => {
          e.preventDefault();
          router.push('/services/all');
          setMenuOpen(false);
        }}
      >
        სერვისები
      </a>
      <a
        href="/doctors/all"
        onClick={(e) => {
          e.preventDefault();
          router.push('/doctors/all');
          setMenuOpen(false);
        }}
      >
        ექიმები
      </a>
      <a href="/#news" onClick={(e) => scrollToId(e, 'news')}>სიახლეები</a>
      <a href="/#faq" onClick={(e) => scrollToId(e, 'faq')}>ხშირი კითხვები</a>
      <a href="/#contact-info" onClick={(e) => scrollToId(e, 'contact-info')}>კონტაქტი</a>
    </nav>
    </>
  );
};

export default MainHeader;
