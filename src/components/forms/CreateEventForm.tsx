import React, { Dispatch } from 'react'

export default function CreateEventForm({type, 
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
}) {
  return (
    <div>
      
    </div>
  )
}
