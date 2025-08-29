"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDoctors() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  // ერთი ექიმის ფორმა
  const [form, setForm] = useState({
    serviceId: 1,
    slugId: "",
    doctorSlug: "",
    name: "",
    position: "",
    image: "",
    bio: "",
    experience: "",
    education: "",
  });

  // Bulk JSON
  const [bulkDoctorsJSON, setBulkDoctorsJSON] = useState(
    JSON.stringify(
      [
        {
          serviceId: ["6", "31"],
          slugId: ["generalsurgery", "bariatricsurgery"],
          doctorSlug: "",
          name: "",
          position: "",
          image: "/img/doctors/default.jpg",
          bio: "",
          experience: "",
          education: "",
        },
      ],
      null,
      2
    )
  );

  // Edit state
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Fetch doctors
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/doctors", { cache: "no-store" });
        if (!res.ok) throw new Error("ექიმების წამოღება ვერ მოხერხდა");
        const data = await res.json();
        const fixedData = data.map((d, index) => ({ id: d.id ?? index + 1, ...d }));
        setDoctors(fixedData);
      } catch (e) {
        console.error(e);
        alert("ვერ მოვიტანე ექიმები");
      }
    };
    load();
  }, []);

  const resetForm = () =>
    setForm({
      serviceId: 1,
      slugId: "",
      doctorSlug: "",
      name: "",
      position: "",
      image: "",
      bio: "",
      experience: "",
      education: "",
    });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "slugId") {
      setForm((prev) => ({ ...prev, [name]: value.toLowerCase().replace(/[^a-z]/g, "") }));
    } else if (name === "doctorSlug") {
      setForm((prev) => ({ ...prev, [name]: value.toLowerCase().replace(/[^a-z-]/g, "") }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // File upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-doctor-image", { method: "POST", body: fd });
      if (!res.ok) throw new Error("ფაილის ატვირთვა ვერ მოხერხდა");
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.imagePath || "/img/doctors/default.jpg" }));
    } catch (err) {
      console.error(err);
      alert("ფაილის ატვირთვა ვერ მოხერხდა");
    }
  };

  // File upload for Edit
  const handleFileUploadForEdit = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingDoctor) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-doctor-image", { method: "POST", body: fd });
      if (!res.ok) throw new Error("ფაილის ატვირთვა ვერ მოხერხდა");
      const data = await res.json();
      setEditingDoctor(prev => ({ ...prev, image: data.imagePath || "/img/doctors/default.jpg" }));
    } catch (err) {
      console.error(err);
      alert("ფაილის ატვირთვა ვერ მოხერხდა");
    }
  };

  const validate = (doctorData) => {
    const required = ["serviceId", "slugId", "doctorSlug", "name", "position"];
    for (const field of required) {
      if (!doctorData[field] && doctorData[field] !== 0) {
        alert(`გთხოვთ შეავსოთ ველი: ${field}`);
        return false;
      }
    }
    if (!doctorData.doctorSlug.includes("-")) {
      alert("Doctor Slug უნდა შეიცავდეს მინიმუმ ერთ ტირეს (-)");
      return false;
    }
    return true;
  };

  // ერთეული დამატება
  const addDoctor = async () => {
    if (!validate(form)) return;
    setLoading(true);
    try {
      const maxId = doctors.length ? Math.max(...doctors.map((d) => d.id || 0)) : 0;
      const payload = { ...form, id: maxId + 1, image: form.image || "/img/doctors/default.jpg" };
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("ექიმის დამატება ვერ მოხერხდა");
      const saved = await res.json();
      setDoctors((prev) => [...prev, { ...saved, id: payload.id }]);
      resetForm();
    } catch (e) {
      console.error(e);
      alert("ვერ შევძელი დამატება");
    } finally {
      setLoading(false);
    }
  };

  // Mass add
  const addDoctorsArray = async (doctorsArray) => {
    for (const doc of doctorsArray) {
      if (!validate(doc)) return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorsArray),
      });
      if (!res.ok) throw new Error("ექიმების დამატება ვერ მოხერხდა");
      const saved = await res.json();
      setDoctors((prev) => [...prev, ...saved]);
      setBulkDoctorsJSON(
        JSON.stringify(
          [
            {
              name: "",
              doctorSlug: "",
              position: "",
              bio: "",
              education: "",
              experience: "",
              serviceId: ["6", "31"],
              slugId: ["generalsurgery", "bariatricsurgery"],
              image: "/img/doctors/default.jpg",
            },
          ],
          null,
          2
        )
      );
    } catch (e) {
      console.error(e);
      alert("ვერ შევძელი ექიმების დამატება მასიურად");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (_id) => {
    if (!confirm("დარწმუნებული ხარ, რომ გინდა ექიმის წაშლა?")) return;
    try {
      const res = await fetch(`/api/doctors?_id=${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("წაშლა ვერ მოხერხდა");
      setDoctors((prev) => prev.filter((d) => d._id !== _id));
    } catch (e) {
      console.error(e);
      alert("ვერ შევძელი წაშლა");
    }
  };

  // --- Edit functions ---
  const handleEditClick = (doctor) => {
    setEditingDoctor({ ...doctor });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateDoctor = async () => {
    if (!editingDoctor) return;
    if (!validate(editingDoctor)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/doctors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDoctor),
      });
      if (!res.ok) throw new Error("ექიმის განახლება ვერ მოხერხდა");
      const updated = await res.json();
      setDoctors((prev) =>
        prev.map((d) => (d._id === updated._id ? { ...updated } : d))
      );
      setEditingDoctor(null);
      resetForm();
    } catch (e) {
      console.error(e);
      alert("ვერ შევძელი ექიმის განახლება");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.slugId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", gap: "2rem", padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif", color: "#000" }}>
        <div style={{ flex: 3 }}>
          <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#EC7C19" }}>Admin Panel - Doctors</h1>

          <button onClick={() => router.push("/dashboard")} style={{ marginBottom: 20, padding: "6px 12px", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            უკან დაბრუნება
          </button>

          {/* --- ერთი ექიმის ფორმა --- */}
          <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem", backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            {["serviceId", "slugId", "doctorSlug", "name", "position", "image", "bio", "experience", "education"].map((fieldName) => (
              <div key={fieldName}>
                <label style={{ fontWeight: "bold", color: "#000" }}>{fieldName}</label>
                {fieldName === "image" ? (
                  <>
                    <input type="file" accept="image/*" onChange={editingDoctor ? handleFileUploadForEdit : handleFileUpload} style={{ display: "block", marginTop: "0.2rem" }} />
                    <img
                      src={editingDoctor ? (editingDoctor.image || "/img/doctors/default.jpg") : (form.image || "/img/doctors/default.jpg")}
                      alt="preview"
                      style={{ width: "60px", height: "60px", borderRadius: "50%", marginTop: "0.3rem", objectFit: "cover" }}
                    />
                  </>
                ) : (
                  <input
                    name={fieldName}
                    type="text"
                    value={editingDoctor ? editingDoctor[fieldName] : form[fieldName]}
                    onChange={(e) => editingDoctor ? setEditingDoctor({ ...editingDoctor, [fieldName]: e.target.value }) : handleChange(e)}
                    style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc", width: "100%", marginTop: "0.2rem" }}
                  />
                )}
              </div>
            ))}
            {editingDoctor ? (
              <button onClick={updateDoctor} disabled={loading} style={{ padding: "0.7rem", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "1rem", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Updating..." : "Update Doctor"}
              </button>
            ) : (
              <button onClick={addDoctor} disabled={loading} style={{ padding: "0.7rem", backgroundColor: "#EC7C19", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "1rem", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : "Add Doctor"}
              </button>
            )}
          </div>

          {/* --- Bulk JSON Input --- */}
          <div style={{ marginBottom: "2rem", backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: 6 }}>
            <label style={{ fontWeight: "bold" }}>ექიმის დამატება როცა ერთზე მეტი სერვისი აქვს (JSON)</label>

            <textarea
              value={bulkDoctorsJSON}
              onChange={(e) => setBulkDoctorsJSON(e.target.value)}
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "0.5rem",
                marginTop: "0.5rem",
                fontFamily: "monospace",
              }}
            />

            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>სურათის ატვირთვა</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;

                  const uploadedPaths = [];
                  for (const file of files) {
                    const fd = new FormData();
                    fd.append("file", file);
                    try {
                      const res = await fetch("/api/upload-doctor-image", {
                        method: "POST",
                        body: fd,
                      });
                      if (res.ok) {
                        const data = await res.json();
                        uploadedPaths.push(data.imagePath || "/img/doctors/default.jpg");
                      }
                    } catch (err) {
                      console.error("სურათის ატვირთვა ვერ მოხერხდა", err);
                    }
                  }

                  try {
                    let arr = JSON.parse(bulkDoctorsJSON);
                    if (Array.isArray(arr)) {
                      arr = arr.map((doc, i) => ({
                        ...doc,
                        image: uploadedPaths[i] || doc.image || "/img/doctors/default.jpg",
                      }));
                      setBulkDoctorsJSON(JSON.stringify(arr, null, 2));
                    }
                  } catch {
                    alert("ჯერ სწორად შეიყვანე JSON");
                  }
                }}
              />
            </div>

            <button
              onClick={() => {
                try {
                  const arr = JSON.parse(bulkDoctorsJSON);
                  addDoctorsArray(arr);
                } catch (e) {
                  alert("გთხოვთ შეიყვანოთ სწორი JSON ფორმატი");
                }
              }}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 1rem",
                backgroundColor: "#EC7C19",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              დამატება
            </button>
          </div>

          {/* --- Search --- */}
          <input
            type="text"
            placeholder="ძებნა: სახელი, პოზიცია, slugId..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: 5, border: "1px solid #ccc" }}
          />

          {/* --- Current doctors list --- */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {currentDoctors.map((d) => (
              <li key={d._id || d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem", borderBottom: "1px solid #eee", borderRadius: "5px", marginBottom: "0.5rem", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#000" }}>
                  <img src={d.image || "/img/doctors/default.jpg"} alt={d.name} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <strong>{d.name}</strong> ({d.position})<br />
                    Service ID: {Array.isArray(d.serviceId) ? d.serviceId.join(", ") : d.serviceId}<br />
                    Slug ID: {Array.isArray(d.slugId) ? d.slugId.join(", ") : d.slugId}<br />
                    ID: {d.id}<br />
                    {d.bio && <em>{d.bio}</em>}<br />
                    {d.experience && <span>{d.experience}</span>}<br />
                    {d.education && <span>{d.education}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button onClick={() => handleEditClick(d)} style={{ backgroundColor: "#3498db", color: "#fff", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteDoctor(d._id)} style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "0.3rem 0.6rem", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button key={num} onClick={() => paginate(num)} style={{ padding: "0.4rem 0.8rem", borderRadius: 4, border: currentPage === num ? "2px solid #EC7C19" : "1px solid #ccc", backgroundColor: currentPage === num ? "#EC7C19" : "#fff", color: currentPage === num ? "#fff" : "#000", cursor: "pointer" }}>
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* --- Services side panel --- */}
        <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem", color: "#EC7C19" }}>Services Info / Help</h3>
          <p style={{ fontSize: "0.9rem" }}>ყველა ექიმი უნდა მიეთითოს სწორი serviceId და slugId. ერთზე მეტი serviceId შეიყვანეთ JSON-ში როგორც მასივში. თითოეული ექიმი უნდა ჰქონდეს უნიკალური doctorSlug. სურათის ატვირთვა შესაძლებელია თითოეული ექიმისთვის ცალ-ცალკე ან მასიურად.</p>
          <h3 style={{ color: "#EC7C19", marginBottom: "1rem" }}>სერვისების ჩამონათვალი (slugId და serviceId)</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li>კარდიოლოგი — serviceId: 1 - slugId: kardiology</li>
              <li>ნევროლოგი — serviceId: 2 - slugId: neurology</li>
              <li>ნეიროქირურგი - serviceId: 3 - slugId:  neirosurgery</li>
              <li>გინეკოლოგი - serviceId: 4 — slugId: gynecology</li>
              <li>უროლოგი — serviceId: 5 — slugId: urology</li>
              <li>ქირურგა — serviceId: 6 — slugId: generalsurgery</li>
              <li>ონკოლოგი — serviceId: 7 — slugId: oncology</li>
              <li>ყბა-სახის ქირურგი — serviceId: 8 — slugId: maxillofacialsurgery</li>
              <li>ანგიოლოგი — serviceId: 9 — slugId: angiology</li>
              <li>ჰემატოლოგი — 10 — slugId: hematology</li>
              <li>ენდოკრინოლოგი — serviceId: 11 — slugId: endokrinology</li>
              <li>პროქტოლოგი — serviceId: 12 — slugId: proctology</li>
              <li>თერაპი — serviceId: 13 — slugId: therapy</li>
              <li>პულმონოლოგი — serviceId: 14 — slugId: pulmonology</li>
              <li>ენდოსკოპი — serviceId: 15 — slugId: endoskopy</li>
              <li>ექოსკოპი — serviceId: 16 — slugId: echoscopy</li>
              <li>ამბულატორი — serviceId: 17 — slugId: ambulatory</li>
              <li>აივ ინფექციები — serviceId: 18 — slugId: aiv</li>
              <li>ბავშვთა ინფექციური — serviceId: 19 — slugId: childinfeqcy</li>
              <li>მოზრდ. ინფექციური — serviceId: 20 — slugId:infeqcy</li>
              <li>ბავშვთა ნევროლოგი — serviceId: 21 — slugId:childneiro</li>
              <li>ბავშვთა კარდიოლოგი - serviceId: 22.  slugId: childcardiology</li>
              <li>პედიატრი - serviceId: 23.  slugId: pediatry</li>
              <li>ლაბორატორია - serviceId: 24.  slugId: laboratory</li>
              <li>დიაგნოსტიკური დეპარტ. - serviceId: 25.  slugId: diagnostic</li>
              <li>რევმატოლოგია - serviceId: 26.  slugId: reumatology</li>
              <li>ტრავმატოლოგი - serviceId: 27.  slugId: traumatology</li>
              <li>ემერჯენსი - serviceId: 28.  slugId: emergency</li>
              <li>ანესთეზია-რეანიმატოლოგია - serviceId: 29.  slugId: anesthesia</li>
              <li>საოპერაციო ბლოკი - serviceId: 30.  slugId: operatingblock</li>
              <li>ბარიატრიული ქირურგია - serviceId: 31.  slugId: bariatricsurgery</li>
              <li>თორაკალური ქირურგია - serviceId: 32.  slugId: thoracicsurgery</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
