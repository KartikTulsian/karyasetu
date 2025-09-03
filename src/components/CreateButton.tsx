"use client"

import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import FormContainer from './FormContainer'

export default function CreateButton(
    {table,} : {table: string}
) {

    const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-[1000]">
        <button 
            onClick={() => setOpen(true)}
            className='h-12 w-12 rounded-full bg-blue-300 text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition'
        >
            <Plus size={24}/>
        </button>

        {open && (
            <div className="fixed inset=0 bg-black/50 flex items-center justify-center z-[1100]">
                <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto p-6 relative">
                    <button
                        className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
                        onClick={() => setOpen(false)}
                    >
                        ✖
                    </button>
                    <FormContainer table={table as any} type='create'/>
                </div>

            </div>
        )}
    </div>
  )
}
