"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import MainHeader from "@/components/MainHeader";
import LocationAndFooter from "@/components/LocationAndFooter";
import ContactInfo from "@/components/ContactInfo";
import TopHeader from "@/components/TopHeader";

const NewsDetail = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language; // მიმდინარე ენა: "ka", "en", "ru"
  const { id } = useParams();
  const router = useRouter();

  const [newsItem, setNewsItem] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // hydration safe

  useEffect(() => setMounted(true), []);

  // Fetch single news
  useEffect(() => {
    if (!id) return;
    const fetchNewsItem = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error(t("fetchNewsError") || "ვერ მოვიტანე სიახლე");
        const data = await res.json();
        setNewsItem(data);
      } catch (err) {
        console.error(err);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsItem();
  }, [id, t]);

  // Fetch all news for navigation
  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await fetch(`/api/news`);
        if (!res.ok) throw new Error(t("fetchNewsError") || "ვერ მოვიტანე სიახლეები");
        const data = await res.json();
        const sorted = data.news.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAllNews(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllNews();
  }, [t]);

  const navigateNews = (direction) => {
    if (!allNews.length) return;
    const currentIndex = allNews.findIndex((item) => item._id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < allNews.length) {
      router.push(`/news/${allNews[newIndex]._id}`);
    }
  };

  if (!mounted) return null;

  if (loading)
    return (
      <>
        <TopHeader />
        <MainHeader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          <div
            style={{
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #EC7C19",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite",
            }}
          />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        <LocationAndFooter />
      </>
    );

  if (!newsItem)
    return (
      <>
        <TopHeader />
        <MainHeader />
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          {t("newsNotFound") || "სიახლე ვერ მოიძებნა"}
        </p>
        <LocationAndFooter />
      </>
    );

  const currentIndex = allNews.findIndex((item) => item._id === id);

  const displayTitle =
    typeof newsItem.title === "string"
      ? newsItem.title
      : newsItem.title?.[lang] || "";

  const displayText =
    typeof newsItem.text === "string"
      ? newsItem.text
      : newsItem.text?.[lang] || "";

  return (
    <>
      <TopHeader />
      <MainHeader />
      <section className="news-detail">
        <h1>{displayTitle}</h1>
        <p className="news-date">
          {new Date(newsItem.date).toLocaleDateString("ka-GE")}
        </p>
        <img
          src={newsItem.image || "/img/news/default.jpg"}
          alt={displayTitle || "news"}
        />
        <p className="news-text">
          {displayText.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <div className="news-nav-buttons">
          <button
            className="prev-btn"
            onClick={() => navigateNews("prev")}
            disabled={currentIndex === 0}
          >
            ←
          </button>
          <button
            className="next-btn"
            onClick={() => navigateNews("next")}
            disabled={currentIndex === allNews.length - 1}
          >
            →
          </button>
        </div>
      </section>
      <ContactInfo />
      <LocationAndFooter />
    </>
  );
};

export default NewsDetail;
