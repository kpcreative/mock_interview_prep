"use server"
import { feedbackSchema } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { _success } from "zod/v4/core";
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
  //to current user jo cookie me save hoga usse aa jiga
  //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
  const interviews = db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get(); //iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
  //once we get the interview we can return it each interview by map
  console.log(interviews);
  return (await interviews).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  //upr me jo params hai n usme userid and limit v hai ki ek bar me kitna dikahna hai single page..thodi sab dikha denge
  const { userId, limit = 20 } = params;

  //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
  //to current user jo cookie me save hoga usse aa jiga
  //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
  const interviews = db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get(); //iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
  //once we get the interview we can return it each interview by map
  //  console.log(interviews);
  return (await interviews).docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

//this function will allow to fetch the detail of interview...upr me jo tha vo to userid k basis pe tha ki hamne na jo user ne create kiya hai vo fetch krke laye hai db se
//and v  return kiya tha id of that interview--and interview me jo v tha

//ab ham chah rhe hai ki jab uspe click kre to ye mujhe --->id(dynamic route i.e id of that interview) pe le jaye
//to jo fetch krte tym upr na getInterviewByUserId usme hr interview ko ek id allocate hota hai vo return hga...

//and ab isme na us Id k basis pe ham usko fetch krnge
//and ab koi array return nhi krega vo ID ka particular interview hi return krega isliye retur type of promise single promise interview..

//NOte----- ab jab v koi Interview pe click krega to interview->id pe jiga..lets see kaise..

export async function getInterviewById(id: string): Promise<Interview | null> {
  //try to fetch all the interview...khud soch na jo current user hai usse match krke lena hai
  //to current user jo cookie me save hoga usse aa jiga
  //and then we can fetch all the interview of it..and note...interview 1 hi thodi rhega..aur rhenge na...isliye array type ka hai...see in docs ache se smjha rkha hai
  const interview = db.collection("interviews").doc(id).get();

  return (await interview).data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  //now we need to destructure the params at the top
  //firstly wee need to know about the InterviewId to know for which we are providing the feedback for
  //we also =need the userid to know for which user this feedback is
  //ans transcript of whole conversation through text  of the interview..most important part of the feedback..which we will feed to gemini to generate feedback for me
  const { interviewId, userId, transcript } = params;
  try {
    //if eror then go to catch

    //if no error we should go over the transcript-- the whole conversation
    //by formating the transcript into the better format we will do it nicely by gemini

    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `-${sentence.role}:${sentence.content}\n`
      )
      .join("");
    //ye upr jo hai na usme Transcript se maping kiye hai....each sentence pe jisme role hoga ki AI bol rha ya user
    //like AI said  hi
    //role= ai content=ai ye aise pass hga
    //if i said hello then ROLE-USER and content said=HEllo..aise krke sara conversation sunega

    //now pass it over gemini to be able to figure out how well we did

    //remember..phle na hamne gemini use kiya tha waha pe generateText tha...par yha objecct hai....aisa kyu?
    //kyuki it allows us to be more bit specific...as we can pass model in generate text here also we will pass model

    //now isme ye faida hai ki instead of getting any random text ki ye ye hai feedback ham ek structure way me mang skte hai..lets see how in SCHEMA we have define--
    //so we will define SCHEMA to let them know how our text will look like after generation
    //schema me feedbackSchema hai..which is coming from constant ...which is defined as object where it has been defined what all are they expecting to return
    //like We are expecting totlScore of tyoe number--- see in feedbackSchema
    //category score also jisme ki alg alg problem solving and so on rhega...see it

    //system--it tells ai ki tum kis type se behave krna hai...
    //object me akar stiore ho jiga which will contain these all totalscore,categoryScore,strenth....and so on jo destructure kra hua hai

    const { object :{totalScore,categoryScores,strengths,areasForImprovement,finalAssessment} } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    //now i will put into  the new object that will store it into the databse
    //we passed userId and interviewId  taki pata rhe ki kis user ka Feedback hai and kis Id ka interview hai ye..]
    const feedback=await db.collection('feedback').add({
        interviewId,
        userId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt:new Date().toISOString()
    })
    //once we get the feedback..we can return the object with sucess of true..
    //and we are returning this to the frontend
    return {
        success:true,
        feedbackId:feedback.id
    }
  } catch (e) {
    console.error("Error saving in Feedback", e);
    //tab return kr do sucess false
    return {
        success:false
    }
  }
}
export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    //feedback 1 hi na hai ji ek userId ka us InterviewId ka isliye Array type ka nhi hai thik na
  //upr me jo params hai n usme userid and limit v hai ki ek bar me kitna dikahna hai single page..thodi sab dikha denge
  const { interviewId, userId } = params;

  //try to fetch all the feedbak...khud soch na jo current user hai usse match krke lena hai and interviewid se v
  //to current user jo cookie me save hoga usse aa jiga
  //and then we can fetch all the feedback of it..and note...feedback 1 hi  rhega.....isliye array type ka ny hai...see in docs ache se smjha rkha hai
  const feedback = db
    .collection("feedback")
    .orderBy("createdAt", "desc")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get(); //iska mtlb hai ki db me interviews nam ka collection hai usme jiska userId==cureent ka useriD se match ho rha hai usse fetch kro and createdAt time se decs order me sort krke get() kro
  //once we get the interview we can return it each interview by map
  //  console.log(interviews);
  if((await feedback).empty)
  {
    console.log("null");
   return null;
  }
  //wrna return 
  const feedbackDoc = (await feedback).docs[0];
  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
 
}
