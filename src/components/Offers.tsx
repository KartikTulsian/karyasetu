import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { GroupType } from '@/generated/prisma';
import Link from 'next/link';
import React from 'react'

export default async function Offers() {

  // const {userId, sessionClaims} = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  const dbUser = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
      select: {
        user_id: true,
        college_name: true,
        participations: {
          select: {
            event_id: true
          }
        }
      },
    });

    if (!dbUser) return <div>User not found</div>;

    const participatedEventIds = dbUser.participations.map(p => p.event_id);

    const whereConditions: any[] = [
      { target_group_type: GroupType.ALL }
    ];

    if (dbUser.college_name) {
      whereConditions.push({
        target_group_type: GroupType.COLLEGE,
        target_college_name: {
          equals: dbUser.college_name,
          mode: 'insensitive'
        }
      });
    }

    if (participatedEventIds.length > 0) {
      whereConditions.push({
        target_group_type: GroupType.EVENT_PARTICIPANTS,
        target_event_id: { in: participatedEventIds }
      });
    }

    const offers = await prisma.offer.findMany({
      take: 3,
      orderBy: { created_at: 'desc' },
      where: {
        OR: whereConditions
      }
    });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offers</h1>
        <Link href="/list/offers">
          <span className="text-xs hover:underline cursor-pointer">View All</span>
        </Link>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        {offers.map((offer, idx) => (
          <Link
            key={offer.offer_id}
            href={`/list/offers?offerId=${offer.offer_id}`}
            className={`rounded-md p-4 block ${
              idx === 0
                ? 'bg-[#e3f8ff]'
                : idx === 1
                ? 'bg-[#e0defa]'
                : 'bg-[#fcf8da]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{offer.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat('en-GB').format(offer.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{offer.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}