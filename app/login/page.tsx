'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('userName', data.user.name);
      router.push('/dashboard');
    } else {
      alert("อีเมลหรือรหัสผ่านผิด!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h1 className="text-4xl font-black text-red-600 mb-8 text-center italic tracking-tighter">TrueX</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500" onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500" onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="w-full bg-red-600 text-white p-4 rounded-xl font-bold mt-8 hover:bg-red-700 shadow-lg shadow-red-200">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
}