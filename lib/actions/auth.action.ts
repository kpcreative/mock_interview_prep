//firstly we want to create action for signUp
'use server'

import { interviewCovers } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { _success } from "zod/v4/core";

const ONE_WEEK=60*60*24*7;
export async function signUp(params:SignUpParams)
{
     const {uid,name,email}=params;
     try{
        //first fetch the user
        const userRecord=await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success:false,
                message:'User already exists.Please sign in.'
            }
        }
        //if it doesnt exist to kya kro na ki create kr do na
        await db.collection('users').doc(uid).set(
            {
                name,email
            }
        )
        //and return 
        return {
            success:true,
            message:'Account created sucessfully. Please sign in'
        }
     }
     catch(e:any)
     {
        console.error("Error creating the user",e);
        //lets handle firebase specific error
        if(e.code==='auth/email-already-exists')
        {
            return {
                success:false,
                message:'This email is alrady in use.'
            }
        }

        return {
            sucess:false,
            message:'Failed to create an account.'
        }

     }
}

export async function signIn(params:SignInParams)
{
    const {email ,idToken}=params;
    try{
       const userRecord=await auth.getUserByEmail(email);
       if(!userRecord)
       {
        return {
            success:false,
            message:'User does not exist.Create an account instead.'
        }
       }
       //it it exist then na phle cookie session set kr lo
       await setSessionCookie(idToken);
    }



    catch(e)
    {
        console.log(e);
        return {
            success:false,
            message:'Failed to login into an account.'
        }
    }
}
export async function setSessionCookie(idToken :string)
{
    //now we stored them in cookie using next cookie
    const cookieStore=await cookies();

    const sessionCookie= await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK*1000,
    })
//     🔐 1. httpOnly: true – XSS Attack se Protection
// 📖 What it means:
// Iska matlab: JavaScript se cookie ko access nahi kar sakte.

// Agar koi page me malicious JS aa gaya (XSS attack), toh wo document.cookie se token uthaa nahi sakta.

// 🛡 Why it matters:
// XSS (Cross-Site Scripting) attacks attempt to steal cookies.

// But httpOnly cookies are invisible to JS, only server can read them.

// ✅ In interview bolo:
// "We set httpOnly: true to protect session cookies from XSS attacks, making them inaccessible to client-side JavaScript."

// 🔐 2. secure: process.env.NODE_ENV === 'production' – HTTPS only
// 📖 What it means:
// Ye cookie sirf HTTPS connection pe set hoga.

// Agar tum http pe ho (like localhost in dev), toh ye cookie nahi set hota.

// 🛡 Why it matters:
// Without HTTPS, cookie can be intercepted over network (Man-in-the-Middle attack).

// Secure flag ensures data travels encrypted.

// ✅ In interview bolo:
// "We use secure: true in production to ensure cookies are only sent over HTTPS, protecting them from network-level attacks like sniffing or MITM."

// 🔐 3. path: '/' – Cookie ka scope define karta hai
// 📖 What it means:
// path: '/' ka matlab hai cookie poori site pe accessible hoga.

// Agar tum path /dashboard karte, toh sirf dashboard pages mein milta.

// 🛡 Why it matters:
// It gives you control: kab aur kaunse routes par cookie send hoga.

// But '/' is safe default when you want global access.



    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        path:'/',
        sameSite:'lax'
    })

}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore=await cookies();
    const sessionCookie= cookieStore.get('session')?.value;
    if(!sessionCookie) return null;
    try{
        const decodedClaims=await auth.verifySessionCookie(sessionCookie,true);
        const userRecord=await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists)
        {
            return null;
        }
        else{
            return {
                ...userRecord.data(),
                id:userRecord.id,
            } as User;
        }
    }
    catch(e)
    {
        //either the session is invalid or expired
        console.log(e)
        return null;
    }
}

//now we can use this getCurrent user to see ki our current user is autheticted or not

export async function isAuthenticated() {
    const user=await getCurrentUser();
    return !!user;   // !false=true  again !true=false only..
    
}
export async function signOut() {
  const cookieStore = cookies();
  (await cookieStore).set('session', '', {
    maxAge: 0,
    path: '/',
  });
}

