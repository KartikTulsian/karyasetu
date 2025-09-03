import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const { poster_url } = await req.json();

    const updatedEvent = await prisma.event.update({
      where: { event_id: id },
      data: { poster_url },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating poster:", error);
    return NextResponse.json({ error: "Failed to update poster" }, { status: 500 });
  }
}
