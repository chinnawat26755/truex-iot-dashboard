import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ message: "Missing coordinates" }, { status: 400 });
  }

  try {
    // 🛡️ ดึง Key จาก Environment Variables ที่คุณตั้งไว้ใน Vercel
    const weatherKey = process.env.OPENWEATHER_API_KEY; 
    const aqiKey = process.env.IQAIR_API_KEY;

    if (!weatherKey || !aqiKey) {
      return NextResponse.json({ message: "API Keys not configured" }, { status: 500 });
    }

    // ยิง API พร้อมกัน
    const [wRes, aRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`),
      fetch(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${aqiKey}`)
    ]);

    const wData = await wRes.json();
    const aData = await aRes.json();

    // 🚩 คัดกรองข้อมูลอย่างปลอดภัยก่อนส่งออกไป
    return NextResponse.json({
      temp: wData.main ? Math.round(wData.main.temp) : 0,
      desc: wData.weather ? wData.weather[0].main : "Unknown",
      city: wData.name || "Unknown Location",
      aqi: aData.status === "success" ? aData.data.current.pollution.aqius : 0,
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}