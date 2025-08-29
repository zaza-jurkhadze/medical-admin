"use client";
import { useEffect, useState } from "react";

const imageList = {
  diagnostic: Array.from({ length: 8 }, (_, i) => `/img/diagnostic/${i + 1}.png`),
  laboratory: Array.from({ length: 8 }, (_, i) => `/img/laboratory/${i + 1}.png`),
};

const departmentData = [
  {
    id: "first",
    title: "დიაგნოსტიკური დეპარტამენტი",
    description: `მაღალტექნოლოგიური დიაგნოსტიკა სიზუსტისა და სანდოობის გარანტიით...`,
    images: imageList.diagnostic,
  },
  {
    id: "second",
    title: "ლაბორატორია",
    description: `სწრაფი და ზუსტი ანალიზები, რომლებსაც შეგიძლიათ ენდოთ...`,
    images: imageList.laboratory,
  },
];

const DiagnosticSection = () => {
  const [pages, setPages] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const itemsPerPage = width <= 480 ? 2 : width <= 992 ? 4 : 8;
      const newPages = {};

      departmentData.forEach((dep) => {
        const totalPages = Math.ceil(dep.images.length / itemsPerPage);
        newPages[dep.id] = {
          current: 1,
          total: totalPages,
          perPage: itemsPerPage,
        };
      });

      setPages(newPages);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageClick = (depId, pageNum) => {
    setPages((prev) => ({
      ...prev,
      [depId]: {
        ...prev[depId],
        current: pageNum,
      },
    }));
  };

  return (
    <section id="">
      {departmentData.map(({ id, title, description, images }) => {
        const currentPage = pages[id]?.current || 1;
        const perPage = pages[id]?.perPage || images.length;
        const startIndex = (currentPage - 1) * perPage;
        const paginatedImages = images.slice(startIndex, startIndex + perPage);

        return (
          <section key={id} className={`diagnostic-department ${id}-diagnostic`}>
            <div className="row">
              <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{title}</h2>
              <p className="long-copy diagn-dep-paragraph">{description}</p>
            </div>
            <ul className="diagnostic-dep">
              {paginatedImages.map((imgSrc, index) => (
                <li key={index} className="show">
                  <figure className="diagn-dep-photos">
                    <img src={imgSrc} alt={`${id}-img-${index + 1}`} />
                  </figure>
                </li>
              ))}
            </ul>
            {pages[id]?.total > 1 && (
              <div id={`pagination-${id}`} className="pagination-center">
                {[...Array(pages[id].total)].map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => handlePageClick(id, i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </section>
  );
};

export default DiagnosticSection;