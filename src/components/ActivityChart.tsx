"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    participated: 4000,
    organised: 2400,
  },
  {
    name: "Feb",
    participated: 3000,
    organised: 1398,
  },
  {
    name: "Mar",
    participated: 2000,
    organised: 9800,
  },
  {
    name: "Apr",
    participated: 2780,
    organised: 3908,
  },
  {
    name: "May",
    participated: 1890,
    organised: 4800,
  },
  {
    name: "Jun",
    participated: 2390,
    organised: 3800,
  },
  {
    name: "Jul",
    participated: 3490,
    organised: 4300,
  },
  {
    name: "Aug",
    participated: 3490,
    organised: 4300,
  },
  {
    name: "Sep",
    participated: 3490,
    organised: 4300,
  },
  {
    name: "Oct",
    participated: 3490,
    organised: 4300,
  },
  {
    name: "Nov",
    participated: 3490,
    organised: 4300,
  },
  {
    name: "Dec",
    participated: 3490,
    organised: 4300,
  },
];

export default function ActivityChart() {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Activity</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="participated"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line type="monotone" dataKey="organised" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

