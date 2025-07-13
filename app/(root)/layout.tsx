import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import { getCurrentUser } from "@/lib/actions/auth.action";
// import LogoutButton from "./LogoutButton"; // adjust path as needed
// TODO: Uncomment and update the path below if LogoutButton exists elsewhere
 import LogoutButton from "@/components/LogoutButton";
const RootLayout  = async ({children}:{children:ReactNode}) => {
   const user = await getCurrentUser();
  //lets add a check to see if user is autheticated or not
  const isUserAuthenticated=await isAuthenticated();
  if(!isUserAuthenticated)
  {
    redirect('/sign-in');
  }
  return (
    <div className='root-layout'>
      <nav className="flex items-center justify-between px-6 py-4  bg-white">
        <Link href="/" className='flex items-center gap-2'>
         <Image src="/logo.png" alt="logo" height={32} width={38} />
         <h2 className='text-black'>Prepify</h2>
        </Link>
        {/* agr kuch user hai tbhi logout wala button ayega  */}
         {user && <LogoutButton />}
      </nav>
      {children}
    </div>
  )
}

export default RootLayout 
