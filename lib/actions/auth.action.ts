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

export async function getInterviewsByUserId(userId:string):Promise<Interview[]| null>
{
    //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
    //to current user jo cookie me save hoga usse aa jiga
    //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
    const interviews=db.collection('interviews').where('userId','==',userId).orderBy('createdAt','desc').get();//iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
    //once we get the interview we can return it each interview by map
    console.log(interviews);
    return (await interviews).docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[]| null>
{
    //upr me jo params hai n usme userid and limit v hai ki ek bar me kitna dikahna hai single page..thodi sab dikha denge
    const {userId,limit=20}=params;

    //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
    //to current user jo cookie me save hoga usse aa jiga
    //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
    const interviews=db.collection('interviews').orderBy('createdAt','desc').where('finalized','==',true).where('userId','!=',userId).limit(limit).get();//iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
    //once we get the interview we can return it each interview by map
  //  console.log(interviews);
    return (await interviews).docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}
