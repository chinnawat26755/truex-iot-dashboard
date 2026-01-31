'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name: username }), // ใช้ username เป็น name ไปเลย
    });
    if (res.ok) router.push('/login');
    else alert('Registration failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-4xl font-black text-red-600 italic tracking-tighter mb-2">TrueX</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Create New ID</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none text-slate-900 font-black transition-all placeholder:text-slate-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none text-slate-900 font-black transition-all placeholder:text-slate-400"
            required
          />
          <button className="w-full bg-red-600 text-white p-6 rounded-2xl font-black text-xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}