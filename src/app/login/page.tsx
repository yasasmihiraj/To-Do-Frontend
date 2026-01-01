"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);

    router.push("/tasks");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-96 p-6 shadow rounded">
        <h1 className="text-2xl mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input mt-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn mt-4 w-full">Login</button>
      </form>
    </div>
  );
}
