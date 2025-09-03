import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
        select: { club_id: true, name: true, college_name: true },
    });
    return NextResponse.json(clubs);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 })
  }
}
