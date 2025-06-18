"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
interface SavedMessage {
  //first thing wee need to know is ki who is saying that message...
  role: "user" | "system" | "assistant";
  //and we will have content of that message
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  // const callStatus=CallStatus.INACTIVE
  // const isSpeaking=true;
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  // this is dummy message...we will update it soon
  // const messages=[
  //     'Whats your name?',
  //     "My name is john doe,nice to meet you!"
  // ];
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  //and we can also the extract the last message from messages
  // const lastMessage=messages[messages.length-1];

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback=async (messages:SavedMessage[])=>{
    //it has taken parameter of entire transcript...jo v conversation hua hai..usi k basis pe feedback ayega na ji
    console.log('Generate feedback here');
    //after that we can destructure the sucess and the ID  from the action where we'll actually generate that feedback but for now i'll mock it by
    //by creating a fake sucess of true 

    const {success,feedbackId:id}=await createFeedback({
       interviewId:interviewId!,
       userId:userId!,
       transcript:messages
    })

    if(success && id)
    {
        router.push(`/interview/${interviewId}/feedback`);
    }
    else{
        console.log('Error saving feedback');
        router.push('/');//will go back to the home page....
        
    }
  }
  useEffect(() => {
    // if (callStatus === CallStatus.FINISHED) {
    //   //if it is fnished push to the home page...the reason we are not redirecting to the
    //   // interview->id because it would take some time to generate the interview so its best to move on the home page first and manually find it on the home page
    //   router.push("/");
    // }
    if(callStatus===CallStatus.FINISHED)
    {
        if(type==='generate')
        {
            //tab to home pe hi chal ja
            router.push('/');
        }
        else{
            //mtlb hmane actual interview liya hai so now we have to generate feedback right
            handleGenerateFeedback(messages);
        }
    }
  }, [messages, callStatus, type, userId]);

  //now we will make 2 function which will handle on call and one on when hangedup

  // const handleCall=async()=>{
  //     //ki ham vapi se connect kr rhe hai
  //     setCallStatus(CallStatus.CONNECTING);
  //     //and we can call vapi and we can say to start the call
  //     await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
  //         variableValues:{
  //             username:userName,
  //             userid:userId,
  //         }
  //     })

  // }
 const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

   

    if (type === "generate") {
      await vapi?.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    }
    else {
        //if we are taking interview..then we will provide array of questions to interviewer to ask

      let formattedQuestions = "";
      //if questions exists then 
      if (questions) {

        //we will take questions individually in a like bullet point form and we wee will join them by new line character 
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      //on basis of this formatted question  we can start vapi call
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  //now we will handle it as when call is disconnected
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi?.stop();
  };

  const lastMessage = messages[messages.length - 1]?.content;

  //to know call is inactive or finsihed we can do like this
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* for our profile card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* now what we can do from vapi is ki extract the transcript of the conversation we are having...we can do this my some mock messages array */}

      {/* agr message ka length>0 hai to last message ko display kro be */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <div>
              <p
                key={lastMessage}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {lastMessage}
                {/* p tag k andr jo class hai na wahi help kr rha jab v ye last message update ho rha na tb animate ye sb usi ki functionality hai */}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {/* HAngup ye sb k liye .... agr call pe active ho to hangup button else..call button */}
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span>
              {/* isliye upr ye banaya tha ki call status active hai ya inactive utna bada likhne se acha ye likh le na */}
              {isCallInactiveOrFinished ? "Call" : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
