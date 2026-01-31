import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

    if (error || !user) return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ message: "รหัสผ่านผิด" }, { status: 401 });

    // สร้าง Cookie เพื่อเป็นกุญแจให้ Middleware ตรวจสอบ
// เปลี่ยนจาก cookies().set(...) เป็นแบบนี้:
const cookieStore = await cookies();
cookieStore.set('isLoggedIn', 'true', { maxAge: 60 * 60 * 24, path: '/' });

    return NextResponse.json({ user: { name: user.name } });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}