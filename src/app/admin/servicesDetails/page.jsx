"use client";
import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const ALL_SERVICES = [
  { serviceId: 1, slugId: "kardiology", name: "კარდიოლოგია" },
  { serviceId: 2, slugId: "neurology", name: "ნევროლოგია" },
  { serviceId: 3, slugId: "neirosurgery", name: "ნეიროქირურგია" },
  { serviceId: 4, slugId: "gynecology", name: "გინეკოლოგია" },
  { serviceId: 5, slugId: "urology", name: "უროლოგია" },
  { serviceId: 6, slugId: "generalsurgery", name: "ქირურგია" },
  { serviceId: 7, slugId: "oncology", name: "ონკოლოგია" },
  { serviceId: 8, slugId: "maxillofacialsurgery", name: "ყბა-სახის ქირურგია" },
  { serviceId: 9, slugId: "angiology", name: "ანგიოლოგია" },
  { serviceId: 10, slugId: "hematology", name: "ჰემატოლოგია" },
  { serviceId: 11, slugId: "endokrinology", name: "ენდოკრინოლოგია" },
  { serviceId: 12, slugId: "proctology", name: "პროქტოლოგია" },
  { serviceId: 13, slugId: "therapy", name: "თერაპიაა" },
  { serviceId: 14, slugId: "pulmonology", name: "პულმონოლოგია" },
  { serviceId: 15, slugId: "endoskopy", name: "ენდოსკოპია" },
  { serviceId: 16, slugId: "echoscopy", name: "ექოსკოპია" },
  { serviceId: 17, slugId: "ambulatory", name: "ამბულატორია" },
  { serviceId: 18, slugId: "aiv", name: "აივ ინფექციებია" },
  { serviceId: 19, slugId: "childinfeqcy", name: "ბავშვთა ინფექციურია" },
  { serviceId: 20, slugId: "infeqcy", name: "მოზრდ. ინფექციური" },
  { serviceId: 21, slugId: "childneiro", name: "ბავშვთა ნევროლოგია" },
  { serviceId: 22, slugId: "childcardiology", name: "ბავშვთა კარდიოლოგია" },
  { serviceId: 23, slugId: "pediatry", name: "პედიატრია" },
  { serviceId: 24, slugId: "laboratory", name: "ლაბორატორია" },
  { serviceId: 25, slugId: "diagnostic", name: "დიაგნოსტიკური დეპარტ." },
  { serviceId: 26, slugId: "reumatology", name: "რევმატოლოგია" },
  { serviceId: 27, slugId: "traumatology", name: "ტრავმატოლოგია" },
  { serviceId: 28, slugId: "emergency", name: "ემერჯენსი"},
  { serviceId: 29, slugId: "anesthesia", name: "ანესთეზია-რეანიმატოლოგია"},
  { serviceId: 30, slugId: "operatingblock", name: "საოპერაციო ბლოკი"},
  { serviceId: 31, slugId: "bariatricsurgery", name: "ბარიატრიული ქირურგია"},
  { serviceId: 32, slugId: "thoracicsurgery", name: "თორაკალური ქირურგია"},
];

