"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { offerSchema, OfferSchema } from "@/lib/formValidationSchema";
import { createOffer, updateOffer } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UserOfferForm({
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
  } = useForm<OfferSchema>({
    resolver: zodResolver(offerSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createOffer : updateOffer,
    {
      success: false,
      error: false,
    }
  );

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      ...(type === "update" && data?.event_id && { event_id: data.event_id }),
    };

    setHasShownSuccessToast(false);
    startTransition(() => {
      formAction(payload);
    })
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(
        `Offer has been ${type === "create" ? "created" : "updated"}!`
      );
      setHasShownSuccessToast(true);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen, hasShownSuccessToast]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Offer" : "Update the Offer"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Offer Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Target College Name"
          name="target_college_name"
          defaultValue={data?.target_college_name}
          register={register}
          error={errors?.target_college_name}
        />
        <InputField
          label="Target Event Name"
          name="target_event_name"
          defaultValue={data?.target_event_name}
          register={register}
          error={errors?.target_event_name}
        />

        {/* Group Type */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Target Group Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("target_group_type")}
            defaultValue={data?.target_group_type || ""}
          >
            <option value="">Select Group</option>
            <option value="ALL">All</option>
            <option value="COLLEGE">College</option>
            <option value="EVENT_PARTICIPANTS">Event Participants</option>
          </select>
          {errors.target_group_type?.message && (
            <p className="text-xs text-red-400">
              {errors.target_group_type.message.toString()}
            </p>
          )}
        </div>

        {/* Offer Type */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Offer Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("offer_type")}
            defaultValue={data?.offer_type || ""}
          >
            <option value="">Select Offer Type</option>
            <option value="TEAM_RECRUITMENT">Team Recruitment</option>
            <option value="ANNOUNCEMENT">Announcement</option>
          </select>
          {errors.offer_type?.message && (
            <p className="text-xs text-red-400">
              {errors.offer_type.message.toString()}
            </p>
          )}
        </div>

        {/* Hidden ID when updating */}
        {data && data.offer_id && (
          <InputField
            label="ID"
            name="offer_id"
            defaultValue={data?.offer_id}
            register={register}
            error={errors?.offer_id}
          />
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}

