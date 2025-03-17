import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function WorkspaceHeader({FileName}) {
  return (
    <div className='p-2 flex items-center justify-between shadow'>
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
       <Link className='cursor-pointer' href={'/'}>
       <Image src="/logo.jpg" alt="logo" width={60} height={60} /></Link>
      </div>
      <h2 className='text-slate-500 text-3xl uppercase font-semibold'>{FileName}</h2>
      <UserButton/>
    </div>
  )
}

export default WorkspaceHeader