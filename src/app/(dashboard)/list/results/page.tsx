import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import ResultListClient from "./ResultListClient";

export default async function ResultListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {

  const params = await searchParams;
  const { page, ...queryParams } = params;

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


  return <ResultListClient results={results} count={count} page={p} />;
};

