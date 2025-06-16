import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

//in this only we are going to generate the post route in it i.e responsible to getting the question generated from geminiai and saving it inot new interview..
//chuki API post request hi bhejega na ji geminiAPi ko isliye ye post request hai
export async function POST(request: Request) {
  //so now we kinda ssume ki which data we need to pass to gemini
  //so wee need to pass type of interview...level of interview ,role techstack etc and amount of question and also userid
  const { type, role, level, techstack, amount, userid } = await request.json(); //the way you can take all the value from request is request.json
  try {
    //here we will generate AI text by givng prompt to gemini using api key 
    //which will then genrate question on basis of this
    //lets see how
    //isi k liye to hamne vercel ka AI sdk use kiya hai...ekdm asani se ho jiga ab dekhna sab kuch
    //destructure the text whatever generated
    const {text:questions} = await generateText({
        model:google('gemini-2.0-flash-001') ,  //ye model use krmge ham....you can use other too 
        prompt:`Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `
    });

    //now once we get back the questions we want our AI model to read to us or not really but actually you know speak about them wit us 
    //once we get these questions we actually want to store them to the db so the VAPI ai can later on use all this useful informatioon

    const interview={
        //pass all the important information like role and etc
        role,type,level,
        techstack:techstack.split(','), //sab tech stacj alg alg krke ayega 
        questions:JSON.parse(questions),
        userId:userid,
        finalized: true,
        coverImage:getRandomInterviewCover(),
        createdAt:new Date().toISOString()
         
    
    }
    //this form the interview which now we can store  into the db
    await db.collection("interviews").add(interview);
    return Response.json({
        success:true,
    },
    {
        status:200
    })

    

  } catch (e) {
    console.error(e);
    return Response.json(
      {
        success: false,
        e,
      },
      {
        status: 500,
      }
    );
  }
}
