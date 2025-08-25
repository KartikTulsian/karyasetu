'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    organising_committee: '',
    entry_fee: '',
    registration_link: '',
    max_team_size: '',
    registration_deadline: '',
    event_status: "UPCOMING",
    visibility: "PUBLIC",
    category_id: '',
  });

  const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories'); // 🔹 You’ll need this API
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Convert date & time into DateTime (for Prisma schema)
    const eventPayload = {
      ...formData,
      date: new Date(formData.date),
      start_time: new Date(`${formData.date}T${formData.startTime}`),
      end_time: new Date(`${formData.date}T${formData.endTime}`),
      registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline) : null,
      entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
      max_team_size: formData.max_team_size ? parseInt(formData.max_team_size) : null,
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    const newEvent = await res.json();
    setEventId(newEvent.event_id);

    alert('Event created! Now upload poster and gallery images.');
  };

  return (
    <div className="p-6 bg-white shadow rounded-md m-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🎉 Create New Event
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="border p-3 rounded-lg" required />
        <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} className="border p-3 rounded-lg" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-3 rounded-lg" required />
        <input type="date" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="border p-3 rounded-lg" />
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="border p-3 rounded-lg" required />
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="border p-3 rounded-lg" required />

        <input type="number" name="entry_fee" placeholder="Entry Fee (optional)" value={formData.entry_fee} onChange={handleChange} className="border p-3 rounded-lg" />
        <input type="number" name="max_team_size" placeholder="Max Team Size (optional)" value={formData.max_team_size} onChange={handleChange} className="border p-3 rounded-lg" />
        <input type="url" name="registration_link" placeholder="Registration Link (optional)" value={formData.registration_link} onChange={handleChange} className="border p-3 rounded-lg md:col-span-2" />
        <input type="text" name="organising_committee" placeholder="Organising Committee (optional)" value={formData.organising_committee} onChange={handleChange} className="border p-3 rounded-lg md:col-span-2" />

        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="border p-3 rounded-lg md:col-span-2" rows={5} required />

        <select name="event_status" value={formData.event_status} onChange={handleChange} className="border p-3 rounded-lg">
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select name="visibility" value={formData.visibility} onChange={handleChange} className="border p-3 rounded-lg">
          <option value="PUBLIC">Public</option>
          <option value="COLLEGE">College Only</option>
          <option value="GROUP">Group Only</option>
        </select>

        {/* 🔹 Dropdown for categories */}
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 col-span-1 md:col-span-2">
          🚀 Create Event
        </button>
      </form>

      {/* Poster Upload (only after event is created) */}
      {eventId && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">📌 Upload Event Poster</h2>
          <CldUploadWidget
            uploadPreset="karyasetu"
            onSuccess={async (result: any) => {
              const uploadedUrl = result.info.secure_url;
              await fetch(`/api/events/${eventId}/poster`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ poster_url: uploadedUrl }),
              });
              setPosterUrl(uploadedUrl);
            }}
          >
            {({ open }) => (
              <button onClick={() => open()} className="px-4 py-2 bg-blue-500 text-white rounded">Upload Poster</button>
            )}
          </CldUploadWidget>

          {posterUrl && <Image src={posterUrl} alt="Poster" width={300} height={200} className="mt-4 rounded-lg shadow" />}
        </div>
      )}

      {/* Gallery Upload */}
      {eventId && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">🖼️ Upload Event Gallery</h2>
          <CldUploadWidget
            uploadPreset="karyasetu"
            options={{ multiple: true }}
            onSuccess={async (result: any) => {
              const uploadedUrl = result.info.secure_url;
              await fetch(`/api/events/${eventId}/gallery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ media_url: uploadedUrl, media_type: "IMAGE" }),
              });
              setGalleryUrls((prev) => [...prev, uploadedUrl]);
            }}
          >
            {({ open }) => (
              <button onClick={() => open()} className="px-4 py-2 bg-green-500 text-white rounded">Upload Gallery Images</button>
            )}
          </CldUploadWidget>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {galleryUrls.map((url, i) => (
              <Image key={i} src={url} alt={`Gallery ${i}`} width={150} height={100} className="rounded-md shadow" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventPage;
