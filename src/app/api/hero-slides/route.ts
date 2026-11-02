import { NextResponse } from "next/server";
import { getHeroSlides } from "@/lib/cms-store";

export async function GET() {
  const slides = getHeroSlides();
  return NextResponse.json({ success: true, slides });
}

