'use client'
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

function page() {
  const {user} = useUser();
  const filelist = useQuery(api.Pdfstorage.Getuserfile, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });

  // Skeleton loader component
  const SkeletonLoader = () => (
    Array(7).fill(0).map((_, index) => (
      <div key={index} className="flex p-3 bg-slate-50 shadow-sm flex-col items-center justify-center animate-pulse">
        <div className="w-[70px] h-[70px] bg-slate-200 rounded" />
        <div className="mt-3 w-24 h-4 bg-slate-200 rounded" />
      </div>
    ))
  );

  return (
    <div>
      <h2 className='text-3xl font-semibold'>Your Work...</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5'>
        {!filelist || filelist.length === 0 ? (
          <SkeletonLoader />
        ) : (
          filelist.map((file, ind) => (
            <Link key={ind} href={'/workspace/' + file?.FileId}>
              <div className='flex p-3 shadow-md flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all'>
                <Image src={'/sheet.png'} alt='/file' width={70} height={70} />
                <h2 className='mt-3 font-medium text-lg'>{file?.FileName}</h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default page