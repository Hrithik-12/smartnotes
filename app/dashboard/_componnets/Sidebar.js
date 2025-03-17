'use client'
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import Uploadpdf from "./uploadpdf";
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import Link from "next/link";

export default function Sidebar() {
  const {user} = useUser();
  const filelist = useQuery(api.Pdfstorage.Getuserfile, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  });
  return (
    <div className="shadow-md h-screen p-5">
      <Link className="cursor-pointer" href={'/'}>
      <Image src="/logo.jpg" width={70} height={70} alt="logo" />
      </Link>
      <div className="mt-10">
        <Uploadpdf>
          <Button className="w-full" asChild>
            <div>+ Upload Pdf</div>
          </Button>
        </Uploadpdf>
        <div className="flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Layout />
          <h2>WorkSpace</h2>
        </div>
        {/* <div className="flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Shield />
          <h2>Upgrade</h2>
        </div> */}
      </div>
      {/* <div className="absolute bottom-20 w-[80%]">
        <Progress value={33} />
        <p className="text-center text-sm mt-2">2 out of 6 uploads remaining</p>
        <p className="text-center text-xs mt-2 text-slate-400">
          <a href="#" className="text-blue-500">
            Upgrade to premium
          </a>{" "}
          for unlimited uploads
        </p>
      </div> */}
    </div>
  );
}
