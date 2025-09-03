"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchema";
import { createResult, updateResult } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

type Props = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
};

export default function ResultForm({ type, data, setOpen, relatedData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      ...data,
    },
  });

  const [media, setMedia] = useState<any>(data?.media_url || null);
  // const [events, setEvents] = useState<{ event_id: string; title: string }[]>([]);
  const router = useRouter();

  // Fetch ongoing/completed events for dropdown
  // useEffect(() => {
  //   async function fetchEvents() {
  //     try {
  //       const res = await fetch("/api/events"); // We'll create this endpoint to return events
  //       const data = await res.json();
  //       setEvents(data);
  //     } catch (err) {
  //       console.error("Failed to fetch events", err);
  //     }
  //   }
  //   fetchEvents();
  // }, []);

  const [state, formAction] = useActionState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false }
  );

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      media_url: media?.secure_url || media || data?.media_url || null,
      event_id: data?.event_id,
    };
    setHasShownSuccessToast(false);
    startTransition(() => {
      formAction(payload);
    })
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setHasShownSuccessToast(true);
      if (type === "create") {
        reset();
        setMedia(null);
      }
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Publish Result" : "Update Result"}
      </h1>

      {/* Result Text Area */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs text-gray-500">Result Text</label>
        <textarea
          {...register("result_text")}
          defaultValue={data?.result_text || ""}
          rows={6}   // larger text area
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full resize-none"
        />
        {errors.result_text?.message && (
          <p className="text-xs text-red-400">{errors.result_text.message}</p>
        )}
      </div>

      {/* Visible To */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Visible To</label>
        <select
          {...register("visible_to")}
          defaultValue={data?.visible_to || ""}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        >
          <option value="">Select Group</option>
          <option value="ALL">All</option>
          <option value="COLLEGE">College</option>
          <option value="EVENT_PARTICIPANTS">Event Participants</option>
        </select>
        {errors.visible_to?.message && (
          <p className="text-xs text-red-400">{errors.visible_to.message}</p>
        )}
      </div>

      {/* Media Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Media Preview</label>
        <CldUploadWidget
          uploadPreset="karyasetu"
          onSuccess={(result, { widget }) => {
            setMedia(result.info);
            widget.close();
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <UploadCloud size={18} /> Upload Media
            </button>
          )}
        </CldUploadWidget>

        {(media?.secure_url || media) && (
          <div className="relative w-fit mt-2">
            <Image
              src={media?.secure_url || media?.media_url}
              alt="Media Preview"
              width={140}
              height={140}
              className="rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
            >
              ❌
            </button>
          </div>
        )}
      </div>

      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Publish" : "Update"}
      </button>
    </form>
  );
}