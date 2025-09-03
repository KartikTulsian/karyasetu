import { Club, Event, EventClubMapping } from "@prisma/client";
import Image from "next/image";

type ClubWithRelations = Club & {
  eventLinks: (EventClubMapping & { event: Event })[];
};

export default function ClubsDetailsModelServer({
  club,
  onCloseUrl,
}: {
  club: ClubWithRelations;
  onCloseUrl: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center gap-4">
          <div className="flex-col">
            <h2 className="text-2xl font-bold text-white mb-3">{club.name}</h2>
            {club.description && (
              <p className="text-white/80 text-sm">
                <strong>Description:</strong> {club.description}
              </p>
            )}
            <p className="text-white/80 text-sm">
              <strong>College Name:</strong> {club.college_name}
            </p>
          </div>

          <a
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
          >
            ✕
          </a>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Events</h3>

          {club.eventLinks.length === 0 && (
            <p className="text-gray-500">No events linked to this club.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {club.eventLinks.map(({ event }) => (
              <div
                key={event.event_id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h4 className="font-semibold text-purple-700 mb-3">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {event.description}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Image src="/date.png" alt="" width={20} height={20} />
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(event.date))}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Image src="/pin_point.png" alt="" width={20} height={20} />
                  {event.venue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
