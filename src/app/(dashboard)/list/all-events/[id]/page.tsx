import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import SingleEventClient from "./SingleEventClient";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";

const eventWithRelations = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    organiser: true,
    offers: true,
    gallery: true,
    clubs: { include: { club: true } },
    participations: { include: { user: true } },
  },
});

type EventWithRelations = Prisma.EventGetPayload<typeof eventWithRelations>;

export default async function SingleEventPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;


  const event = await prisma.event.findUnique({
    where: { event_id: id },
    include: {
      organiser: true,
      offers: true,
      gallery: true,
      clubs: { include: { club: true } },
      participations: { include: { user: true } },
    },
  });

  if (!event) return null;

  const { userId } = await auth();
  const isCreator = userId === event?.organiser.user_id

  return (
    <div>
      <SingleEventClient event={event} />
      {isCreator &&
        <div>
          <div className="fixed bottom-6 right-5 z-[1000]">
            <div
              className='h-12 w-47 rounded-2xl bg-[#FAE27C] text-black flex items-center justify-center gap-2 shadow-lg cursor-pointer'
            >
              <FormContainer table='result' type='create' data={event} id={event.event_id} />
              Publish Result
            </div>
          </div>
          
        </div>

      }
    </div>

  );
}

export type { EventWithRelations };
