"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { EventWithRelations } from "./page";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ParticipationForm from "@/components/forms/ParticipationForm";
import { useUser } from "@clerk/nextjs";

export default function SingleEventClient({ event }: { event: EventWithRelations }) {

    const { user } = useUser();
    const [img, setImg] = useState<any>();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const isOrganiser = user?.primaryEmailAddress?.emailAddress === event.organiser.email;

    // ✅ Check if logged-in user already registered
    const isRegistered = !!event.participations.find(
        (p) => p.user.email === user?.primaryEmailAddress?.emailAddress
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (activeIndex === null) return;
        if (e.key === "Escape") setActiveIndex(null);
        if (e.key === "ArrowRight") setActiveIndex((i) => (i! + 1) % event.gallery.length);
        if (e.key === "ArrowLeft") setActiveIndex((i) => (i! - 1 + event.gallery.length) % event.gallery.length);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div>
            <div className="flex flex-col xl:flex-row gap-8 p-4">
                {/* LEFT CONTENT */}
                <div className="w-full xl:w-2/3 flex flex-col gap-8">

                    {/* HERO SECTION */}
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
                                    {event.category}
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

                            {event.max_team_size !== null && event.max_team_size !== undefined ? (
                                <Detail
                                    image="/group.png"
                                    label="Max Team Size"
                                    value={
                                        event.max_team_size === 1
                                            ? "Individual Only"
                                            : event.max_team_size.toString()
                                    }
                                />
                            ) : (
                                <Detail
                                    image="/group.png"
                                    label="Max Team Size"
                                    value="No Limit"
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
                                🚀 Register Now Through Registration Link
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
                                {event.gallery.map((media, idx) => (
                                    <div
                                        key={media.media_id}
                                        className="relative group overflow-hidden rounded-lg cursor-pointer"
                                        onClick={() => setActiveIndex(idx)}
                                    >
                                        {media.media_type === "IMAGE" ? (
                                            <Image
                                                src={media.media_url}
                                                alt="Event Media"
                                                width={300}
                                                height={200}
                                                className="object-cover w-full h-40 group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <video
                                                src={media.media_url}
                                                className="object-cover w-full h-40 group-hover:scale-105 transition-transform"
                                                muted
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* LIGHTBOX VIEWER */}
                {activeIndex !== null && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                        <button
                            onClick={() => setActiveIndex(null)}
                            className="absolute top-4 right-4 text-white text-3xl"
                        >
                            <X />
                        </button>
                        {/* Left Arrow */}
                        <button
                            onClick={() => setActiveIndex((i) => (i! - 1 + event.gallery.length) % event.gallery.length)}
                            className="absolute left-4 text-white text-4xl"
                        >
                            <ChevronLeft />
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={() => setActiveIndex((i) => (i! + 1) % event.gallery.length)}
                            className="absolute right-4 text-white text-4xl"
                        >
                            <ChevronRight />
                        </button>

                        {/* Media */}
                        <div className="max-w-4xl max-h-[80vh]">
                            {event.gallery[activeIndex].media_type === "IMAGE" ? (
                                <Image
                                    src={event.gallery[activeIndex].media_url}
                                    alt="Event Media"
                                    width={1000}
                                    height={600}
                                    className="object-contain max-h-[80vh] w-auto mx-auto"
                                />
                            ) : (
                                <video
                                    src={event.gallery[activeIndex].media_url}
                                    controls
                                    autoPlay
                                    className="object-contain max-h-[80vh] w-auto mx-auto"
                                />
                            )}
                        </div>
                    </div>
                )}

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

                    {isOrganiser ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-semibold mb-3">Registered Participants ✅</h2>
                            {event.participations.length > 0 ? (
                                <ul className="space-y-3">
                                    {event.participations.map((p) => (
                                        <li
                                            key={p.participation_id}
                                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                                        >
                                            {p.user.profile_pic_url && (
                                                <Image
                                                    src={p.user.profile_pic_url}
                                                    alt={p.user.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-800">{p.user.name}</p>
                                                <p className="text-sm text-gray-500">{p.user.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No participants yet.</p>
                            )}
                        </motion.div>
                    ) : isRegistered ? (
                        <button
                            disabled
                            className="block text-center w-full bg-gray-400 text-white py-3 rounded-lg font-semibold shadow-md cursor-not-allowed"
                        >
                            ✅ Already Registered
                        </button>
                    ) : event.use_custom_form ? (
                        <button
                            onClick={() => setOpen(true)}
                            className="block text-center w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
                        >
                            🚀 Register Now
                        </button>
                    ) 
                    
                    : (
                        event.use_custom_form && (
                            // <Link
                            //     href={event.registration_link}
                            //     target="_blank"
                            //     className="block text-center w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
                            // >
                            //     🚀 Register Now for KaryaSetu
                            // </Link>
                            <button
                            onClick={() => setOpen(true)}
                            className="block text-center w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
                        >
                            🚀 Register Now for Karyasetu
                        </button>
                        )
                    )}

                    {/* Custom Form Modal */}
                    {open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                            <div className="bg-white rounded-2xl shadow-lg w-[95%] md:w-[60%] p-6 relative">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                                    onClick={() => setOpen(false)}
                                >
                                    ✖
                                </button>
                                <ParticipationForm
                                    type="create"
                                    setOpen={setOpen}
                                    eventId={event.event_id}
                                    relatedData={{ event }}
                                />
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
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
