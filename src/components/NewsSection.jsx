"use client";
import React, { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 3;

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!res.ok) throw new Error("ვერ მოვიტანე სიახლეები");
      const data = await res.json();

      const sortedNews = data.news.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNews(sortedNews);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // პირველი useEffect - mount-ის დროს
  useEffect(() => {
    setCurrentPage(1);
    fetchNews(1); 
  }, []);

  // მეორე useEffect - currentPage ცვლილებისას Pagination-ისთვის
  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const toggleExpand = (_id) => {
    setExpandedItems((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

      if (loading) return (
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

  return (
    <section id="news" className="news-section">
      <h2 className="section-title">სიახლეები</h2>
      <div className="news-grid">
        {news.map((item) => (
          <div key={item._id} className="news-card">
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
                {expandedItems.includes(item._id)
                  ? item.text
                  : item.text.length > 90
                  ? item.text.slice(0, 90) + "..."
                  : item.text}
              </p>
              {item.text.length > 90 && (
                <button
                  onClick={() => toggleExpand(item._id)}
                  className="read-more-btn"
                >
                  {expandedItems.includes(item._id) ? "აკეცვა" : "სრულად"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
