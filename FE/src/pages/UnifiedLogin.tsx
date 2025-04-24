import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function UnifiedLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, { email, password });
      const { access_token, role } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      navigate(role === "admin" ? "/admin/dashboard" : "/tenant/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 rounded w-80"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded w-80"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-80">
        Login
      </button>
    </form>
  );
}
