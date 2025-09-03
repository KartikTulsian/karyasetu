"use client";

import { deleteClub, deleteEvent, deleteOffer, deleteParticipation, deleteResult, deleteUser } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { Dispatch, JSX, useState, useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  event: deleteEvent,
  offer: deleteOffer,
  club: deleteClub,
  result: deleteResult,
  eventParticipation: deleteParticipation,
  user: deleteUser
}

const UserForm = dynamic(() => import("./forms/UserForm"), {
  loading: () => <h1>Loading...</h1>,
});

const CreateEventForm = dynamic(() => import("./forms/CreateEventForm"), {
  loading: () => <h1>Loading...</h1>,
});

const OfferForm = dynamic(() => import("./forms/UserOfferForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ClubForm = dynamic(() => import("./forms/ClubForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ParticipationForm = dynamic(() => import("./forms/ParticipationForm"), {
  loading: () => <h1>Loading...</h1>,
});


const forms: {
  [key: string]: (
    setOpen: Dispatch<React.SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  // teacher: (type, data) => <TeacherForm type={type} data={data} />,
  // student: (type, data) => <StudentForm type={type} data={data} />,
  user: (setOpen, type, data, relatedData) => <UserForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  event: (setOpen, type, data, relatedData) => <CreateEventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  offer: (setOpen, type, data, relatedData) => <OfferForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  club: (setOpen, type, data, relatedData) => <ClubForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  result: (setOpen, type, data, relatedData) => <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  eventParticipation: (setOpen, type, data, relatedData) => <ParticipationForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
};

export default function FormModal({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
        ? "bg-[#8286ff]"
        : "bg-[#cb70ff]";

  const [open, setOpen] = useState(false);

  const Form = () => {

    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter()

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state]);

    return type === "delete" && id ? (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData();

          switch (table) {
            case "eventParticipation":
              formData.append("participation_id", id!);
              break;
            case "event":
              formData.append("event_id", id!);
              break;
            case "offer":
            case "club":
            case "result":
              formData.append("id", id!);
              break;
            default:
              console.warn(`No delete mapping for table: ${table}`);
          }

          await formAction(formData);
        }}
        className="p-4 flex flex-col gap-4"
      >
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer"
        >
          Delete
        </button>
      </form>


    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
      // "craete or update form"
    ) : (
      "Form not found!"
    );
  };

  return (
    <div>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt='' width={14} height={14} />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
        >
          <div className="bg-white rounded-2xl relative w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {type === "create"
                  ? `Create ${table}`
                  : type === "update"
                    ? `Update ${table}`
                    : `Delete ${table}`}
              </h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                <Image src="/close.png" alt="Close" width={20} height={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Form />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

