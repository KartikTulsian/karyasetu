import React from 'react'
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export type FormContainerProps = {
    table:
    | "user"
    | "event"
    | "offer"
    | "club"
    | "result"
    | "eventParticipation"
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
}

export default async function FormContainer({ table, type, data, id }: FormContainerProps) {
    let relatedData = {}

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    if (type !== "delete") {
        switch (table) {
            case "user":
                break;
            case "event":
                const organisers = await prisma.user.findMany({
                    select: { user_id: true, name: true, email: true },
                });

                // Fetch clubs (for event-club mapping if applicable)
                const clubs = await prisma.club.findMany({
                    select: { club_id: true, name: true },
                });

                // Manually define enums (Prisma doesn’t have a direct "find enums" query)
                const eventStatuses = ["UPCOMING", "ONGOING", "COMPLETED"];
                const visibilities = ["PUBLIC", "COLLEGE", "GROUP"];
                const categories = [
                    "TECHNICAL", "CULTURAL", "SEMINAR", "WORKSHOP", "SPORTS",
                    "HACKATHON", "QUIZ", "DRAMATICS", "MUSIC", "DANCE",
                    "LITERARY", "ART", "MANAGEMENT", "SOCIAL"
                ];

                relatedData = { organisers, clubs, eventStatuses, visibilities, categories };
                break;

            case "offer":
                const targetGroupType = ["ALL", "COLLEGE", "EVENT_PARTICIPANTS"];
                const offerType = ["TEAM_RECRUITMENT", "ANNOUNCEMENT"];

                relatedData = { targetGroupType, offerType };
                break;

            case "club":
                const events = await prisma.event.findMany({
                    where: { event_status: { in: ["UPCOMING", "ONGOING"] } },
                    select: { event_id: true, title: true },
                });
                relatedData = { events };
                break;

            case "result":
                const visibilityTo = ["ALL", "COLLEGE", "EVENT_PARTICIPANTS"];
                relatedData = { visibilityTo };
                break;

            case "eventParticipation":
                break;

            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}
