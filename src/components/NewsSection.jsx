"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NewsSection = () => {
  const router = useRouter();

  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleReadMore = (id) => {
    router.push(`/news/${id}`);
  };

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
        ერთი წამით...
      </p>
    );

  // Determine how many cards to show based on window width
  let cardsToShow = 3; // default desktop
  if (windowWidth <= 768) cardsToShow = 1;
  else if (windowWidth <= 992) cardsToShow = 2;

  return (
    <section id="news" className="news-section">
      <h2 className="section-title">სიახლეები</h2>

      <div className="news-grid-wrapper">
        <div className="news-grid">
          {news.map((item, index) => {
            // Determine if this card should be visible
            let visible = false;
            if (windowWidth <= 768) {
              visible = index === currentIndex;
            } else {
              visible = index >= currentIndex && index < currentIndex + cardsToShow;
            }

            return (
              <div
                key={item._id}
                className={`news-card ${visible ? "active" : "inactive"}`}
              >
                <img
                  src={item.image || "/img/news/default.jpg"}
                  alt={item.title}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-date">
                    {new Date(item.date).toLocaleDateString("ka-GE")}
                  </p>
                  <p className="news-text">
                    {item.text.length > 90
                      ? item.text.slice(0, 90) + "..."
                      : item.text}
                  </p>
                  {item.text.length > 90 && (
                    <button
                      onClick={() => handleReadMore(item._id)}
                      className="read-more-btn"
                    >
                      სრულად
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
