import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { announcementsData, role } from "@/lib/data";
import { GroupType, Offer, OfferType, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// type Announcement = {
//   id: number;
//   title: string;
//   college: string;
//   class: string;
//   date: string;
// };

type OfferList = Offer & {
  target_group_type: GroupType;
  offer_typr: OfferType;
  creator: User;
  event: Event;
};

export default async function AnnouncementListPage ({searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {

  const renderCard = (offer: OfferList) => (
        <Link key={offer.offer_id} href={`/list/all-offers/${offer.offer_id}`}>
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition">
                <div className="mb-2">
                <h2 className="text-lg font-semibold text-lamaPurpleDark">{offer.title}</h2>
                <p className="text-sm text-gray-500">
                    Organised By: {offer.organising_committee || "N/A"}
                </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                <p>Date: {new Intl.DateTimeFormat("en-US").format(offer.date)}</p>
                <p>Time: 
                    {offer.start_time.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })} 
                    - 
                    {offer.end_time.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </p>
                <p>Category: {offer.category.name}</p>
                </div>
                {role === "admin" && (
                <div className="flex gap-2 mt-4">
                    {/* <FormModal table="offer" type="delete" id={offer.offer_id} /> */}
                </div>
                )}
            </div>
        </Link>
    );

    const { page, ...queryParams } = await searchParams;

    const p = page ? parseInt(page) : 1;

    //USE PARAMS CONDITION

    const query: Prisma.offerWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "description":
                        query.description = { contains: value, mode: "insensitive" };
                        break;
                    case "date":
                        query.date = new Date(value);
                        break;
                    case "venue":
                        query.venue = { contains: value, mode: "insensitive" };
                        break;
                    case "organising_committee":
                        query.organising_committee = { contains: value, mode: "insensitive" };
                        break;
                    case "search":
                        query.title = { contains: value, mode: "insensitive" };
                        break;
                }

            }
        }
    }

    const [offers, count] = await prisma.$transaction([
        prisma.offer.findMany({
            where: query,
            include: {
                category: true,
            },
            orderBy: {
                date: 'desc',
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.offer.count({ where: query }),
    ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-lg font-semibold">All offers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="offer" type="create" />}
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
                  {/* <FormModal table="offer" type="update" data={offer} /> */}
                  <FormModal table="offer" type="delete" id={announcement.id} />
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