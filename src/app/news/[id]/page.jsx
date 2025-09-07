"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import LocationAndFooter from "@/components/LocationAndFooter";
import ContactInfo from "@/components/ContactInfo";
import TopHeader from "@/components/TopHeader";

const NewsDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState([]);

  // Fetch single news
  useEffect(() => {
    if (!id) return;
    const fetchNewsItem = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("ვერ მოვიტანე სიახლე");
        const data = await res.json();
        setNewsItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsItem();
  }, [id]);

  // Fetch all news for navigation
  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await fetch(`/api/news`);
        if (!res.ok) throw new Error("ვერ მოვიტანე სიახლეები");
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
  }, []);

  const navigateNews = (direction) => {
    if (!allNews.length) return;
    const currentIndex = allNews.findIndex((item) => item._id === id);
    let newIndex;
    if (direction === "prev") newIndex = currentIndex - 1;
    else newIndex = currentIndex + 1;

    if (newIndex >= 0 && newIndex < allNews.length) {
      router.push(`/news/${allNews[newIndex]._id}`);
    }
  };

  if (loading)
    return (
      <>
        <TopHeader />
        <MainHeader />
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          მიმდინარეობს ჩატვირთვა...
        </p>
        <LocationAndFooter />
      </>
    );

  if (!newsItem)
    return (
      <>
        <TopHeader />
        <MainHeader />
        <p style={{ textAlign: "center", marginTop: "100px" }}>სიახლე ვერ მოიძებნა</p>
        <LocationAndFooter />
      </>
    );

  return (
    <>
      <TopHeader />
      <MainHeader />
      <section className="news-detail">
        <h1>{newsItem.title}</h1>
        <p className="news-date">{new Date(newsItem.date).toLocaleDateString("ka-GE")}</p>
        <img src={newsItem.image || "/img/news/default.jpg"} alt={newsItem.title} />
        <p className="news-text">
          {newsItem.text.split("\n").map((line, index) => (
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
            disabled={allNews.findIndex((item) => item._id === id) === 0}
          >
            ←
          </button>
          <button
            className="next-btn"
            onClick={() => navigateNews("next")}
            disabled={allNews.findIndex((item) => item._id === id) === allNews.length - 1}
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
