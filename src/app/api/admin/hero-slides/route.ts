import { NextResponse } from "next/server";
import { getHeroSlides, saveHeroSlides } from "@/lib/cms-store";

export async function GET() {
  const slides = getHeroSlides();
  return NextResponse.json({ success: true, slides });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      saveHeroSlides(body);
      return NextResponse.json({ success: true, slides: body });
    }
    const current = getHeroSlides();
    if (body.id) {
      const idx = current.findIndex((s) => s.id === body.id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...body };
      } else {
        current.push(body);
      }
      saveHeroSlides(current);
      return NextResponse.json({ success: true, slides: current });
    }
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

