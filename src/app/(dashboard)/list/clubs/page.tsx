import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import ClubsDetailsModelServer from "./ClubsDetailsModelServer";

export default async function ClubsListPage() {
  // const params = await searchParams;
  // const { page, clubId, ...queryParams } = params;
  const p = 1;

  const query: Prisma.ClubWhereInput = {};

  // if (queryParams) {
  //   for (const [key, value] of Object.entries(queryParams)) {
  //     if (value !== undefined) {
  //       switch (key) {
  //         case "name":
  //         case "search":
  //           query.name = { contains: value, mode: "insensitive" };
  //           break;
  //         case "college_name":
  //           query.college_name = { contains: value, mode: "insensitive" };
  //           break;
  //       }
  //     }
  //   }
  // }

  const [clubs, count] = await prisma.$transaction([
    prisma.club.findMany({
      where: query,
      include: {
        eventLinks: {
          include: { event: true },
        },
      },
      orderBy: { name: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.club.count({ where: query }),
  ]);

  // const selectedClub = clubId
  //   ? await prisma.club.findUnique({
  //       where: { club_id: clubId },
  //       include: {
  //         eventLinks: {
  //           include: { event: true },
  //         },
  //       },
  //     })
  //   : null;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl font-semibold text-lg">All Clubs</h1>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {clubs.map((club) => (
          <Link
            key={club.club_id}
            href={`?clubId=${club.club_id}&page=${p}`}
            scroll={false}
          >
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-[#54537e] mb-2">
                  {club.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {club.description || "No description"}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>College Name: {club.college_name}</p>
                <p>
                  Events:{" "}
                  {club.eventLinks.length > 0
                    ? club.eventLinks.map((el) => el.event.title).join(", ")
                    : "No events"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* <Pagination page={p} count={count} /> */}

      {/* <div className="fixed bottom-6 right-5 z-[1000]">
        <div className="h-12 w-12 rounded-full bg-[#FAE27C] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition">
          <FormContainer table="club" type="create" />
        </div>
      </div> */}

      {/* {selectedClub && (
        <ClubsDetailsModelServer
          club={selectedClub}
          onCloseUrl={`/list/clubs?page=${p}`}
        />
      )} */}
    </div>
  );
}
