import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout  = async ({children}:{children:ReactNode}) => {
  //lets add a check to see if user is autheticated or not
  const isUserAuthenticated=await isAuthenticated();
  if(!isUserAuthenticated)
  {
    redirect('/sign-in');
  }
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
         <Image src="/logo.png" alt="logo" height={32} width={38} />
         <h2 className='text-primary-100'>Prepify</h2>
        </Link>

      </nav>
      {children}
    </div>
  )
}

export default RootLayout 
