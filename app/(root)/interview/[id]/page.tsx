import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({params}:RouteParams) => {
    const user=await getCurrentUser();
    //now destructue whatever is coming from params
    const {id}=await params;//to params me jo v hoga usme se id ko destructure kr liya hamne 
    //once we get the id..we can get the interview details based on it
    const interview=await getInterviewById(id);
    //and if there is no interview to redirect ho jaw homepage pe na
    if(!interview) redirect('/');

  return (
    <>
    <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row gap-4 items-center max:sm:flex-col'>
            <div className='flex flex-row gap-4 items-center '>
               <Image src={getRandomInterviewCover()} alt="cover-image" width={40} height={40} className='rounded-full object-cover size-[40px]'/>
               <h3 className='capitalize'>{interview.role} interview</h3>
             </div>
         <DisplayTechIcons techStack={interview.techstack}/>
        </div>
         <p className='bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg h-fit capitalize font-bold'>{interview.type}</p>
    </div>
    <Agent userName={user?.name || ''} userId={user?.id} interviewId={id} type='interview' questions={interview.questions}/>
    </>
  )
}

export default page
