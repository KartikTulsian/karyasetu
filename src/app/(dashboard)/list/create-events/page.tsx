'use client';

import { useState } from 'react';

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    college: '',
    date: '',
    startTime: '',
    endTime: '',
    registrationFee: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event created:', formData);
    // TODO: Send formData to API/backend (e.g. via fetch or axios)
  };

  return (
    <div className="p-6 bg-white shadow rounded-md m-4">
      <h1 className="text-2xl font-semibold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="college"
          placeholder="College Name"
          value={formData.college}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="registrationFee"
          placeholder="Registration Fee"
          value={formData.registrationFee}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-1 md:col-span-2"
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="bg-lamaYellow text-white px-4 py-2 rounded hover:bg-yellow-600 col-span-1 md:col-span-2"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;