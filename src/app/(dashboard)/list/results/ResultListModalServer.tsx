import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";
import { Event, Result, User } from "@prisma/client";
import Image from "next/image"; // assuming you have this
import Link from "next/link";

type ResultWithRelations = Result & {
  announcer: User;
  event: Event | null;
};

export default async function ResultListModalServer({
  result,
  onCloseUrl,
}: {
  result: ResultWithRelations;
  onCloseUrl: string;
}) {
  const { userId } = await auth();
  const isCreator = userId === result.announced_by;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6 flex items-center gap-4">
          <Image
            src={result.announcer.profile_pic_url || "/avatar.png"}
            alt={result.announcer.name}
            width={56}
            height={56}
            className="rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex flex-col flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              📢 Result Announcement
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Announced by <span className="font-medium">{result.announcer.name}</span> ({result.announcer.email})
            </p>
          </div>
          {isCreator && (
            <div className="flex gap-2 mt-2">
              <FormContainer table="result" type="update" data={result} id={result.result_id} />
              <FormContainer table="result" type="delete" id={result.result_id} />
            </div>
          )}
          <a
            href={onCloseUrl}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white/80 hover:text-white text-lg sm:text-xl"
          >
            ✕
          </a>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Result Text */}
          <p className="text-gray-700 leading-relaxed">{result.result_text}</p>

          {/* Media Preview */}
          {result.media_url && (
            <div className="rounded-xl overflow-hidden shadow-md max-h-[300px] sm:max-h-[400px]">
              {/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(result.media_url) ? (
                <Image
                  src={result.media_url}
                  alt="Result Media"
                  width={700}
                  height={300}
                  className="object-cover w-full h-full"
                />
              ) : /\.(mp4|webm|ogg)$/i.test(result.media_url) ? (
                <video
                  src={result.media_url}
                  controls
                  className="w-full max-h-[300px] sm:max-h-[400px] rounded-xl"
                />
              ) : /\.(pdf)$/i.test(result.media_url) ? (
                <Link
                  href={result.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-100 text-blue-600 p-4 rounded-lg text-center hover:underline"
                >
                  📄 View PDF
                </Link>
              ) : (
                <Link
                  href={result.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-100 text-blue-600 p-4 rounded-lg text-center hover:underline"
                >
                  🔗 Open File
                </Link>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg shadow-sm">
              <Image src="/group.png" alt="" width={20} height={20} />
              <span>
                <strong>Visible To:</strong> {result.visible_to}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg shadow-sm">
              <Image src="/date.png" alt="" width={20} height={20} />
              <span>
                <strong>Date Created:</strong>{" "}
                {new Intl.DateTimeFormat("en-US").format(new Date(result.created_at))}
              </span>
            </div>
          </div>

          {/* Related Event */}
          {result.event && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4 shadow-sm">
              <h3 className="font-semibold text-purple-800 mb-1">🎉 Related Event</h3>
              <p>
                <strong>Title:</strong> {result.event.title}
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                {new Intl.DateTimeFormat("en-US").format(new Date(result.event.date))}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Image src="/pin_point.png" alt="" width={20} height={20} />
                {result.event.venue}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

