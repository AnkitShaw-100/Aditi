import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { ADMIN_DASHBOARD_PATH } from "@/lib/adminRoutes";

const LEGACY_ADMIN_TOKEN_KEY = "aditi_admin_token";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin login failed");
      }

      localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      navigate(ADMIN_DASHBOARD_PATH);
    } catch (error) {
      setMessage(error.message);
      setStatus("error");
    }
  }

  return (
    <section className="account-page min-h-screen px-4 pb-16 pt-28 md:px-8">
      <div className="account-panel mx-auto max-w-md p-6 md:p-8">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Admin Login
        </p>
        <h1 className="mt-3 font-rajdhani text-4xl font-bold leading-none text-chalk">
          Open the dashboard.
        </h1>
        <p className="mt-4 font-plex text-sm leading-7 text-ash">
          Use the admin credential stored in the backend database.
        </p>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="account-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="account-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="final-button mt-2 h-11 rounded-none px-6 font-rajdhani text-base font-bold"
          >
            <LockKeyhole className="size-4" />
            {status === "loading" ? "Checking" : "Login"}
          </Button>

          {message ? <p className="font-plex text-sm text-ember">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
