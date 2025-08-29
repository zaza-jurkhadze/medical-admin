"use client";

import { useState, useEffect } from "react";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const adminToken = localStorage.getItem("token");

  // Users fetch
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/list");
      const data = await res.json();
      setUsers(data); 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
 const handleCreate = async () => {
  const emailTrim = email.trim();
  const passwordTrim = password.trim();

  // Username regex: Latin letters, numbers, special symbols
  const usernameRegex = /^[a-zA-Z0-9@#._-]+$/;

  if (emailTrim.length < 6 || passwordTrim.length < 6) {
    setMessage("Username and password must be at least 6 characters long!");
    return;
  }

  if (!usernameRegex.test(emailTrim)) {
    setMessage("Username can only contain Latin letters, numbers and symbols (@ # . _ -)!");
    return;
  }

  const res = await fetch("/api/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emailTrim, password: passwordTrim, role, adminToken }),
  });
  const data = await res.json();
  if (data.success) {  
    setMessage("User created! ID: " + data.userId);
    setEmail(""); 
    setPassword(""); 
    setRole("user");
    fetchUsers();
  } else setMessage("Error: " + data.error);
};

  // Delete user
  const handleDelete = async (id, role) => {
    if (role === "admin") {
      alert("Admin user cannot be deleted!");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch("/api/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminToken }),
    });
    const data = await res.json();
    if (data.success) fetchUsers();
    else alert(data.error);
  };

  // Change password
  const handleChangePassword = async (id) => {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    const res = await fetch("/api/users/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, newPassword, adminToken }),
    });
    const data = await res.json();
    if (data.success) alert("Password updated!");
    else alert(data.error);
  };

  return (
    <div style={{ marginTop: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Create New User</h2>
      <input
        style={{ color: "#000", marginRight: "0.5rem" }}
        placeholder="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div style={{ display: "inline-block", position: "relative" }}>
        <input
          style={{ color: "#000", paddingRight: "2rem" }}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#555",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>
      <select style={{ color: "#000", marginLeft: "0.5rem" }} value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleCreate}
        style={{
          marginLeft: "0.5rem",
          backgroundColor: "#EC7C19",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        Create User
      </button>
      <p style={{ color: "red" }}>{message}</p>

      <h2 style={{ marginTop: "2rem" }}>Existing Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id} style={{ marginBottom: "0.5rem", color: "#000" }}>
            {u.email} ({u.role})
            <button
              onClick={() => handleDelete(u._id, u.role)}
              style={{
                marginLeft: "1rem",
                color: "red",
                cursor: u.role === "admin" ? "not-allowed" : "pointer",
              }}
              disabled={u.role === "admin"}
            >
              Delete
            </button>
            <button 
              onClick={() => handleChangePassword(u._id)}
              style={{ marginLeft: "0.5rem", color: "blue", cursor: "pointer" }}
            >
              Change Password
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}