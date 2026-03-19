"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import API_URL from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("company") // default role
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Signup failed")
        return
      }
      router.push("/auth/login")
    } catch {
      setError("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-orange-600 text-center">Signup</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border p-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded-md"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="company">Company</option>
          <option value="university">University</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}
