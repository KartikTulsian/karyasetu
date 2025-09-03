import React from 'react'
import Pagination from "@/components/Pagination";
import prisma from "@/lib/prisma";
import { EventCategory, EventStatus, Prisma, Visibility } from "@prisma/client";
import Link from "next/link";
import { ITEM_PER_PAGE } from '@/lib/settings';
import FormContainer from '@/components/FormContainer';
import { auth } from '@clerk/nextjs/server';

type EventList = {
    event_id: string;
    title: string;
    description: string;
    date: Date;
    start_time: Date;
    end_time: Date;
    organising_committee: string | null;
    category: EventCategory;
    event_status: EventStatus;
    visibility: Visibility;
    organiser_user_id: string;
};



export default async function EventListPage({ searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {

    //      const { sessionClaims } = await auth();
    //   const role = (sessionClaims?.metadata as { role?: string })?.role;

    const { userId } = await auth();

    const renderCard = (event: EventList) => {
        const isCreator = userId === event.organiser_user_id;

        return (

            <div key={event.event_id} className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition">
                <div className="mb-2 flex items-center justify-between">
                    <Link href={`/list/all-events/${event.event_id}`}>
                        <h2 className="text-lg font-semibold text-[#7675b0] hover:underline">{event.title}</h2>
                    </Link>

                    {/* Only show buttons if the current user is the organiser */}
                    {isCreator && (
                        <div className="flex gap-2">
                            <FormContainer table='event' type='update' data={event} id={event.event_id} />
                            <FormContainer table='event' type='delete' id={event.event_id} />
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    Organised By: {event.organising_committee || "N/A"}
                </p>

                <div className="text-sm text-gray-600 space-y-1 mt-2">
                    <p>Date: {new Intl.DateTimeFormat("en-US").format(event.date)}</p>
                    <p>
                        Time:{" "}
                        {event.start_time.toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                        {" - "}
                        {event.end_time.toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                    </p>
                    <p>Category: {event.category}</p>
                </div>
            </div>
        );
    };


    const { page, ...queryParams } = await searchParams;

    const p = page ? parseInt(page) : 1;

    //USE PARAMS CONDITION

    const query: Prisma.EventWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "description":
                        query.description = { contains: value, mode: "insensitive" };
                        break;
                    case "date":
                        query.date = new Date(value);
                        break;
                    case "venue":
                        query.venue = { contains: value, mode: "insensitive" };
                        break;
                    case "organising_committee":
                        query.organising_committee = { contains: value, mode: "insensitive" };
                        break;
                    case "search":
                        query.title = { contains: value, mode: "insensitive" };
                        break;
                }

            }
        }
    }

    const [events, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            orderBy: {
                date: 'desc',
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.event.count({ where: query }),
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="lg:text-xl font-semibold text-lg">All Events</h1>
                {/* <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                    </div>
                </div> */}
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {events.map(renderCard)}
            </div>

            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};
