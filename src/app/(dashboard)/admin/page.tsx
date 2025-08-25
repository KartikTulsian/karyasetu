import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import EventCalendar from "@/components/EventCalendar";
import Offers from "@/components/Offers";
import Image from "next/image";
import ActivityChart from "@/components/ActivityChart";


export default async function AdminPage() {

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  // Fetch user with participation & organised events count
  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      participations: true,
      organisedEvents: true,
      createdTeams: true,
      createdOffers: true,
      uploadedMedia: true,
      announcedResults: true,
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database");
  }

  const participatedCount = dbUser.participations.length;
  const organisedCount = dbUser.organisedEvents.length;
  const teamsCount = dbUser.createdTeams.length;
  const offersCount = dbUser.createdOffers.length;
  const mediaCount = dbUser.uploadedMedia.length;
  const resultsCount = dbUser.announcedResults.length;

  return (
    <div className="p-4 flex gap-6 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        {/* Bio */}
        <div className="bg-[#C3EBFA] p-6 rounded-lg shadow-md flex flex-col lg:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex justify-center lg:justify-start"> 
            <Image
              src={dbUser.profile_pic_url || "/avatar.png"}
              alt="profile_pic"
              width={144}
              height={144}
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Name & Bio */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center lg:text-left">{dbUser.name}</h1>
              <p className="text-sm text-gray-600 mt-1 text-centre lg:text-left">
                {dbUser.bio || "No bio available"}
              </p>
            </div>

            {/* Info Grid */}
            <h3 className="text-orange-600 text-sm font-semibold">Personal Info : </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Image src="/college.png" alt="" width={25} height={25} />
                <span className="text-gray-800">{dbUser.college_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/course.png" alt="" width={25} height={25} />
                <span className="text-gray-800">{dbUser.course} (Year {dbUser.year})</span>
              </div>
              <div className="flex items-center gap-2 break-all">
                <Image src="/mail.png" alt="" width={18} height={18} />
                <span className="text-gray-800">{dbUser.email}</span>
              </div>
              {dbUser.phone_number && (
                <div className="flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={18} height={18} />
                  <span className="text-gray-800">{dbUser.phone_number}</span>
                </div>
              )}
            </div>

            <h3 className="text-orange-600 text-sm font-semibold">Your Stats : </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  img: "/participated.png",
                  count: participatedCount,
                  label: "Participated",
                },
                {
                  img: "/organised_events.png",
                  count: organisedCount,
                  label: "Organised",
                },
                {
                  img: "/group.png",
                  count: teamsCount,
                  label: "Teams Created",
                },
                {
                  img: "/offer.png",
                  count: offersCount,
                  label: "Offers Created",
                },
                {
                  img: "/gallery.png",
                  count: mediaCount,
                  label: "Media Uploaded",
                },
                {
                  img: "/result.png",
                  count: resultsCount,
                  label: "Results Announced",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-indigo-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <Image src={stat.img} alt="" width={25} height={25} />
                  <span className="text-lg font-bold text-gray-900">
                    {stat.count}
                  </span>
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE CHARTS */}
        {/* <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div> */}
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <ActivityChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Offers />
      </div>
    </div>
  );
};
