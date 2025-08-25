"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from 'next/image';
import React, { useState } from 'react'
import { EventWithRelations } from "./page";
import { CldUploadWidget } from 'next-cloudinary';

export default function SingleEventClient({ event }: { event: EventWithRelations }) {

    const [img, setImg] = useState<any>();

  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-8 p-4">
        {/* LEFT CONTENT */}
        <div className="w-full xl:w-2/3 flex flex-col gap-8">
            
            {/* HERO SECTION */}
            <CldUploadWidget uploadPreset="karyasetu" 
                onSuccess={async (result: any) => {
                    const uploadedUrl = result.info.secure_url;

                    // Save to DB via API
                    await fetch(`/api/events/${event.event_id}/poster`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ poster_url: uploadedUrl }),
                    });

                    // Update local UI without refresh
                    setImg(uploadedUrl);
                }}
            >
                {({ open }) => {
                    return (
                    <button onClick={() => open()}>
                        Upload an Image
                    </button>
                    );
                }}
            </CldUploadWidget>
            {event.poster_url && (
            <div className="relative rounded-xl overflow-hidden shadow-lg">
                <Image
                src={event.poster_url || "https://source.unsplash.com/1200x600/?event,festival"}
                alt={event.title}
                width={1200}
                height={600}
                className="object-cover w-full h-[350px] sm:h-[450px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                    {event.title}
                </h1>
                <span className="inline-block bg-white/90 text-gray-800 px-3 py-1 rounded-md text-sm mt-2">
                    {event.category.name}
                </span>
                </div>
            </div>
            )}

            {/* EVENT DESCRIPTION CARD */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 space-y-6"
            >
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            {/* QUICK INFO GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Detail image="/date.png" label="Date" value={new Date(event.date).toLocaleDateString()} />
                <Detail
                image="/time.png"
                label="Time"
                value={`${new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(
                    event.end_time
                ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                />
                <Detail image="/pin_point.png" label="Venue" value={event.venue} />
                {event.organising_committee && (
                <Detail image="/committee.png" label="Organising Committee" value={event.organising_committee} />
                )}
                {event.entry_fee !== null && event.entry_fee !== undefined && (
                    <Detail
                        image="/entry_fee.png"
                        label="Entry Fee"
                        value={event.entry_fee === 0 ? "Free" : `₹${event.entry_fee}`}
                    />
                )}

                {event.registration_deadline && (
                <Detail
                    image="/deadline.png"
                    label="Registration Deadline"
                    value={new Date(event.registration_deadline).toLocaleDateString()}
                />
                )}
                <Detail image="/status.png" label="Status" value={event.event_status} />
                <Detail image="/visibility.png" label="Visibility" value={event.visibility} />
            </div>

            {event.registration_link && (
                <Link
                href={event.registration_link}
                target="_blank"
                className="block text-center w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
                >
                🚀 Register Now
                </Link>
            )}
            </motion.div>

            {/* OFFERS SECTION */}
            {event.offers.length > 0 && (
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h2 className="text-2xl font-semibold mb-4">Special Offers 🎁</h2>
                <ul className="space-y-2">
                {event.offers.map((offer) => (
                    <li key={offer.offer_id} className="bg-blue-50 p-3 rounded-md">
                    <strong>{offer.title}:</strong> {offer.description}
                    </li>
                ))}
                </ul>
            </motion.div>
            )}

            {/* GALLERY SECTION */}
            {event.gallery.length > 0 && (
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h2 className="text-2xl font-semibold mb-4">Event Gallery 📸</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.gallery.map((media) => (
                    <div
                    key={media.media_id}
                    className="relative group overflow-hidden rounded-lg cursor-pointer"
                    >
                    <Image
                        src={media.media_url || "https://source.unsplash.com/300x200/?crowd"}
                        alt="Event Media"
                        width={300}
                        height={200}
                        className="object-cover w-full h-40 group-hover:scale-105 transition-transform"
                    />
                    </div>
                ))}
                </div>
            </motion.div>
            )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-1/3 flex flex-col gap-6 xl:sticky xl:top-4 h-fit">
            
            {/* ORGANISER CARD */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
            {event.organiser.profile_pic_url && (
                <Image
                src={event.organiser.profile_pic_url}
                alt={event.organiser.name}
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-blue-100 mx-auto"
                />
            )}
            <h2 className="text-lg font-semibold mt-4">{event.organiser.name}</h2>
            <p className="text-gray-500">{event.organiser.college_name}</p>
            <p className="text-gray-500">{event.organiser.course} - Year {event.organiser.year}</p>
            {event.organiser.phone_number && (
                <p className="mt-2 text-sm font-medium">📞 {event.organiser.phone_number}</p>
            )}
            {event.organiser.email && (
                <p className="text-sm font-medium">✉️ {event.organiser.email}</p>
            )}
            </motion.div>

            {/* CLUBS CARD */}
            {event.clubs.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h2 className="text-xl font-semibold mb-3">Organising Clubs 🏛️</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                {event.clubs.map((clubMap) => (
                    <li key={clubMap.club.club_id}>{clubMap.club.name}</li>
                ))}
                </ul>
            </motion.div>
            )}
        </aside>
        </div>
    </div>
  )
}

function Detail({ image, label, value }: { image: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all duration-200">
      <Image src={image} alt="" width={25} height={25} />
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
