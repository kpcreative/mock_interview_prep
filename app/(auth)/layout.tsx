import React, { ReactNode } from 'react'

const AuthLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="auth-layout"> 
    {/* ye jo upr me hai na class name me vo na  layout global.css me defined kiya hua hai already */}

      {children}
      
    </div>
  )
}

export default AuthLayout
