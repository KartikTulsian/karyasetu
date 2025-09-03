import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const organisers = await prisma.user.findMany({
        select: { user_id: true, name: true, email: true, college_name: true },
    });
    return NextResponse.json(organisers);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    return NextResponse.json({ error: "Failed to fetch organisers" }, { status: 500 })
  }
}
