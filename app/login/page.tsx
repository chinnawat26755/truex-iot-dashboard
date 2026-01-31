'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('userName', data.user.name || data.user.username);
      router.push('/dashboard');
    } else {
      alert('Login failed: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden text-slate-900">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <h1 className="text-5xl font-black text-red-600 italic tracking-tighter mb-2">TrueX</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Admin Access Only</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button className="w-full bg-red-600 text-white p-6 rounded-2xl font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 active:scale-95 transition-all mt-6">
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
}