export default function AdminServiceDetails() {
  const router = useRouter();
  const [form, setForm] = useState({
    slugId: "",
    name: "",
    image: "",
    generalDescription: "",
    symptoms: "",
    ourApproach: "",
  });
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const ITEMS_PER_PAGE = 5;

  // --- Fetch services ---
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/servicesDetails");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- Input change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slugId") {
      setForm(prev => ({ ...prev, slugId: value.toLowerCase().replace(/[^a-z0-9@#\-]/g, "") }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- File upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-servicesDetails-image", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm(prev => ({ ...prev, image: data.imagePath }));
    } else {
      alert("ფაილის ატვირთვა ვერ მოხერხდა");
    }
  };

  // --- Add or Update service ---
  const saveService = async () => {
    if (!form.slugId || !form.name) return alert("შეავსეთ slugId და Name");

    if (editingServiceId) {
      // Update existing
      const res = await fetch(`/api/servicesDetails?_id=${editingServiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return alert("განახლების შეცდომა");
      const updated = await res.json();
      setServices(prev => prev.map(s => (s._id === editingServiceId ? updated : s)));
      setEditingServiceId(null);
    } else {
      // Add new
      const newService = {
        ...form,
        id: services.length ? Math.max(...services.map(s => s.id || 0)) + 1 : 1,
      };
      const res = await fetch("/api/servicesDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });
      if (!res.ok) return alert("დაფიქსირდა შეცდომა");
      const saved = await res.json();
      setServices(prev => [...prev, saved]);
    }

    // Reset form
    setForm({
      slugId: "",
      name: "",
      image: "",
      generalDescription: "",
      symptoms: "",
      ourApproach: "",
    });
  };

  // --- Delete service ---
  const deleteService = async (id) => {
    if (!confirm("დარწმუნებული ხართ რომ გსურთ წაშლა?")) return;

    const res = await fetch(`/api/servicesDetails?_id=${id}`, { method: "DELETE" });
    if (!res.ok) return alert("წაშლის შეცდომა");
    setServices(prev => prev.filter(s => (s._id || s.id) !== id));
  };

  // --- Filter + Pagination ---
  const filteredServices = useMemo(() => {
    return services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [services, search]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- Styles ---
  const inputStyle = { width: "100%", padding: "0.6rem", borderRadius: 5, border: "1px solid #ccc", fontSize: 14 };
  const textareaStyle = { ...inputStyle, minHeight: "80px", resize: "vertical" };
  const buttonStyle = { padding: "0.5rem 1rem", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold", marginTop: "0.5rem" };

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#EC7C19", textAlign: "center", marginBottom: "2rem" }}>Admin Service Details</h2>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* სერვისების ჩამონათვალი */}
          <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: 8, color: "#000" }}>
            <h3 style={{ color: "#EC7C19" }}>Services List</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {ALL_SERVICES.map(s => (
                <li key={s.serviceId}>{s.name} — serviceId: {s.serviceId} — slugId: {s.slugId}</li>
              ))}
            </ul>
          </div>

          {/* სერვისის ფორმა */}
          <div style={{ flex: 1, backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: 8, color: "#000" }}>
            <h3 style={{ color: "#EC7C19" }}>{editingServiceId ? "Edit Service" : "Add New Service"}</h3>
            <button
              onClick={() => router.back()}
              style={{ display: "inline-block", marginTop: "1.5rem", marginBottom:"1.5rem", padding: "0.5rem 1rem", borderRadius: 5, border: "none", cursor: "pointer", backgroundColor: "#EC7C19", color: "#fff", fontWeight: "bold" }}
            >
              უკან დაბრუნება
            </button>
            <input type="text" name="slugId" value={form.slugId} onChange={handleChange} placeholder="Slug ID" style={inputStyle} />
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Service Name" style={{...inputStyle, marginTop:"0.5rem"}} />
            <textarea name="generalDescription" value={form.generalDescription} onChange={handleChange} placeholder="General Description-ზოგადი აღწერა" style={{...textareaStyle, marginTop:"0.5rem"}} />
            <textarea name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Symptoms-სიმპტომები" style={{...textareaStyle, marginTop:"0.5rem"}} />
            <textarea name="ourApproach" value={form.ourApproach} onChange={handleChange} placeholder="Our Approach-ჩვენი მიდგომები" style={{...textareaStyle, marginTop:"0.5rem"}} />
            <input type="file" onChange={handleFileUpload} style={{ marginTop: "0.5rem" }} />
            {form.image && <img src={form.image} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 5, marginTop: 5 }} />}
            <button onClick={saveService} style={buttonStyle}>{editingServiceId ? "Update Service" : "Add Service"}</button>
          </div>
        </div>

        {/* ძებნა */}
        <div style={{ marginTop: "2rem", color: "#000" }}>
          <input type="text" placeholder="მოძებნე სერვისი..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={inputStyle} />
        </div>

        {/* არსებული სერვისები */}
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {paginatedServices.map(s => (
            <li key={s._id || s.id} style={{ display: "flex", color: "#000", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "0.5rem 1rem", borderRadius: 5, marginBottom: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src={s.image || "/img/servicesDetails/default.jpg"} alt={s.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 5 }} />
                <span>{s.name} ({s.slugId})</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => {
                  setEditingServiceId(s._id || s.id);
                  setForm({
                    slugId: s.slugId,
                    name: s.name,
                    image: s.image,
                    generalDescription: s.generalDescription,
                    symptoms: s.symptoms,
                    ourApproach: s.ourApproach,
                  });
                }} style={{ backgroundColor: "blue", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer", fontWeight: "bold" }}>Edit</button>
                <button onClick={() => deleteService(s._id || s.id)} style={{ backgroundColor: "red", color: "#fff", border: "none", borderRadius: 5, padding: "0.3rem 0.8rem", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i+1)} style={{ padding: "0.3rem 0.8rem", backgroundColor: page === i+1 ? "#EC7C19" : "#eee", color: page === i+1 ? "#fff" : "#000", border: "none", borderRadius: 5, cursor: "pointer" }}>{i+1}</button>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}