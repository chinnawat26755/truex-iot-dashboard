import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

// ระบบจะดึง HF_TOKEN จากไฟล์ .env.local มาใช้
const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  try {
    const { aqi, temp, userQuestion } = await req.json();

    const systemContext = `
      คุณคือ TrueX AI ระบบวิเคราะห์ IoT อัจฉริยะ (Smart Home Assistant)
      ข้อมูลปัจจุบันที่คุณได้รับจากเซนเซอร์: ค่าฝุ่น AQI = ${aqi}, อุณหภูมิ = ${temp}°C
      หน้าที่: วิเคราะห์ความสัมพันธ์ของสภาพอากาศและตอบเป็นภาษาไทยสั้นๆ สุภาพ และเป็นกันเอง ห้ามระบุชื่อโมเดลเบื้องหลัง
    `;

    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: systemContext },
        { role: "user", content: userQuestion || "ช่วยวิเคราะห์สถานะอากาศจากตำแหน่งปัจจุบันของฉันหน่อย" }
      ],
      max_tokens: 250,
      temperature: 0.7, // ปรับให้คำตอบมีความหลากหลายขึ้นนิดหน่อย
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ analysis: aiMessage });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ message: "AI Connection Error" }, { status: 500 });
  }
}