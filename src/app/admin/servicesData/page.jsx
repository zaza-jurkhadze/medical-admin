"use client";
import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function AdminServicesIcons() {
  const router = useRouter();
  const [form, setForm] = useState({ slugId: "", name: "", icon: "" });
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slugId") {
      setForm(prev => ({ ...prev, slugId: value.toLowerCase().replace(/[^a-z-]/g, "") }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-service-icon", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm(prev => ({ ...prev, icon: data.imagePath }));
    } else {
      alert("ფაილის ატვირთვა ვერ მოხერხდა");
    }
  };

  const addService = async () => {
    if (!form.slugId || !form.name) return alert("შეავსეთ slugId და Name");

    if (editingId) {
      // Update existing service
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
      // Add new service
      const res = await fetch("/api/servicesData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return alert("დაფიქსირდა შეცდომა დამატების დროს");
      const saved = await res.json();
      setServices(prev => [...prev, saved]);
    }

    setForm({ slugId: "", name: "", icon: "" });
  };

  const deleteService = async (id) => {
    if (!confirm("დარწმუნებული ხართ რომ გსურთ წაშლა?")) return;

    try {
      const res = await fetch(`/api/servicesData?_id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices(prev => prev.filter(s => (s._id || s.id) !== id));
      } else {
        const data = await res.json();
        alert("წაშლის შეცდომა: " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("წაშლის დროს მოხდა შეცდომა");
    }
  };

  const startEdit = (service) => {
    setForm({ slugId: service.slugId, name: service.name, icon: service.icon });
    setEditingId(service._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ slugId: "", name: "", icon: "" });
    setEditingId(null);
  };

  // Filtering and pagination
  const filteredServices = useMemo(() => {
    return services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [services, search]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const inputContainerStyle = { marginBottom: "1rem" };
  const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "0.3rem", color: "#333" };
  const inputStyle = { width: "100%", padding: "0.6rem", borderRadius: 5, border: "1px solid #ccc", color: "#222", fontSize: 14 };
  const buttonStyle = { display: "block", margin: "1rem 0", padding: "0.6rem 1.2rem", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold" };

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        {/* Services list - მარჯვენა */}
        <div style={{ flex: 1 }}>
          <div style={{ flex: "0 0 500px", padding: "1rem", backgroundColor: "#f9f9f9",color: "#555", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", height: "fit-content", marginBottom: "2rem" }}>
            <h3 style={{ color: "#EC7C19", marginBottom: "1rem" }}>სერვისების ჩამონათვალი (slugId და serviceId)</h3>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li>კარდიოლოგია — serviceId: 1 - slugId: kardiology</li>
              <li>ნევროლოგია — serviceId: 2 - slugId: neurology</li>
              <li>ნეიროქირურგია - serviceId: 3 - slugId:  neirosurgery</li>
              <li>გინეკოლოგია -serviceId: 4 — slugId: gynecology</li>
              <li>უროლოგია — serviceId: 5 — slugId: urology</li>
              <li>ქირურგია — serviceId: 6 — slugId: generalsurgery</li>
              <li>ონკოლოგია — serviceId: 7 — slugId: oncology</li>
              <li>ყბა-სახის ქირურგია — serviceId: 8 — slugId: maxillofacialsurgery</li>
              <li>ანგიოლოგია — serviceId: 9 — slugId: angiology</li>
              <li>ჰემატოლოგია — 10 — slugId: hematology</li>
              <li>ენდოკრინოლოგია — serviceId: 11 — slugId: endokrinology</li>
              <li>პროქტოლოგია — serviceId: 12 — slugId: proctology</li>
              <li>თერაპია — serviceId: 13 — slugId: therapy</li>
              <li>პულმონოლოგია — serviceId: 14 — slugId: pulmonology</li>
              <li>ენდოსკოპია — serviceId: 15 — slugId: endoskopy</li>
              <li>ექოსკოპია — serviceId: 16 — slugId: echoscopy</li>
              <li>ამბულატორია — serviceId: 17 — slugId: ambulatory</li>
              <li>აივ ინფექციები — serviceId: 18 — slugId: aiv</li>
              <li>ბავშვთა ინფექციური — serviceId: 19 — slugId: childinfeqcy</li>
              <li>მოზრდ. ინფექციური — serviceId: 20 — slugId:infeqcy</li>
              <li>ბავშვთა ნევროლოგია — serviceId: 21 — slugId:childneiro</li>
              <li>ბავშვთა კარდიოლოგია - serviceId: 22.  slugId: childcardiology</li>
              <li>პედიატრია - serviceId: 23.  slugId: pediatry</li>
              <li>ლაბორატორია - serviceId: 24.  slugId: laboratory</li>
              <li>დიაგნოსტიკური დეპარტ. - serviceId: 25.  slugId: diagnostic</li>
              <li>რევმატოლოგია - serviceId: 26.  slugId: reumatology</li>
              <li>ტრავმატოლოგია - serviceId: 27.  slugId: traumatology</li>
              <li>ემერჯენსი - serviceId: 28.  slugId: emergency</li>
              <li>ანესთეზია-რეანიმატოლოგია - serviceId: 29.  slugId: anesthesia</li>
              <li>საოპერაციო ბლოკი - serviceId: 30.  slugId: operatingblock</li>
              <li>ბარიატრიული ქირურგია - serviceId: 31.  slugId: bariatricsurgery</li>
              <li>თორაკალური ქირურგია - serviceId: 32.  slugId: thoracicsurgery</li>
            </ul>
          </div>

          <input type="text" placeholder="ძებნა..." value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1);}} style={{...inputStyle, marginBottom: "1rem"}} />

          <h3 style={{ marginBottom: "1rem", color: "#000" }}>არსებული სერვისები</h3>
          <ul style={{ padding: 0, listStyle: "none", color: "#000" }}>
            {currentServices.map(s => (
              <li key={s._id || s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", backgroundColor: "#fff", padding: "0.5rem 1rem", borderRadius: 5, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={s.icon || "/img/icons/default.png"} alt={s.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 5 }} />
                  <span>{s.name} ({s.slugId})</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(s)} style={{ backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer", fontWeight: "bold" }}>edit</button>
                  <button onClick={() => deleteService(s._id || s.id)} style={{ backgroundColor: "red", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer", fontWeight: "bold" }}>delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                onClick={() => setCurrentPage(i+1)}
                style={{
                  padding: "0.3rem 0.6rem",
                  borderRadius: 5,
                  border: currentPage === i+1 ? "2px solid #EC7C19" : "1px solid #ccc",
                  backgroundColor: currentPage === i+1 ? "#EC7C19" : "#fff",
                  color: currentPage === i+1 ? "#fff" : "#000",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>

        {/* Form - მარჯვენა */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#EC7C19", textAlign: "center", marginBottom: "2rem" }}>{editingId ? "Edit Service" : "Add New Service"}</h2>
          <button
            onClick={() => router.back()}
            style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.5rem 1rem", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: "#EC7C19", color: "#fff", fontWeight: "bold" }}
          >
            უკან დაბრუნება
          </button>
          <div style={{ backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Slug ID (მაგ: kardiology)</label>
              <input type="text" name="slugId" value={form.slugId} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Service Name (მაგ: კარდიოლოგია)</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle}>Service Icon (აირჩიეთ ფაილი)</label>
              <input type="file" name="icon" onChange={handleFileUpload} style={{ display: "block", color: "#000" }} />
              {form.icon && <img src={form.icon} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 5, marginTop: 5 }} />}
            </div>

            <button onClick={addService} style={buttonStyle}>{editingId ? "Update Service" : "Add Service"}</button>
            {editingId && (
              <button onClick={cancelEdit} style={{ ...buttonStyle, backgroundColor: "#aaa", marginTop: "0.5rem" }}>Cancel</button>
            )}
          </div>

       
        </div>
      </div>
    </ProtectedRoute>
  );
}