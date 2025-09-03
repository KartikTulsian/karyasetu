"use client";

import { useEffect, useState } from "react";
import { Offer, OfferType, GroupType, User, Event } from "@prisma/client";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import OfferDetailsModal from "@/components/OfferDetailsModal";
import { useSearchParams } from "next/navigation";

type OfferList = Offer & {
  target_group_type: GroupType;
  offer_type: OfferType;
  creator: User;
  event: Event | null;
};

export default function OffersListClient({
  offers,
  count,
  page,
}: {
  offers: OfferList[];
  count: number;
  page: number;
}) {
  const [selectedOffer, setSelectedOffer] = useState<OfferList | null>(null);
  const searchParams = useSearchParams();
  const offerIdFromUrl = searchParams.get("offerId");

  useEffect(() => {
    if (offerIdFromUrl) {
      const match = offers.find(o => o.offer_id === offerIdFromUrl);
      if (match) setSelectedOffer(match);
    }
  }, [offerIdFromUrl, offers]);

  const renderCard = (offer: OfferList) => (
    <div
      key={offer.offer_id}
      className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
      onClick={() => setSelectedOffer(offer)}
    >
      <div className="mb-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-[#5e5e85]">{offer.title}</h2>
        </div>
        <p className="text-sm text-gray-500">Offered By: {offer.creator.name}</p>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>Event: {offer.event?.title}</p>
        <p>Date: {new Intl.DateTimeFormat("en-US").format(new Date(offer.created_at))}</p>
        <p>Group: {offer.target_group_type}</p>
        <p>Referred College: {offer.target_college_name}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">All offers</h1>
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
        {offers.map(renderCard)}
      </div>

      {/* PAGINATION */}
      <Pagination page={page} count={count} />

      {/* MODAL */}
      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
