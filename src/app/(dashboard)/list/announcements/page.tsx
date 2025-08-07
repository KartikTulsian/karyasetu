import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { announcementsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Announcement = {
  id: number;
  title: string;
  college: string;
  class: string;
  date: string;
};

const AnnouncementListPage = () => {

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {announcementsData.map((announcement: Announcement) => (
          <Link key={announcement.id} href={`/list/announcements/${announcement.id}`}>
            <div
              key={announcement.id}
              className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-lamaPurpleDark">{announcement.title}</h2>
                <p className="text-sm text-gray-500">College: {announcement.college}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Date: {announcement.date}</p>
              </div>
              
              {role === "admin" && (
                <div className="flex gap-2 mt-4">
                  {/* <FormModal table="event" type="update" data={event} /> */}
                  <FormModal table="event" type="delete" id={announcement.id} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AnnouncementListPage;