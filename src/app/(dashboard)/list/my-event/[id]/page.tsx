import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import SingleEventClient from "../../all-events/[id]/SingleEventClient";

const eventWithRelations = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    organiser: true,
    category: true,
    offers: true,
    gallery: true,
    clubs: { include: { club: true } },
  },
});

type EventWithRelations = Prisma.EventGetPayload<typeof eventWithRelations>;

export default async function SingleUserEventPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { event_id: id },
    include: {
      organiser: true,
      category: true,
      offers: true,
      gallery: true,
      clubs: { include: { club: true } },
    },
  });

  if (!event) return null;

  return <SingleEventClient event={event} />;
}

export type { EventWithRelations };
