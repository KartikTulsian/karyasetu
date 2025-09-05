import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import EventCalendarClient from "./EventCalendarClient";

// Utility: Format date nicely
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function truncateDescription(text: string, wordLimit: number = 25) {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " ...";
}

export default async function EventCalendar() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("User email not found");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      user_id: true,
      participations: { select: { event_id: true } },
      organisedEvents: { select: { event_id: true } },
    },
  });

  if (!dbUser) return <div>User not found</div>;

  const participatedEventIds = dbUser.participations.map((p) => p.event_id);
  const createdEventIds = dbUser.organisedEvents.map((e) => e.event_id);

  // Upcoming participated events
  const participatedEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { date: "asc" },
    where: {
      date: { gte: new Date() },
      event_id: { in: participatedEventIds },
    },
  });

  // Upcoming created events
  const createdEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { date: "asc" },
    where: {
      date: { gte: new Date() },
      event_id: { in: createdEventIds },
    },
  });

  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-6">
      {/* Calendar (client component) */}
      <EventCalendarClient />

      {/* Created Events */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold my-3">Events I Created</h1>
          <Link href="/list/events">
            <span className="text-xs hover:underline cursor-pointer">View All</span>
          </Link>
        </div>
        {createdEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming created events.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {createdEvents.map((event) => (
              <div
                key={event.event_id}
                className="rounded-md p-3 bg-[#e3f8ff] hover:bg-[#d5f0fa] transition"
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-gray-700">{event.title}</h1>
                  <span className="text-gray-400 text-xs">{formatDate(event.date)}</span>
                </div>
                <p className="mt-1 text-gray-500 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Participated Events */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold my-3">Events I’m Participating In</h1>
          <Link href="/list/events">
            <span className="text-xs hover:underline cursor-pointer">View All</span>
          </Link>
        </div>
        {participatedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming participated events.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {participatedEvents.map((event) => (
              <div
                key={event.event_id}
                className="rounded-md p-3 bg-[#fcf8da] hover:bg-[#f5f1c6] transition"
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-gray-700">{event.title}</h1>
                  <span className="text-gray-400 text-xs">{formatDate(event.date)}</span>
                </div>
                <p className="mt-1 text-gray-500 text-sm">
                  {truncateDescription(event.description ?? "", 18)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
