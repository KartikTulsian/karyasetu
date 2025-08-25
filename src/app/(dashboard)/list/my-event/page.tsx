import Pagination from '@/components/Pagination';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@clerk/nextjs/server';
import { Event, EventParticipation, Prisma, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// const currentUserId = "user123@example.com"; // Replace with auth context or session

export default async function MyEventsPage({ searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      organisedEvents: true,
      participations: {
        include: {
          event: true,
        }
      }
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database");
  }

  const activeTab = searchParams.tab === 'participated' ? 'participated' : 'created';

  // const createdEvents = dbUser.organisedEvents;
  // const participatedEvents = dbUser.participations
  //   .map(p => p.event)
  //   // Avoid duplicate if user created and participated in same event
  //   .filter(e => !createdEvents.some(c => c.event_id === e.event_id));

  // const { page, search, ...queryParams } = await searchParams;

  const p = searchParams.page ? parseInt(searchParams.page) : 1;

  const query: Prisma.EventWhereInput = {};

  // if (queryParams) {
  //   for (const [key, value] of Object.entries(queryParams)) {
  //     if (value !== undefined) {
  //       switch (key) {
  //         case "description":
  //           query.description = { contains: value, mode: "insensitive" };
  //           break;
  //         case "date":
  //           query.date = new Date(value);
  //           break;
  //         case "venue":
  //           query.venue = { contains: value, mode: "insensitive" };
  //           break;
  //         case "organising_committee":
  //           query.organising_committee = { contains: value, mode: "insensitive" };
  //           break;
  //         case "search":
  //           query.title = { contains: value, mode: "insensitive" };
  //           break;
  //       }

  //     }
  //   }
  // }

  if (searchParams.search) {
    query.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
      { venue: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  let events: Event[] = [];
  let count = 0;

  if (activeTab === 'created') {
    [events, count] = await prisma.$transaction([
      prisma.event.findMany({
        where: { ...query, organiser_user_id: dbUser.user_id },
        orderBy: { date: 'desc' },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.event.count({ where: { ...query, organiser_user_id: dbUser.user_id } }),
    ]);
  } else {
    const participatedIds = dbUser.participations.map((p) => p.event_id);
    [events, count] = await prisma.$transaction([
      prisma.event.findMany({
        where: { ...query, event_id: { in: participatedIds }, organiser_user_id: { not: dbUser.user_id } },
        orderBy: { date: 'desc' },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.event.count({
        where: { ...query, event_id: { in: participatedIds }, organiser_user_id: { not: dbUser.user_id } },
      }),
    ]);
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">My Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {/* {role === "admin" && <FormModal table="event" type="create" />} */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mt-4">
        <Link
          href={`?tab=created`}
          className={`pb-2 px-3 rounded-t-md transition-all duration-200 ${
            activeTab === 'created'
              ? 'bg-blue-500 text-white font-semibold shadow'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Events I Created
        </Link>
        <Link
          href={`?tab=participated`}
          className={`pb-2 px-3 rounded-t-md transition-all duration-200 ${
            activeTab === 'participated'
              ? 'bg-blue-500 text-white font-semibold shadow'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Events I Participated In
        </Link>
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <p className="text-gray-500 mt-6">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <Link
              key={event.event_id}
              href={`/list/my-event/${event.event_id}`}
            >
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-[#7675b0]">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 space-y-1">
                  Date:{' '}
                  {new Intl.DateTimeFormat('en-GB').format(
                    new Date(event.date)
                  )}
                </p>
                <p className="text-sm text-gray-500">Venue: {event.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
}