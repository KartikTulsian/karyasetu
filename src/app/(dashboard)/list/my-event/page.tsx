import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@clerk/nextjs/server';
import { Event, Prisma, Offer } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function MyEventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Not authenticated');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      organisedEvents: true,
      createdOffers: true,
      participations: {
        include: { event: true },
      },
    },
  });

  if (!dbUser) {
    throw new Error('User record not found in database');
  }

  const sp = searchParams;
  const activeTab = sp.tab === 'participated' ? 'participated' : 'created';

  const page = sp.page ? parseInt(sp.page) : 1;
  const search = sp.search ?? '';

  const query: Prisma.EventWhereInput = {};

  if (search) {
    query.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { venue: { contains: search, mode: 'insensitive' } },
    ];
  }

  let events: Event[] = [];
  let participatedEvents: { event: Event; participation_id: string }[] = [];
  let count = 0;

  if (activeTab === 'created') {
    [events, count] = await prisma.$transaction([
      prisma.event.findMany({
        where: { ...query, organiser_user_id: dbUser.user_id },
        orderBy: { date: 'desc' },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (page - 1),
      }),
      prisma.event.count({
        where: { ...query, organiser_user_id: dbUser.user_id },
      }),
    ]);
  } else {
    // Participated events (exclude own created events)
    const participated = dbUser.participations.filter(
      (p) => p.event.organiser_user_id !== dbUser.user_id
    );

    count = participated.length;

    participatedEvents = participated
      .slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page) // paginate manually
      .map((p) => ({
        event: p.event,
        participation_id: p.participation_id,
      }));
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">My Events</h1>
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

      {/* Tabs */}
      <div className="flex space-x-4 border-b mt-4">
        <Link
          href={`?tab=created`}
          className={`py-2 px-3 rounded-t-md transition-all duration-200 ${
            activeTab === 'created'
              ? 'bg-blue-500 text-white font-semibold shadow'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Events I Created
        </Link>
        <Link
          href={`?tab=participated`}
          className={`py-2 px-3 rounded-t-md transition-all duration-200 ${
            activeTab === 'participated'
              ? 'bg-blue-500 text-white font-semibold shadow'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Events I Participated In
        </Link>
      </div>

      {/* Events */}
      {activeTab === 'participated' ? (
        participatedEvents.length === 0 ? (
          <p className="text-gray-500 mt-6">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {participatedEvents.map(({ event, participation_id }) => (
              <div
                key={participation_id}
                className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/list/my-event/${event.event_id}`}>
                    <h3 className="text-lg font-semibold text-[#7675b0] hover:underline">
                      {event.title}
                    </h3>
                  </Link>
                  <div className="flex gap-2">
                    {/* Leave participation button */}
                    <FormContainer
                      table="eventParticipation"
                      type="delete"
                      id={participation_id}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  Date:{' '}
                  {new Intl.DateTimeFormat('en-GB').format(
                    new Date(event.date)
                  )}
                </p>
                <p className="text-sm text-gray-500">Venue: {event.venue}</p>
              </div>
            ))}
          </div>
        )
      ) : events.length === 0 ? (
        <p className="text-gray-500 mt-6">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <Link href={`/list/my-event/${event.event_id}`}>
                  <h3 className="text-lg font-semibold text-[#7675b0] hover:underline">
                    {event.title}
                  </h3>
                </Link>
                <div className="flex gap-2">
                  <FormContainer
                    table="event"
                    type="update"
                    data={event}
                    id={event.event_id}
                  />
                  <FormContainer
                    table="event"
                    type="delete"
                    id={event.event_id}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                Date:{' '}
                {new Intl.DateTimeFormat('en-GB').format(new Date(event.date))}
              </p>
              <p className="text-sm text-gray-500">Venue: {event.venue}</p>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
}
