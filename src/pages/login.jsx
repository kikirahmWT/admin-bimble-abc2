import { useState } from "react";
import { auth } from "../firebase"; // hanya ini yang diimpor

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password); 
      onLogin();
    } catch (err) {
      setError("Email atau password salah.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email); 
      setResetSent(true);
    } catch (err) {
      setError("Gagal mengirim link reset. Coba lagi.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Admin</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {resetSent && (
        <p style={{ color: "green" }}>Link reset dikirim ke email.</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
      />

      <input
        type="password"
        placeholder="Kata Sandi"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      <button type="submit">Masuk</button>

      <button
        type="button"
        onClick={handleForgotPassword}
        style={{
          marginTop: "10px",
          background: "none",
          border: "none",
          color: "#4BA3E3",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Lupa Password?
      </button>
    </form>
  );
}
