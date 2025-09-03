import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { GroupType, Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";
import OfferDetailsModalServer from "@/components/OfferDetailsModalServer";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";

export default async function OffersListPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const { page, offerId, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.OfferWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "title":
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          case "created_by":
            query.created_by = { contains: value, mode: "insensitive" };
            break;
          case "target_group_type":
            query.target_group_type = value as GroupType;
            break;
          case "target_college_name":
            query.target_college_name = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  const [offers, count] = await prisma.$transaction([
    prisma.offer.findMany({
      where: query,
      include: { creator: true, event: true },
      orderBy: { title: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.offer.count({ where: query }),
  ]);

  const selectedOffer = offerId
    ? await prisma.offer.findUnique({
      where: { offer_id: offerId },
      include: { creator: true, event: true },
    })
    : null;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* <OffersListClient offers={offers} count={count} page={p} /> */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">All Offers</h1>
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

      <div className="grid grid-cols-3 sm:grid-col-2 md:grid-cold-3 gap-6 mt-6">
        {offers.map((offer) => (
          <Link
            key={offer.offer_id}
            href={`?offerId=${offer.offer_id}&page=${p}`}
            scroll={false}
          >
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-[#5e5e85] mb-2">{offer.title}</h2>
                <p className="text-sm text-gray-500">Offered By: {offer.creator.name}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Event: {offer.event?.title}</p>
                <p>Date: {new Intl.DateTimeFormat("en-US").format(new Date(offer.created_at))}</p>
                <p>Group: {offer.target_group_type}</p>
                <p>Referred College: {offer.target_college_name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={p} count={count} />

      <div className="fixed bottom-6 right-5 z-[1000]">
        <div
          className='h-12 w-12 rounded-full bg-[#FAE27C] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition'
        >
          {/* <Plus size={24} /> */}
          <FormContainer table='offer' type='create' />
        </div>
      </div>

      {selectedOffer && (
        <OfferDetailsModalServer
          offer={selectedOffer}
          onCloseUrl={`/list/offers?page=${p}`}
        />
      )}

    </div>

  );
}
