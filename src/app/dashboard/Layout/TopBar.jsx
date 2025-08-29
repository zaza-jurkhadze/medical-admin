"use client";

import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", backgroundColor: "#EC7C19", color: "#fff" }}>
      <button onClick={handleBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
        ← Back
      </button>
      <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}