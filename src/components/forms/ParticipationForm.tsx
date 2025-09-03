"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { participationTeamSchema, ParticipationTeamSchema } from "@/lib/formValidationSchema";
import { createParticipation, updateParticipation } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  type: "create" | "update";
  data?: ParticipationTeamSchema;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
  eventId?: string;
};

export default function ParticipationForm({ type, data, setOpen, eventId }: Props) {
  const router = useRouter();

  const defaultValues: ParticipationTeamSchema = {
    participant_name: data?.participant_name || "",
    event_id: eventId || data?.event_id || "",
    is_team_leader: data?.is_team_leader ?? false,
    create_team: data?.create_team ?? false,
    team_name: data?.team_name || "",
    max_team_size: data?.max_team_size ?? undefined,
    member_emails: data?.member_emails || "",
  };

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ParticipationTeamSchema>({
    resolver: zodResolver(participationTeamSchema),
    defaultValues,
  });

  const watchCreateTeam = watch("create_team") || watch("is_team_leader");

  const [state, formAction] = useActionState(
    type === "create" ? createParticipation : updateParticipation,
    { success: false, error: false }
  );

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const onSubmit = handleSubmit((formData) => {
    const payload: ParticipationTeamSchema = {
      ...formData,
      is_team_leader: formData.is_team_leader ?? false,
      create_team: formData.create_team ?? false,
      event_id: eventId || formData.event_id,
      member_emails: formData.member_emails || "",
    };
    setHasShownSuccessToast(false);
    startTransition(() => {
      formAction(payload);
    })
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast(`Participation has been ${type === "create" ? "created" : "updated"}!`);
      setHasShownSuccessToast(true);
      if (type === "create") reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type, reset, hasShownSuccessToast]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold text-center">
        {type === "create" ? "Register for the Event" : "Update Your Registration"}
      </h1>

      {/* Section: Participant Info */}
      <div className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">👤 Your Information</h2>

        <InputField
          label="Your Full Name"
          name="participant_name"
          defaultValue={defaultValues.participant_name}
          register={register}
          error={errors.participant_name}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_team_leader")}
            id="is_team_leader"
            className="h-4 w-4 accent-blue-500"
          />
          <label htmlFor="is_team_leader" className="text-sm text-gray-700">
            I am creating a team / acting as team leader
          </label>
        </div>
      </div>

      {/* Section: Team Info */}
      {watchCreateTeam && (
        <div className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-700">👥 Team Information</h2>

          <InputField
            label="Team Name"
            name="team_name"
            defaultValue={defaultValues.team_name}
            register={register}
            error={errors.team_name}
          />

          <InputField
            label="Maximum Team Size"
            name="max_team_size"
            type="number"
            defaultValue={defaultValues.max_team_size?.toString() || ""}
            register={register}
            error={errors.max_team_size}
            inputProps={{ placeholder: "e.g., 4" }}
          />

          <InputField
            label="Team Member Emails"
            name="member_emails"
            defaultValue={defaultValues.member_emails}
            register={register}
            error={errors.member_emails}
            inputProps={{
              placeholder: "Enter emails separated by commas (excluding leader)",
            }}
          />
          <p className="text-xs text-gray-500">
            🔹 Please don’t include your own email here (as leader). Only list additional members.
          </p>
        </div>
      )}

      {state.error && (
        <span className="text-red-500 text-sm text-center">
          {typeof state.error === "string" ? state.error : "Something went wrong!"}
        </span>
      )}

      <button
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
      >
        {type === "create" ? "🚀 Register Now" : "💾 Update Registration"}
      </button>
    </form>
  );
}
