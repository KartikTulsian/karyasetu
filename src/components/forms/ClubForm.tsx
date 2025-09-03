"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { clubSchema, ClubSchema } from "@/lib/formValidationSchema";
import { createClub, updateClub } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ClubForm({
    type,
    data,
    setOpen,
    relatedData
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
    } = useForm<ClubSchema>({
        resolver: zodResolver(clubSchema),
        defaultValues: {
            name: data?.name || "",
            description: data?.description || "",
            college_name: data?.college_name || "",
            eventLinks: data?.eventLinks
                ? data.eventLinks.map((e: any) => e.event?.title).join(", ")
                : "",
        },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createClub : updateClub,
        { success: false, error: false }
    );

    const onSubmit = handleSubmit((formData) => {
        const payload = {
            ...formData,
            eventLinks: formData.eventLinks
                ? formData.eventLinks.split(",").map((s) => s.trim())
                : [],
            ...(type === "update" && data?.club_id && { club_id: data.club_id }),
        };
        formAction(payload);
    });


    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(
                `Club has been ${type === "create" ? "created" : "updated"} successfully!`
            );
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new Club" : "Update the Club"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Club Name"
                    name="name"
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Description"
                    name="description"
                    register={register}
                    error={errors?.description}
                />
                <InputField
                    label="College Name"
                    name="college_name"
                    register={register}
                    error={errors?.college_name}
                />
                <InputField
                    label="Event Names (comma separated)"
                    name="eventLinks"
                    register={register}
                    error={errors?.eventLinks}
                />
            </div>

            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
}
