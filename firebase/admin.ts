import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin=()=>{
    //we first try to get acces to firebase application
    const apps=getApps();
 
    //we are doing this check because it will help to not do intitialization of  firebase admin  more than once in development and production ---..this ensures
    //only 1 instance of firebase sdk is created..

    if(!apps.length)
    {
        initializeApp(
            {
                credential:cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n")

                })
            }
        )

    }

    return {
        auth:getAuth(),
        db:getFirestore()
    }

    
}

export const {auth,db}=initFirebaseAdmin();