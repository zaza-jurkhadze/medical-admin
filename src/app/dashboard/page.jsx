"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AddUser from "./AddUser";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!user) return null;

  return (
    <div style={pageContainer}>
      <header style={headerStyle}>
        <h1 style={{ color: "#EC7C19", fontSize: "2rem" }}>Dashboard</h1>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </header>

      <section style={sectionStyle}>
        <h2>Welcome, {user.role === "admin" ? "Admin" : "User"}!</h2>
        <p style={{color:"#555"}}>Manage your data:</p>

        <div style={buttonGroupStyle}>
          {user.role === "admin" && (
            <button
              style={adminButtonStyle}
              onClick={() => setShowAddUser(!showAddUser)}
            >
              {showAddUser ? "Close User" : "Users"}
            </button>
          )}

          <button
            style={blueButtonStyle}
            onClick={() => router.push("/admin/doctors")}
          >
            Doctors
          </button>
          <button
            style={greenButtonStyle}
            onClick={() => router.push("/admin/news")}
          >
            News
          </button>
          <button
            style={purpleButtonStyle}
            onClick={() => router.push("/admin/servicesDetails")}
          >
            ServiceDetails
          </button>
                  <button
            style={orangeButtonStyle}
            onClick={() => router.push("/admin/servicesData")}
          >
            services
          </button>
          
        </div>

        {showAddUser && <AddUser />}
      </section>
    </div>
  );
}

const pageContainer = {
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
  maxWidth: "900px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};

const sectionStyle = {
  textAlign: "center",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "1.5rem",
  flexWrap: "wrap",
};

const baseButtonStyle = {
  color: "#fff",
  border: "none",
  padding: "0.7rem 1.5rem",
  cursor: "pointer",
  borderRadius: "5px",
  fontWeight: "bold",
  minWidth: "140px",
  transition: "background 0.2s",
};

const adminButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#EC7C19", // ნარინჯისფერი
};

const blueButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#0275d8", // ლურჯი
};

const greenButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#5cb85c", // მწვანე
};

const purpleButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#6f42c1", // იასამნისფერი
};

const logoutButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#d9534f", // წითელი
};
const orangeButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#FF8C00", // ნარინჯისფერი
};