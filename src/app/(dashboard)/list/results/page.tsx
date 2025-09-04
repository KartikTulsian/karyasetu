import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import ResultListModalServer from "./ResultListModalServer";

export default async function ResultListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  
  const params = await searchParams;
  const { page, resultId, ...queryParams } = params;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "date":
            query.event = {
              ...(query.event as Prisma.EventWhereInput),
              date: { equals: new Date(value) },
            };
            break;

          case "announced_by":
            query.announced_by = { contains: value, mode: "insensitive" };
            break;

          case "result_text":
            query.result_text = { contains: value, mode: "insensitive" };
            break;

          case "organising_committee":
            query.event = {
              ...(query.event as Prisma.EventWhereInput),
              organising_committee: { contains: value, mode: "insensitive" },
            };
            break;

          case "search":
            query.event = {
              ...(query.event as Prisma.EventWhereInput),
              title: { contains: value, mode: "insensitive" },
            };
            break;
        }
      }
    }
  }


  const [results, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        event: true,
        announcer: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ])

  const selectedResult = resultId
    ? await prisma.result.findUnique({
      where: { result_id: resultId },
      include: { announcer: true, event: true },
    })
    : null;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* <OffersListClient offers={offers} count={count} page={p} /> */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">All Results</h1>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {results.map((result) => (
          <Link
            key={result.result_id}
            href={`?resultId=${result.result_id}&page=${p}`}
            scroll={false}
          >
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-[#5e5e85] mb-2">{result.event.title}</h2>
                <p className="text-sm text-gray-500">Date: {new Intl.DateTimeFormat('en-GB').format(new Date(result.event.date))}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Group: {result.visible_to}</p>
                <p>Announced By: {result.announced_by}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={p} count={count} />

      {/* <div className="fixed bottom-6 right-5 z-[1000]">
        <div
          className='h-12 w-12 rounded-full bg-[#FAE27C] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition'
        >
          <FormContainer table='result' type='create' />
        </div>
      </div> */}

      {selectedResult && (
        <ResultListModalServer
          result={selectedResult}
          onCloseUrl={`/list/results?page=${p}`}
        />
      )}

    </div>

  );
}

