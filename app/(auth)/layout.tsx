import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const AuthLayout = async ({children}:{children:ReactNode}) => {
   const isUserAuthenticated=await isAuthenticated();
   //if they have been authenticated directly go to home page
    if(isUserAuthenticated)
    {
      redirect('/');
    }
  return (
    <div className="auth-layout"> 
    {/* ye jo upr me hai na class name me vo na  layout global.css me defined kiya hua hai already */}

      {children}
      
    </div>
  )
}

export default AuthLayout
