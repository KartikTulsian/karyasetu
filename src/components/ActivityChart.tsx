import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import ChartClient from "./ChartClient";

// const data = [
//   {
//     name: "Jan",
//     participated: 4000,
//     organised: 2400,
//   },
//   {
//     name: "Feb",
//     participated: 3000,
//     organised: 1398,
//   },
//   {
//     name: "Mar",
//     participated: 2000,
//     organised: 9800,
//   },
//   {
//     name: "Apr",
//     participated: 2780,
//     organised: 3908,
//   },
//   {
//     name: "May",
//     participated: 1890,
//     organised: 4800,
//   },
//   {
//     name: "Jun",
//     participated: 2390,
//     organised: 3800,
//   },
//   {
//     name: "Jul",
//     participated: 3490,
//     organised: 4300,
//   },
//   {
//     name: "Aug",
//     participated: 3490,
//     organised: 4300,
//   },
//   {
//     name: "Sep",
//     participated: 3490,
//     organised: 4300,
//   },
//   {
//     name: "Oct",
//     participated: 3490,
//     organised: 4300,
//   },
//   {
//     name: "Nov",
//     participated: 3490,
//     organised: 4300,
//   },
//   {
//     name: "Dec",
//     participated: 3490,
//     organised: 4300,
//   },
// ];

// function getMonthName(data: Date) {
//   return data.toLocaleString("en-Us", { month: "short" });
// }

export default async function ActivityChart() {

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email not found");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      participations: {
        select: { event: { select: { date: true } } },
      },

      organisedEvents: {
        select: { date: true },
      },
    },
  });

  if (!dbUser) return <div>No activity found</div>;

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2025, i, 1).toLocaleString("en-US", { month: "short" }),
    participated: 0,
    organised: 0,
  }));

  dbUser.participations.forEach((p) => {
    const month = new Date(p.event.date).getMonth();
    monthlyData[month].participated += 1;
  });

  dbUser.organisedEvents.forEach((e) => {
    const month = new Date(e.date).getMonth();
    monthlyData[month].organised += 1;
  })

  return (
    <Suspense fallback={<div>Loading Chart...</div>}>
      <ChartClient data={monthlyData}/>
    </Suspense>
  );
};

