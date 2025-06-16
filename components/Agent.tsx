import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'
enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
}

const Agent = ({userName}:AgentProps) => {
    const callStatus=CallStatus.INACTIVE
    const isSpeaking=true;

    // this is dummy message...we will update it soon
    const messages=[
        'Whats your name?',
        "My name is john doe,nice to meet you!"
    ];

    //and we can also the extract the last message from messages
    const lastMessage=messages[messages.length-1];

  return (
    <>
    <div className='call-view'>
        <div className='card-interviewer'>
            <div className='avatar'>
                <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover'/>
                {isSpeaking && <span className='animate-speak'></span>}

            </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* for our profile card */}
        <div className='card-border'>
             <div className='card-content'>
                <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className='rounded-full object-cover size-[120px]' />
                <h3>{userName}</h3>
             </div>
        </div>
      
    </div>
    
    {/* now what we can do from vapi is ki extract the transcript of the conversation we are having...we can do this my some mock messages array */}
     
     {/* agr message ka length>0 hai to last message ko display kro be */}
     {messages.length>0 && (
        <div className='transcript-border'>
           <div className='transcript'>
            <div>
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
                     {lastMessage}
                     {/* p tag k andr jo class hai na wahi help kr rha jab v ye last message update ho rha na tb animate ye sb usi ki functionality hai */}
                </p>
            </div>

           </div>
        </div>
     )}

    <div className='w-full flex justify-center'>


        {/* HAngup ye sb k liye .... agr call pe active ho to hangup button else..call button */}
   {callStatus!== 'ACTIVE'?(
    <button className='relative btn-call'>
        <span className={cn('absolute animate-ping rounded-full opacity-75',callStatus!=='CONNECTING' & 'hidden')}/> 
          
            <span>
           {callStatus==='INACTIVE' || callStatus==='FINISHED'?'Call':'...'}
        </span>
    </button>
   ):(
    <button className='btn-disconnect'>
      End
    </button>
   )}
       
    </div>
    </>
  )
}

export default Agent
