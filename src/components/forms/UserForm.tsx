"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
    Dispatch,
    SetStateAction,
    startTransition,
    useActionState,
    useEffect,
    useState,
} from "react";
import { userSchema, UserSchema } from "@/lib/formValidationSchema";
import { createUser, updateUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";

const UserForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            college_name: "",
            course: "",
            year: 1,
            phone_number: "",
            bio: "",
            profile_pic_url: "",
        },
    });

    const [img, setImg] = useState<any>();
    const [state, formAction] = useActionState(
        type === "create" ? createUser : updateUser,
        {
            success: false,
            error: false,
        }
    );

    const router = useRouter();

    // 🔹 Reset form when editing existing user
    useEffect(() => {
        if (data) {
            reset({
                name: data.name || "",
                email: data.email || "",
                college_name: data.college_name || "",
                course: data.course || "",
                year: data.year || 1,
                phone_number: data.phone_number || "",
                bio: data.bio || "",
                profile_pic_url: data.profile_pic_url || "",
                user_id: data.user_id || "",
            });
            setImg(
                data.profile_pic_url ? { secure_url: data.profile_pic_url } : null
            );
        }
    }, [data, reset]);

    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    const onSubmit = handleSubmit((formData) => {
        const payload = {
            ...formData,
            profile_pic_url: img?.secure_url || data?.profile_pic_url,
            ...(type === "update" && data?.user_id && { user_id: data.user_id }),
        };

        setHasShownSuccessToast(false);

        startTransition(() => {
            formAction(payload);
        })
    });

    useEffect(() => {
        if (state.success && !hasShownSuccessToast) {
            toast(`User has been ${type === "create" ? "created" : "updated"}!`);
            setHasShownSuccessToast(true);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new User" : "Update User Profile"}
            </h1>

            {/* Authentication Info */}
            <span className="text-xs text-gray-400 font-medium">
                Authentication Information
            </span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Full Name (Withuout Space)" name="name" register={register} error={errors.name} />

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    inputProps={{
                        disabled: true,
                    }}
                />

                {type === "create" && (
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        register={register}
                        error={errors.password}
                    />
                )}

                {type === "update" && (
                    <div className="flex flex-col">
                        <label className="text-md font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="text"
                            {...register("password")}
                            defaultValue={data?.password || ""}
                            readOnly
                            className="border rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                        />
                    </div>
                )}
            </div>

            {/* Personal Info */}
            <span className="text-xs text-gray-400 font-medium">
                Personal Information
            </span>

            {/* Upload Profile Pic */}
            <CldUploadWidget
                uploadPreset="karyasetu"
                onSuccess={(result, { widget }) => {
                    setImg(result.info);
                    widget.close();
                }}
            >
                {({ open }) => (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        <UploadCloud size={18} /> Upload Profile Pic
                    </button>
                )}
            </CldUploadWidget>

            {(img?.secure_url || data?.profile_pic_url) && (
                <div className="relative w-fit mt-2">
                    <Image
                        src={img?.secure_url || data?.profile_pic_url}
                        alt="Poster"
                        width={140}
                        height={140}
                        className="rounded-md object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => setImg(null)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                    >
                        ❌
                    </button>
                </div>
            )}

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="College Name" name="college_name" register={register} error={errors.college_name} />
                <InputField label="Course" name="course" register={register} error={errors.course} />
                <InputField label="Year" name="year" type="number" register={register} error={errors.year} />
                <InputField label="Phone Number" name="phone_number" register={register} error={errors.phone_number} />
                <InputField label="Bio" name="bio" register={register} error={errors.bio} />
                {type === "update" && (
                    //   <InputField label="Id" name="user_id" register={register} />
                    <div className="flex flex-col gap-2 w-full md:w-1/4">
                        <label className="text-xs text-gray-500">
                            User ID
                        </label>
                        <input
                            type="text"
                            {...register("user_id")}
                            defaultValue={data?.user_id || ""}
                            readOnly
                            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
                        />
                    </div>
                )}
            </div>

            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}

            <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
            >
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default UserForm;
