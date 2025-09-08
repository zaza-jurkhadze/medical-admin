"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const NewsSection = () => {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("ვერ მოვიტანე სიახლეები");
      const data = await res.json();
      const sortedNews = data.news.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setNews(sortedNews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let cardsToShow = 3;
  if (windowWidth <= 768) cardsToShow = 1;
  else if (windowWidth <= 992) cardsToShow = 2;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleReadMore = (id) => {
    router.push(`/news/${id}`);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === "button" || tagName === "a") {
      touchStartX.current = null;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading)
    return (
      <p style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", fontSize: "18px" }}>
        ერთი წამით...
      </p>
    );

  const slideWidth = 100 / cardsToShow; // თითო ქარდის % სიგანე

  return (
    <section id="news" className="news-section">
      <h2 className="section-title">სიახლეები</h2>

      <div
        className="news-grid-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="news-grid"
          ref={sliderRef}
          style={{
            display: "flex",
            transition: "transform 0.5s ease",
            transform: `translateX(-${(currentIndex * slideWidth) % (100)}%)`,
            width: `${(news.length * slideWidth)}%`,
          }}
        >
          {news.map((item) => (
            <div
              key={item._id}
              className="news-card"
              style={{ flex: `0 0 ${slideWidth}%` }}
            >
              <img src={item.image || "/img/news/default.jpg"} alt={item.title} className="news-image" />
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-date">{new Date(item.date).toLocaleDateString("ka-GE")}</p>
                <p className="news-text">{item.text.length > 90 ? item.text.slice(0, 90) + "..." : item.text}</p>
                {item.text.length > 90 && (
                  <button onClick={() => handleReadMore(item._id)} className="read-more-btn">სრულად</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {news.length > cardsToShow && (
          <div className="carousel-arrows">
            <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
            <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
