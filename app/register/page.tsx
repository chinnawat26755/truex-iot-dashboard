'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ!");
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={handleRegister} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-3xl font-black text-red-600 mb-8 text-center italic">TrueX Register</h1>
        <div className="space-y-4">
          <input type="text" placeholder="ชื่อของคุณ" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="อีเมล" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="รหัสผ่าน" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-2xl font-bold mt-8 hover:bg-red-700 transition-all shadow-lg shadow-red-200">สร้างบัญชีผู้ใช้</button>
      </form>
    </div>
  );
}