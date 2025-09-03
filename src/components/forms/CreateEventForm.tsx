"use client";

import { Resolver, useForm } from "react-hook-form";
import { eventSchema, EventSchema } from "@/lib/formValidationSchema";
import { Dispatch, useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "../InputField";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { createEvent, updateEvent } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UploadCloud, ImageIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";

export default function CreateEventForm({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema) as Resolver<EventSchema>,
    defaultValues: {
      ...data,
      event_id: data?.event_id || "",
      date: data?.date ? new Date(data.date).toISOString().split("T")[0] : "",
      registration_deadline: data?.registration_deadline
        ? new Date(data.registration_deadline).toISOString().split("T")[0]
        : "",
      startTime: data?.start_time
        ? new Date(data.start_time).toISOString().slice(11, 16)
        : "",
      endTime: data?.end_time
        ? new Date(data.end_time).toISOString().slice(11, 16)
        : "",
      clubs: data?.clubs?.map((club: any) => club.club_id) || [],
      use_custom_form: data?.use_custom_form ?? false,
    },
  });

  const isCustomForm = watch("use_custom_form");

  const [poster, setPoster] = useState<any>(
    data?.poster_url ? { secure_url: data.poster_url } : null
  );
  const [gallery, setGallery] = useState<any[]>(
    data?.gallery?.map((g: any) => g.media_url || g) || []
  );

  const router = useRouter();

  const [selectedClubs, setSelectedClubs] = useState<any[]>(
    data?.clubs?.map((c: any) => ({
      label: c.name,
      value: c.club_id,
    })) || []
  );

  const [state, formAction] = useActionState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {

    console.log("Form submitted with data:", formData);
    console.log("Event ID:", formData.event_id);

    const payload = {
      ...formData,
      event_id: formData.event_id || data?.event_id,
      poster_url: poster?.secure_url || data?.poster_url,
      gallery: gallery.map((g) => (typeof g === "string" ? g : g.secure_url)), // send array of image URLs
      // ...(type === "update" && data?.event_id && { event_id: data.event_id }),
      clubs: selectedClubs.map((c: any) => c.value),
      
    };

    setHasShownSuccessToast(false);

    startTransition(() => {
      formAction(payload);
    })

  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast.success(
        `🎉 Event has been ${type === "create" ? "created" : "updated"}!`
      );
      setHasShownSuccessToast(true); // ✅ prevents duplicate toasts

      if (type === "create") {
        reset();
        setPoster(null);
        setGallery([]);
        setSelectedClubs([]);
      }

      setOpen(false);
      router.refresh();
    }
  }, [state.success, hasShownSuccessToast, type, reset, router, setOpen]);


  useEffect(() => {
    if (data && type === "update") {
      if (data.poster_url && !poster) {
        setPoster({ secure_url: data.poster_url });
      }

      if (data.gallery && gallery.length === 0) {
        setGallery(data.gallery.map((g: any) => g.media_url || g));
      }

      if (data.clubs && selectedClubs.length === 0) {
        setSelectedClubs(
          data.clubs.map((c: any) => ({
            label: c.name,
            value: c.club_id,
          }))
        );
      }
    }
  }, [data, type, poster, gallery.length, selectedClubs.length]);

  useEffect(() => {
    register("event_id");
    if (data?.event_id) {
      setValue("event_id", data.event_id);
    }
  }, [register, setValue, data?.event_id]);



  return (
    <form
      className="flex flex-col gap-8 bg-white shadow-lg rounded-2xl p-6"
      onSubmit={onSubmit}
    >
      {/* <h1 className="text-2xl font-bold text-gray-800 flex gap-2">
        {type === "create" ? "🎉 Create New Event" : "✏️ Update Event"}
      </h1> */}

      {/* Event Info */}

      <div className="flex flex-wrap gap-6">
        {type === "update" && (
          <div className="flex flex-col">
            <label className="text-md font-medium text-gray-600">
              Event ID
            </label>
            <input
              type="text"
              {...register("event_id")}
              defaultValue={data?.event_id || ""}
              readOnly
              className="border rounded-md px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>
        )}


        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <InputField
          label="Venue"
          name="venue"
          defaultValue={data?.venue}
          register={register}
          error={errors?.venue}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={data?.date ? new Date(data.date).toISOString().split("T")[0] : ""}
          register={register}
          error={errors?.date}
        />
        <InputField
          label="Registration Deadline"
          name="registration_deadline"
          type="date"
          defaultValue={data?.registration_deadline ? new Date(data.registration_deadline).toISOString().split("T")[0] : ""}
          register={register}
          error={errors?.registration_deadline}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="time"
          defaultValue={data?.start_time ? new Date(data.start_time).toISOString().slice(11, 16) : ""}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="time"
          defaultValue={data?.end_time ? new Date(data.end_time).toISOString().slice(11, 16) : ""}
          register={register}
          error={errors?.endTime}
        />
        <InputField
          label="Entry Fee"
          name="entry_fee"
          type="number"
          defaultValue={data?.entry_fee}
          register={register}
          error={errors?.entry_fee}
        />
        <InputField
          label="Max Team Size"
          name="max_team_size"
          type="number"
          defaultValue={data?.max_team_size}
          register={register}
          error={errors?.max_team_size}
        />
        {/* Toggle for custom registration form */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            {...register("use_custom_form")}
            defaultChecked={data?.use_custom_form}
          />
          <label className="text-md font-medium text-gray-600">
            Use built-in registration form
          </label>
        </div>

        {/* Registration Link (only if not using custom form) */}
        {!isCustomForm && (
          <InputField
            label="Registration Link"
            name="registration_link"
            type="url"
            defaultValue={data?.registration_link}
            register={register}
            error={errors?.registration_link}
          />
        )}

        <InputField
          label="Organising Committee"
          name="organising_committee"
          defaultValue={data?.organising_committee}
          register={register}
          error={errors?.organising_committee}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          className="ring-1 ring-gray-300 p-3 rounded-md text-sm w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          {...register("description")}
          defaultValue={data?.description}
          rows={5}
        />
        {errors.description?.message && (
          <p className="text-xs text-red-500">{errors.description.message.toString()}</p>
        )}
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">Event Status</label>
          <select className="w-full p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-yellow-500" {...register("event_status")} defaultValue={data?.event_status}>
            <option value="">Select Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">Visibility</label>
          <select className="w-full p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-yellow-500" {...register("visibility")} defaultValue={data?.visibility}>
            <option value="">Select Visibility</option>
            <option value="PUBLIC">Public</option>
            <option value="COLLEGE">College Only</option>
            <option value="GROUP">Group Only</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Category</label>
          <select className="w-full p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-yellow-500" {...register("category")} defaultValue={data?.category}>
            <option value="">Select Category</option>
            {relatedData?.categories?.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Organiser + Clubs */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Organiser</label>
          <select className="w-full p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-yellow-500" {...register("organiser_user_id")} defaultValue={data?.organiser_user_id}>
            <option value="">Select Organiser</option>
            {relatedData?.organisers?.map((org: any) => (
              <option key={org.user_id} value={org.user_id}>{org.name} ({org.email})</option>
            ))}
          </select>
        </div>

        {/* <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Associated Clubs</label>
          <select multiple className="w-full p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-yellow-500" {...register("clubs")}>
            {relatedData?.clubs?.map((club: any) => (
              <option key={club.club_id} value={club.club_id}>{club.name}</option>
            ))}
          </select>
        </div> */}

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Associated Clubs</label>

          <CreatableSelect
            isMulti
            options={relatedData?.clubs?.map((club: any) => ({
              label: club.name,
              value: club.club_id,
            }))}
            onChange={(selectedOptions: any) => {
              // Only handle selection of existing clubs
              setSelectedClubs(selectedOptions || []);
            }}
            // defaultValue={data?.clubs?.map((c: any) => ({
            //   label: c.name,
            //   value: c.club_id,
            // }))}
            value={selectedClubs}
            placeholder="Select clubs..."
            isClearable
            formatCreateLabel={() => null} // disables "create new" label
          />
        </div>



      </div>

      {/* Poster Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Event Poster</label>
        <CldUploadWidget
          uploadPreset="karyasetu"
          onSuccess={(result, { widget }) => {
            setPoster(result.info);
            widget.close();
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <UploadCloud size={18} /> Upload Poster
            </button>
          )}
        </CldUploadWidget>

        {(poster?.secure_url || data?.poster_url) && (
          <div className="relative w-fit mt-2">
            <Image
              src={poster?.secure_url || data?.poster_url}
              alt="Poster"
              width={140}
              height={140}
              className="rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => setPoster(null)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
            >
              ❌
            </button>
          </div>
        )}
      </div>

      {/* Event Gallery Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">Event Gallery</label>
        <CldUploadWidget
          uploadPreset="karyasetu"
          options={{ multiple: true, resourceType: "auto" }}
          onSuccess={(result: any, { widget }) => {
            // result.event === 'success' triggers per file
            if (result?.info && typeof result.info === "object" && "secure_url" in result.info) {
              const url = result.info.secure_url;
              setGallery((prev) => [...prev, url]);
            }
            // Don't close the widget immediately, let user upload multiple files
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <ImageIcon size={18} /> Upload Gallery Images/Videos
            </button>
          )}
        </CldUploadWidget>



        {/* Preview Thumbnails */}
        <div className="flex flex-wrap gap-3 mt-2">
          {gallery.map((img: any, idx) => {
            const url = typeof img === "string" ? img : img.secure_url;
            const isVideo = url.match(/\.(mp4|mov|webm)$/i);

            return (
              <div key={idx} className="relative w-[100px] h-[100px]">
                {isVideo ? (
                  <video src={url} controls className="rounded-md object-cover w-full h-full" />
                ) : (
                  <Image src={url} alt="Gallery" fill className="rounded-md object-cover" />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setGallery((prev) =>
                      prev.filter((g) =>
                        typeof g === "string" ? g !== url : g.secure_url !== url
                      )
                    )
                  }
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                >
                  ❌
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {state.error && <span className="text-red-500">❌ Something went wrong!</span>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {isPending ? (
          "Processing..."
        ) : (
          <>
            {type === "create" ? <Plus size={18} /> : <UploadCloud size={18} />}
            {type === "create" ? "Create Event" : "Update Event"}
          </>
        )}
      </button>
    </form>
  );
}