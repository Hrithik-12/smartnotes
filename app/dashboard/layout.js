import React from 'react'
import Header from './_componnets/Header'
import Sidebar from './_componnets/Sidebar'
import { Toaster } from 'sonner'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className='md:w-64 h-screen fixed left-0 top-0 border-r bg-white transition-all duration-300 ease-in-out'>
        <Sidebar/>
      </div>
      <div className='md:ml-64 min-h-screen'>
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <Header/>
        </div>
        <main className='p-8 lg:p-10 max-w-7xl mx-auto'>
          {children}
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}