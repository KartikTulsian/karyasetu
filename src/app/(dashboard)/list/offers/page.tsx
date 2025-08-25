import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { GroupType, Prisma } from "@prisma/client";
import OffersListClient from "./OffersListClient";

export default async function OffersListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const params = await searchParams;
  const { page, ...queryParams } = params;
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

  return <OffersListClient offers={offers} count={count} page={p} />;
}
