"use client";

import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function AdminServicesIcons() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    slugId: "",
    name: { ka: "", en: "", ru: "" },
    icon: "",
    publicId: ""
  });

  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/servicesData");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("დაფიქსირდა შეცდომა სერვისების წამოღების დროს");
    }
  };

  // Form input change
  const handleChange = (e, lang) => {
    const { name, value } = e.target;
    if (name === "slugId") {
      setForm(prev => ({ ...prev, slugId: value.toLowerCase().replace(/[^a-z-]/g, "") }));
    } else if (["ka", "en", "ru"].includes(lang)) {
      setForm(prev => ({ ...prev, name: { ...prev.name, [lang]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // File upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-service-icon", { method: "POST", body: formData });
      if (!res.ok) throw new Error("ფაილის ატვირთვა ვერ მოხერხდა");

      const data = await res.json();

      if (editingId && form.publicId && form.publicId !== data.public_id) {
        await fetch(`/api/delete-service-icon?publicId=${encodeURIComponent(form.publicId)}`, { method: "DELETE" });
      }

      setForm(prev => ({
        ...prev,
        icon: data.secure_url || data.url,
        publicId: data.public_id || "",
      }));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Add / Update service
  const addService = async () => {
    if (!form.slugId || !form.name.ka) return alert("შეავსეთ slugId და ქართული სახელი");

    try {
      if (editingId) {
        const res = await fetch(`/api/servicesData?_id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) return alert("დაფიქსირდა შეცდომა update-ის დროს");

        const updated = await res.json();
        setServices(prev => prev.map(s => (s._id === editingId ? updated : s)));
        setEditingId(null);
      } else {
        const res = await fetch("/api/servicesData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) return alert("დაფიქსირდა შეცდომა დამატების დროს");

        const saved = await res.json();
        setServices(prev => [...prev, saved]);
      }

      setForm({ slugId: "", name: { ka: "", en: "", ru: "" }, icon: "", publicId: "" });
    } catch (err) {
      console.error(err);
      alert("ოპერაციის დროს მოხდა შეცდომა");
    }
  };

  // Delete service
  const deleteService = async (id, publicId) => {
    if (!confirm("დარწმუნებული ხართ რომ გსურთ წაშლა?")) return;

    try {
      const res = await fetch(`/api/servicesData?_id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        return alert("წაშლის შეცდომა: " + (data.error || ""));
      }

      if (publicId) {
        await fetch(`/api/delete-service-icon?publicId=${encodeURIComponent(publicId)}`, { method: "DELETE" });
      }

      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("წაშლის დროს მოხდა შეცდომა");
    }
  };

  // Start editing
  const startEdit = (service) => {
    setForm({
      slugId: service.slugId,
      name: service.name || { ka: "", en: "", ru: "" },
      icon: service.icon,
      publicId: service.publicId || "",
    });
    setEditingId(service._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ slugId: "", name: { ka: "", en: "", ru: "" }, icon: "", publicId: "" });
    setEditingId(null);
  };

  // Filtered + Pagination
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const name = s.name?.[i18n.language] || s.name?.en || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, services, i18n.language]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        
        {/* LEFT */}
        <div style={{ flex: 1 }}>
          {/* Static list */}
          <div style={{ padding: "1rem", backgroundColor: "#f9f9f9", color: "#555", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
            <h3 style={{ color: "#EC7C19", marginBottom: "1rem" }}>სერვისების ჩამონათვალი (slugId და serviceId)</h3>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li>კარდიოლოგია — serviceId: 1 - slugId: kardiology</li>
              <li>ნევროლოგია — serviceId: 2 - slugId: neurology</li>
              <li>ნეიროქირურგია - serviceId: 3 - slugId: neirosurgery</li>
              <li>გინეკოლოგია - serviceId: 4 — slugId: gynecology</li>
              <li>უროლოგია — serviceId: 5 — slugId: urology</li>
              <li>ქირურგია — serviceId: 6 — slugId: generalsurgery</li>
              <li>ონკოლოგია — serviceId: 7 — slugId: oncology</li>
              <li>ყბა-სახის ქირურგია — serviceId: 8 — slugId: maxillofacialsurgery</li>
              <li>ანგიოლოგია — serviceId: 9 — slugId: angiology</li>
              <li>ჰემატოლოგია — serviceId: 10 — slugId: hematology</li>
              <li>ენდოკრინოლოგია — serviceId: 11 — slugId: endokrinology</li>
              <li>პროქტოლოგია — serviceId: 12 — slugId: proctology</li>
              <li>თერაპია — serviceId: 13 — slugId: therapy</li>
              <li>პულმონოლოგია — serviceId: 14 — slugId: pulmonology</li>
              <li>ენდოსკოპია — serviceId: 15 — slugId: endoskopy</li>
              <li>ექოსკოპია — serviceId: 16 — slugId: echoscopy</li>
              <li>ამბულატორია — serviceId: 17 — slugId: ambulatory</li>
              <li>აივ ინფექციები — serviceId: 18 — slugId: aiv</li>
              <li>ბავშვთა ინფექციური — serviceId: 19 — slugId: childinfeqcy</li>
              <li>მოზრდ. ინფექციური — serviceId: 20 — slugId: infeqcy</li>
              <li>ბავშვთა ნევროლოგია — serviceId: 21 — slugId: childneiro</li>
              <li>ბავშვთა კარდიოლოგია - serviceId: 22 - slugId: childcardiology</li>
              <li>პედიატრია - serviceId: 23 - slugId: pediatry</li>
              <li>ლაბორატორია - serviceId: 24 - slugId: laboratory</li>
              <li>დიაგნოსტიკური დეპარტ. - serviceId: 25 - slugId: diagnostic</li>
              <li>რევმატოლოგია - serviceId: 26 - slugId: reumatology</li>
              <li>ტრავმატოლოგია - serviceId: 27 - slugId: traumatology</li>
              <li>ემერჯენსი - serviceId: 28 - slugId: emergency</li>
              <li>ანესთეზია-რეანიმატოლოგია - serviceId: 29 - slugId: anesthesia</li>
              <li>საოპერაციო ბლოკი - serviceId: 30 - slugId: operatingblock</li>
              <li>ბარიატრიული ქირურგია - serviceId: 31 - slugId: bariatricsurgery</li>
              <li>თორაკალური ქირურგია - serviceId: 32 - slugId: thoracicsurgery</li>
              <li>გასტროენტეროლოგია - serviceId: 33 - slugId: gastroenterology</li>
            </ul>
          </div>

          {/* Search + list */}
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ width: "100%", padding: "0.6rem", borderRadius: 5, border: "1px solid #ccc", marginBottom: "1rem" }}
          />

          <h3 style={{ marginBottom: "1rem" }}>{t("existingServices")}</h3>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {currentServices.map((s) => (
              <li key={s._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", backgroundColor: "#fff", padding: "0.5rem 1rem", borderRadius: 5, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div>{s.name?.[i18n.language]} ({s.slugId})</div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(s)} style={{ backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteService(s._id, s.publicId)} style={{ backgroundColor: "red", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer" }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{
                padding: "0.3rem 0.6rem", borderRadius: 5,
                border: currentPage === i + 1 ? "2px solid #EC7C19" : "1px solid #ccc",
                backgroundColor: currentPage === i + 1 ? "#EC7C19" : "#fff",
                color: currentPage === i + 1 ? "#fff" : "#000", cursor: "pointer"
              }}>{i + 1}</button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#EC7C19", textAlign: "center", marginBottom: "2rem" }}>
            {editingId ? t("editService") : t("addNewService")}
          </h2>
          <button onClick={() => router.back()} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", borderRadius: 5, backgroundColor: "#EC7C19", color: "#fff", border: "none", cursor: "pointer" }}>
            {t("უკან დაბრუნება")}
          </button>

          <div style={{ backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label>{t("slugId")}</label>
              <input type="text" name="slugId" value={form.slugId} onChange={handleChange} style={{ width: "100%", padding: "0.6rem", borderRadius: 5, border: "1px solid #ccc" }} />
            </div>

            {["ka", "en", "ru"].map((lang) => (
              <div key={lang} style={{ marginBottom: "1rem" }}>
                <label>{t("serviceName")} ({lang.toUpperCase()})</label>
                <input type="text" name="name" value={form.name[lang]} onChange={(e) => handleChange(e, lang)} style={{ width: "100%", padding: "0.6rem", borderRadius: 5, border: "1px solid #ccc" }} />
              </div>
            ))}

            <div style={{ marginBottom: "1rem" }}>
              <label>{t("serviceIcon")}</label>
              <input type="file" name="icon" accept="image/*" onChange={handleFileUpload} style={{ width: "100%" }} />
              {form.icon && <img src={form.icon} alt="icon" style={{ width: 50, height: 50, marginTop: 5 }} />}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={addService} style={{ flex: 1, padding: "0.6rem", borderRadius: 5, backgroundColor: "#EC7C19", color: "#fff", border: "none", cursor: "pointer" }}>
                {editingId ? t("update") : t("დამატება")}
              </button>
              {editingId && (
                <button onClick={cancelEdit} style={{ flex: 1, padding: "0.6rem", borderRadius: 5, backgroundColor: "#ccc", color: "#000", border: "none", cursor: "pointer" }}>
                  {t("cancel")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
