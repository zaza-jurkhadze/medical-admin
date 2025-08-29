"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const ITEMS_PER_PAGE = 3;

export default function AdminNews() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", image: "", text: "" });
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      if (data.news) {
        const sorted = data.news.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(sorted);
        setTotalPages(Math.ceil(sorted.length / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load news");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/news/upload", { method: "POST", body: formData });
      if (!res.ok) return alert("Failed to upload image");
      const data = await res.json();
      setForm(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    }
  };

  const saveNews = async () => {
    if (!form.title || !form.date) return alert("Title and Date are required");

    try {
      if (editingId) {
        const res = await fetch(`/api/news?_id=${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update news");
        const updated = await res.json();
        setNews(prev => prev.map(n => n._id === editingId ? updated : n));
        setEditingId(null);
      } else {
        const newNews = { ...form, image: form.image || "/img/news/default.jpg", date: new Date(form.date) };
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNews),
        });
        if (!res.ok) throw new Error("Failed to add news");
        const saved = await res.json();
        setNews(prev => [saved, ...prev]);
        setTotalPages(Math.ceil((news.length + 1) / ITEMS_PER_PAGE));
      }
      setForm({ title: "", date: "", image: "", text: "" });
      setCurrentPage(1); // ახალი სიახლე ყოველთვის პირველ გვერდზე
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const deleteNews = async (_id) => {
    if (!confirm("დარწმუნებული ხართ რომ გინდათ წაშლა?")) return;
    try {
      const res = await fetch("/api/news?_id=" + _id, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete news");
      setNews(prev => prev.filter(n => n._id !== _id));
      setTotalPages(Math.ceil((news.length - 1) / ITEMS_PER_PAGE));
      if (currentPage > Math.ceil((news.length - 1) / ITEMS_PER_PAGE)) setCurrentPage(prev => prev - 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete news");
    }
  };

  const editNews = (n) => {
    setForm({ 
      title: n.title, 
      date: new Date(n.date).toISOString().slice(0,10), 
      image: n.image, 
      text: n.text || "" 
    });
    setEditingId(n._id);
  };

  // Pagination: current page-ს მიხედვით გამოიტანო subset
  const paginatedNews = news.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <ProtectedRoute>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ textAlign: "center", color:"#EC7C19" }}>Admin News</h1>

        <button onClick={() => router.push("/dashboard")} style={{ marginBottom:20, padding:"6px 12px", backgroundColor:"#EC7C19", color:"#fff", border:"none", borderRadius:4 }}>
          უკან დაბრუნება
        </button>

        {/* Form */}
        <div style={{ background:"#f9f9f9", padding:16, borderRadius:8, marginBottom:24, color: "#000", border: "1px solid #333" }}>
          <div style={{ marginBottom:12 }}>
            <label>მაგ:სიახლე 1</label>
            <input name="title" value={form.title} onChange={handleChange} style={{ width:"100%", padding:6, marginTop:4, color: "#000", border: "1px solid #333" }} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label>თარიღი</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} style={{ width:"100%", padding:6, marginTop:4, border: "1px solid #333" }} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label>Image</label>
            <input type="file" onChange={uploadImage} />
            {form.image && <img src={form.image} alt="preview" style={{ width:80, height:80, objectFit:"cover", marginTop:8, borderRadius:4, border: "1px solid #333" }} />}
          </div>
          <div style={{ marginBottom:12 }}>
            <label>სიახლის ტექსტი</label>
            <textarea name="text" value={form.text} onChange={handleChange} style={{ width:"100%", minHeight:80, padding:6, marginTop:4,border: "1px solid #333" }} />
          </div>

          <button onClick={saveNews} style={{ padding:"6px 12px", backgroundColor:"#EC7C19", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" }}>
            {editingId ? "Update News" : "Add News"}
          </button>

          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ title:"", date:"", image:"", text:"" }); }} style={{ marginLeft:8, padding:"6px 12px", background:"#aaa", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" }}>
              Cancel
            </button>
          )}
        </div>

        {/* News List */}
        <ul style={{ listStyle: "none", padding: 0, color: "#000" }}>
          {paginatedNews.map(n => (
            <li key={n._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottom: "1px solid #ccc", marginBottom: 8, background: "#fff", borderRadius: 4 }}>
              <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
                <img src={n.image || "/img/news/default.jpg"} alt={n.title} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} />
                <div style={{ minWidth: 0 }}>
                  <strong>{n.title}</strong><br />
                  Date: {new Date(n.date).toLocaleDateString()}<br />
                  {n.text && <div style={{ maxWidth: "600px", whiteSpace: "pre-wrap", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis" }}>{n.text}</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, marginLeft: 12, flexShrink: 0 }}>
                <button onClick={() => editNews(n)} style={{ backgroundColor: "#3498db", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" }}>Edit</button>
                <button onClick={() => deleteNews(n._id)} style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

    {/* Pagination */}
{totalPages > 1 && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1.5rem",
    }}
  >
    {/* Previous */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        backgroundColor: currentPage === 1 ? "#f0f0f0" : "#fff",
        color: currentPage === 1 ? "#aaa" : "#333",
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
        transition: "all 0.2s",
      }}
    >
      &lt;
    </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: currentPage === i + 1 ? "1px solid #EC7C19" : "1px solid #ddd",
              backgroundColor: currentPage === i + 1 ? "#EC7C19" : "#fff",
              color: currentPage === i + 1 ? "#fff" : "#333",
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {i + 1}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#fff",
            color: currentPage === totalPages ? "#aaa" : "#333",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          &gt;
        </button>
      </div>
    )}
      </div>
    </ProtectedRoute>
  );
}