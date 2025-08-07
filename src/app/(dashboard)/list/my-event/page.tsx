
'use client';

import { useEffect, useState } from 'react';

type EventType = {
  id: string;
  title: string;
  description: string;
  college: string;
  date: string;
  startTime: string;
  endTime: string;
  createdBy: string; // user ID or email
  participants: string[]; // array of user IDs or emails
};

const currentUserId = "user123@example.com"; // Replace with auth context or session

export default function MyEventsPage() {
  const [createdEvents, setCreatedEvents] = useState<EventType[]>([]);
  const [participatedEvents, setParticipatedEvents] = useState<EventType[]>([]);

  useEffect(() => {
    // Mock fetch, replace with API call to your backend
    const fetchEvents = async () => {
      // Simulate getting all events (you’d filter from backend in real apps)
      const allEvents: EventType[] = await fetch('/api/events').then(res => res.json());

      setCreatedEvents(allEvents.filter(event => event.createdBy === currentUserId));
      setParticipatedEvents(allEvents.filter(event =>
        event.participants.includes(currentUserId) && event.createdBy !== currentUserId
      ));
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Events</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Events I Created</h2>
        {createdEvents.length === 0 ? (
          <p className="text-gray-500">You haven't created any events yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {createdEvents.map(event => (
              <li key={event.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">Date: {event.date}</p>
                <p className="text-sm text-gray-500">College: {event.college}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Events I Participated In</h2>
        {participatedEvents.length === 0 ? (
          <p className="text-gray-500">You haven't registered for any events yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participatedEvents.map(event => (
              <li key={event.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">Date: {event.date}</p>
                <p className="text-sm text-gray-500">College: {event.college}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
