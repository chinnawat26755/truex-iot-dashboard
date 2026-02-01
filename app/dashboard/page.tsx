'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [name, setName] = useState("");
  const [aqi, setAqi] = useState(0); 
  const [aiAdvice, setAiAdvice] = useState("กดปุ่มด้านล่างเพื่อให้ TrueX AI เริ่มวิเคราะห์ข้อมูลครับ");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: "--", desc: "Loading...", city: "Searching..." });
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setName(localStorage.getItem('userName') || "User");
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchData = async (lat: number, lon: number) => {
      try {
        const [wRes, aRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=09877d3354adce4648b6a4c92a8d397b`),
          fetch(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=29e298ea-da23-4bc1-9a3f-6739c119f466`)
        ]);

        const wData = await wRes.json();
        const aData = await aRes.json();

        if (wData.main) {
          setWeather({ 
            temp: Math.round(wData.main.temp).toString(), 
            desc: wData.weather[0].main,
            city: wData.name 
          });
        }
        if (aData.status === "success") {
          setAqi(aData.data.current.pollution.aqius);
        }
      } catch (err) { 
        console.error("API Error:", err); 
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation Error:", error.message);
          // 📍 แผนสำรอง: ถ้าดึงพิกัดไม่ได้ ให้ดึงข้อมูลของกรุงเทพฯ (Bangkok) แทน
          // พิกัด กทม: lat 13.7563, lon 100.5018
          fetchData(13.7563, 100.5018);
          setWeather(prev => ({ ...prev, city: "Bangkok (Default)" }));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => clearInterval(timer);
  }, []);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAiAdvice("TrueX AI กำลังวิเคราะห์ข้อมูลสภาพอากาศ...");
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqi, temp: weather.temp }),
      });
      const data = await res.json();
      setAiAdvice(data.analysis || "วิเคราะห์เสร็จสิ้นครับ");
    } catch (err) { 
      setAiAdvice("ขออภัย ระบบขัดข้อง"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const logout = () => {
    localStorage.removeItem('userName');
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white p-3 md:p-5 border-b flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-6">
          <h1 className="text-xl md:text-2xl font-black text-red-600 italic tracking-tighter">TrueX</h1>
          <div className="flex border-l pl-3 md:pl-6 gap-3 md:gap-6 items-center border-slate-200">
            <div className="flex flex-col">
              <span className="text-[7px] md:text-[10px] font-bold text-red-600 uppercase tracking-widest animate-pulse">
                {weather.city}
              </span>
              <span className="text-[9px] md:text-sm font-black text-slate-700">
                {weather.temp}°C <span className="hidden sm:inline">• {weather.desc}</span>
              </span>
            </div>
            <div className="flex flex-col border-l pl-3 md:pl-6 border-slate-100">
              <span className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live Time</span>
              <span className="text-[9px] md:text-sm font-black text-slate-700">
                {isMounted ? currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-red-50 px-2 md:px-3 py-1 rounded-lg border border-red-100">
              <span className="text-[9px] md:text-xs font-bold text-red-600 italic">Welcome,</span>
              <span className="font-black text-slate-800 text-[10px] md:text-sm max-w-[60px] md:max-w-none truncate">
                {name}
              </span>
            </div>
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-black px-3 md:px-5 py-2 rounded-xl shadow-lg shadow-red-100 active:scale-90 transition-all uppercase tracking-wider">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
            <h2 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] italic mb-4">Indoor Air Monitoring</h2>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-7xl md:text-9xl font-black text-slate-800 leading-none">{aqi}</span>
              <div className="flex flex-col">
                <span className={`font-bold text-lg md:text-xl ${aqi <= 50 ? 'text-green-500' : 'text-orange-500'}`}>
                  ● {aqi <= 50 ? 'คุณภาพอากาศดี' : 'ควรเฝ้าระวัง'}
                </span>
                <span className="text-slate-400 text-[10px] italic mt-1 underline">Location Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-red-600 text-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95 disabled:bg-slate-300"
          >
            {isLoading ? "Analyzing..." : "Analyze with TrueX AI"}
          </button>
        </div>

        <div className="bg-red-600 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl min-h-[350px] md:min-h-[450px] relative overflow-hidden border border-white/10 shadow-red-300">
          <div className="text-5xl md:text-6xl opacity-20 italic font-serif">“</div>
          <div className="z-10 relative">
            <h3 className="text-[10px] font-bold opacity-60 mb-2 tracking-[0.3em] uppercase italic border-b border-white/20 pb-2">TrueX Smart Insight</h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed mt-4 drop-shadow-md">{aiAdvice}</p>
          </div>
          <div className="mt-8 flex gap-2 h-10 md:h-14 items-end">
              {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.4].map((h, i) => (
                <div key={i} className={`flex-1 bg-white/40 rounded-full ${isLoading ? 'animate-pulse' : 'animate-bounce'}`} style={{height: `${h*100}%`, animationDelay: `${i*0.1}s`}}></div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}