import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        venue: body.venue,
        organising_committee: body.organising_committee,
        entry_fee: body.entry_fee,
        registration_link: body.registration_link,
        max_team_size: body.max_team_size,
        registration_deadline: body.registration_deadline,
        event_status: body.event_status,
        visibility: body.visibility,
        category_id: body.category_id, // 🔹 dropdown UUID
        organiser_user_id: "replace-with-logged-in-user-id", // TODO: hook to auth
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
