"use client";

import { adminLogin } from "@/lib/api/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      router.push("/admin/dashboard");
      toast.success("Login successful!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center mt-50 mb-20">
      <div className="w-full max-w-sm p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded cursor-pointer hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
