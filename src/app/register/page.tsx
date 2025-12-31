"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({name, email, password}),
        });

        router.push("/login");
    }

    return(
        <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="w-96 p-6 shadow rounded">
        <h1 className="text-2xl mb-4">Register</h1>

        <input className="input" placeholder="Name" onChange={e => setName(e.target.value)} />
        <input className="input mt-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="input mt-2" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />

        <button className="btn mt-4 w-full">Register</button>
      </form>
    </div>
    );
}