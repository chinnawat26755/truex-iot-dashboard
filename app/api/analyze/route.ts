import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference("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");

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
      temperature: 0.6,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ message: "AI Connection Error" }, { status: 500 });
  }
}