"use client";

import { useEffect, useState } from "react";
import { GroupType, User, Event, Result } from "@prisma/client";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { useSearchParams } from "next/navigation";
import Table from "@/components/Table";
import ResultDetailsModal from "@/components/ResultDetailsModal";

type ResultList = Result & {
  visible_to: GroupType;
  event: Event;
  announcer: User
}

export default function ResultListClient({
  results,
  count,
  page,
}: {
  results: ResultList[];
  count: number;
  page: number;
}) {
  const [selectedResult, setSelectedResult] = useState<ResultList | null>(null);
  const searchParams = useSearchParams();
  const resultIdFromUrl = searchParams.get("resultId");

  useEffect(() => {
    if (resultIdFromUrl) {
      const match = results.find(o => o.result_id === resultIdFromUrl);
      if (match) setSelectedResult(match);
    }
  }, [resultIdFromUrl, results]);

  const columns = [
    {
      header: "Event Name",
      accessor: "title",
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Started On",
      accessor: "start_time",
      className: "hidden md:table-cell",
    },
    {
      header: "Ended On",
      accessor: "end_time",
      className: "hidden md:table-cell",
    },
    {
      header: "Announced By",
      accessor: "announced_by",
      className: "hidden md:table-cell",
    },
  ];


  const renderRow = (item: ResultList) => (
    <tr
      key={item.result_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight cursor-pointer"
      onClick={() => setSelectedResult(item)}
    >
      <td className="flex items-center gap-4 p-4">{item.event.title}</td>
      <td>{new Intl.DateTimeFormat('en-GB').format(new Date(item.event.date))}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(item.event.start_time))}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(item.event.end_time))}
      </td>
      <td className="hidden md:table-cell">{item.announced_by}</td>
      {/* <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "teacher" && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td> */}
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* {role === "admin" || role === "teacher" && <FormModal table="result" type="create" />} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={results} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />

      {/* MODAL */}
      {selectedResult && (
        <ResultDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}
