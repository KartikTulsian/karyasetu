import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const {id} = await params;

    const { media_url, media_type } = await req.json();

    const uploadedBy = "replace-with-user-id";

    const newMedia = await prisma.eventGallery.create({
      data: {
        event_id: id,
        media_url,
        media_type,
        uploaded_by: uploadedBy,
      },
    });

    return NextResponse.json(newMedia);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json({ error: "Failed to add gallery image" }, { status: 500 });
  }
}
