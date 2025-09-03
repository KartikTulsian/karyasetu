"use client";

import CreateEventForm from "@/components/forms/CreateEventForm";
import { useEffect, useState } from "react";

export default function CreateEventPage() {
  const [relatedData, setRelatedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // 🔹 Fetch categories, organisers, clubs in one go
        const [categoriesRes, organisersRes, clubsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/organisers"),
          fetch("/api/clubs"),
        ]);

        const [categories, organisers, clubs] = await Promise.all([
          categoriesRes.json(),
          organisersRes.json(),
          clubsRes.json(),
        ]);

        setRelatedData({ categories, organisers, clubs });
      } catch (err) {
        console.error("Failed to load related data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-md m-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🎉 Create New Event
      </h1>

      <CreateEventForm
        type="create"
        setOpen={() => {}}
        relatedData={relatedData}
      />
    </div>
  );
}
