import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import SingleEventClient from "../../all-events/[id]/SingleEventClient";
import FormContainer from "@/components/FormContainer";

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

export default async function SingleUserEventPage({ params }: { params: Promise<{ id: string }> }) {

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

  return (

    <div>
      <SingleEventClient event={event} />
        <div>
          <div className="fixed bottom-7 right-5 z-[1000]">
            <div
              className='h-12 w-45 rounded-2xl bg-[#FAE27C] text-black flex items-center justify-center gap-4 shadow-lg cursor-pointer'
            >
              <FormContainer table='result' type='create' data={event} id={event.event_id} />
              Publish Result
            </div>
          </div>
          {/* <div className="fixed bottom-6 right-5 z-[1000] gap-4 flex">
            <div
              className='h-12 w-12 rounded-full bg-[#8286ff] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition'
            >
              <FormContainer table='event' type='update' data={event} id={event.event_id} />
            </div>
            <div
              className='h-12 w-12 rounded-full bg-[#cb70ff] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition'
            >
              <FormContainer table='event' type='delete' id={event.event_id} />
            </div>
          </div> */}
        </div>
    </div>
  );
}

export type { EventWithRelations };
