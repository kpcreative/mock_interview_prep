import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
   <>
   <section className="card-cta">
    <div className="flex flex-col gap-6 max-w-lg">
       <h2>
        AI Mock Interviews: Sharpen Your Skills, Impress Recruiters
       </h2>
       <p className='text-lg'>
        Practice on real interview questions with AI-Powered Practice & Feedback
       </p>
       <Button asChild className='btn-primary max-sm:w-full'>
        <Link href="/interview">
        Start Mock Interview
        </Link>
        
       </Button>
    </div>
     <Image src="/robot2.png" alt="robo-dude" height={400} width={400} className=" max-sm:hidden" />
   </section>
   <section className="flex flex-col gap-6 mt-8">
       <h2>Your Interviews</h2>
       <div className='interviews-section'>
         {/* <p>You Haven&apos;t taken Any Interviews Yet</p> */}
         {dummyInterviews.map((interview) => (
          <InterviewCard {...interview} key={interview.id}/>
        ))}
       </div>
   </section>
   <section className='flex flex-col gap-6 mt-8'>
       <h2>Take an Interview</h2>
       <div className='interviews-section'>
         {/* <p>There are No interview Availaible</p> */}
          {dummyInterviews.map((interview) => (
          <InterviewCard {...interview} key={interview.id}/>
        ))}
       </div>
   </section>
   </>
  )
}

export default page
