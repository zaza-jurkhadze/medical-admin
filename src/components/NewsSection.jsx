"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const NewsSection = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  const currentLang = i18n.language || "ka";

  useEffect(() => {
    setIsClient(true);

    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(t("failedFetchNews"));
        const data = await res.json();
        const sortedNews = data.news
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((n) => ({
            ...n,
            title: n.title || { ka: "", en: "", ru: "" },
            text: n.text || { ka: "", en: "", ru: "" },
          }));
        setNews(sortedNews);
      } catch (err) {
        console.error(err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [t]);

  const nextSlide = () => {
    if (news.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    if (news.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleReadMore = (id) => {
    router.push(`/news/${id}`);
  };

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
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isClient) return null;

  if (loading)
    return (
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "18px",
        }}
      >
        {t("loading")}
      </p>
    );

  if (news.length === 0)
    return (
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "18px",
        }}
      >
        {t("failedFetchNews")}
      </p>
    );

  let cardsToShow = 3;
  if (windowWidth <= 768) cardsToShow = 1;
  else if (windowWidth <= 992) cardsToShow = 2;

  return (
    <section id="news" className="news-section">
      <h2 className="section-title">{t("news")}</h2>

      <div
        className="news-grid-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="news-grid">
          {news.map((item, index) => {
            let visible = false;
            if (windowWidth <= 768)
              visible = index === currentIndex;
            else
              visible =
                index >= currentIndex && index < currentIndex + cardsToShow;

            const itemTitle = item.title[currentLang] || "";
            const itemText = item.text[currentLang] || "";
            const showReadMore = itemText.length > 90;

            return (
              <div
                key={item._id}
                className={`news-card ${visible ? "active" : "inactive"}`}
              >
                <img
                  src={item.image || "/img/news/default.jpg"}
                  alt={itemTitle}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-title">{itemTitle}</h3>
                  <p className="news-date">
                    {new Date(item.date).toLocaleDateString("ka-GE")}
                  </p>
                  <p className="news-text">
                    {showReadMore ? itemText.slice(0, 90) + "..." : itemText}
                  </p>
                  {showReadMore && (
                    <button
                      onClick={() => handleReadMore(item._id)}
                      className="read-more-btn"
                    >
                      {t("readMore")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {news.length > cardsToShow && (
          <div className="carousel-arrows">
            <button className="carousel-btn prev" onClick={prevSlide}>
              &#10094;
            </button>
            <button className="carousel-btn next" onClick={nextSlide}>
              &#10095;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
