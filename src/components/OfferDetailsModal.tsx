"use client";

import { Offer, User, Event, OfferType, GroupType } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";

type OfferWithRelations = Offer & {
  creator: User;
  event: Event | null;
};

export default function OfferDetailsModal({
  offer,
  onClose,
}: {
  offer: OfferWithRelations;
  onClose: () => void;
}) {
  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center gap-4">
          <Image
            src={offer.creator.profile_pic_url || "/avatar.png"}
            alt={offer.creator.name}
            width={72}
            height={72}
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{offer.title}</h2>
            <p className="text-white/80 text-sm">
              Offered by <span className="font-medium">{offer.creator.name}</span> ({offer.creator.email})
            </p>
          </div>
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{offer.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/offer.png" alt="" width={25} height={25}/>
              <span><strong>Offer Type:</strong> {offer.offer_type}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/group.png" alt="" width={25} height={25}/>
              <span><strong>Target Group:</strong> {offer.target_group_type}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/college.png" alt="" width={25} height={25}/>
              <span><strong>College:</strong> {offer.target_college_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/date.png" alt="" width={25} height={25}/>
              <span><strong>Date Created:</strong> {new Intl.DateTimeFormat("en-US").format(new Date(offer.created_at))}</span>
            </div>
          </div>

          {/* Event Section */}
          {offer.event && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-2">🎉 Related Event</h3>
              <p><strong>Title:</strong> {offer.event.title}</p>
              <p className="flex items-center gap-2 p-3">
                <Image src="/date.png" alt="" width={25} height={25}/>
                {new Intl.DateTimeFormat("en-US").format(new Date(offer.event.date))}
              </p>
              <p className="flex items-center gap-2 p-3">
                <Image src="/pin_point.png" alt="" width={25} height={25}/>
                {offer.event.venue}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
