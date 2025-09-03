
import { auth } from '@clerk/nextjs/server';
import { Event, Offer, User } from '@prisma/client';
import Image from 'next/image';
import FormContainer from './FormContainer';

type OfferWithRelations = Offer & {
  creator: User;
  event: Event | null;
};

export default async function OfferDetailsModalServer({
  offer,
  onCloseUrl,
}: {
  offer: OfferWithRelations;
  onCloseUrl: string;
}) {
  const { userId } = await auth();
  const isCreator = userId === offer.created_by;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center gap-4">
          <Image
            src={offer.creator.profile_pic_url || "/avatar.png"}
            alt={offer.creator.name}
            width={72}
            height={72}
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className='flex flex-row justify-between w-full items-center'>
            <div className="flex-col">
              <h2 className="text-2xl font-bold text-white mb-3">{offer.title}</h2>
              <p className="text-white/80 text-sm">
                Offered by <span className="font-medium">{offer.creator.name}</span> ({offer.creator.email})
              </p>

            </div>


            {isCreator && (
              <div className="flex gap-2 mt-2">
                <FormContainer table="offer" type="update" data={offer} id={offer.offer_id} />
                <FormContainer table="offer" type="delete" id={offer.offer_id} />
              </div>
            )}
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
          <p className="text-gray-700 leading-relaxed">{offer.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/offer.png" alt="" width={25} height={25} />
              <span><strong>Offer Type:</strong> {offer.offer_type}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/group.png" alt="" width={25} height={25} />
              <span><strong>Target Group:</strong> {offer.target_group_type}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/college.png" alt="" width={25} height={25} />
              <span><strong>College:</strong> {offer.target_college_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/date.png" alt="" width={25} height={25} />
              <span><strong>Date Created:</strong> {new Intl.DateTimeFormat("en-US").format(new Date(offer.created_at))}</span>
            </div>
          </div>

          {offer.event && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-2">🎉 Related Event</h3>
              <p><strong>Title:</strong> {offer.event.title}</p>
              <p className="flex items-center gap-2 p-3">
                <Image src="/date.png" alt="" width={25} height={25} />
                {new Intl.DateTimeFormat("en-US").format(new Date(offer.event.date))}
              </p>
              <p className="flex items-center gap-2 p-3">
                <Image src="/pin_point.png" alt="" width={25} height={25} />
                {offer.event.venue}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
