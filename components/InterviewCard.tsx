
import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs'
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
const InterviewCard = ({interviewId,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    const feedback= null as Feedback | null;
    const normalizedType= /mix/gi.test(type)?"Mixed":type;

    // ye formatteddate me na jo v hai vo feedback kab create hua...agr ye nhi hua to usko createdat se le aoo..agr vo v nhi hai to dat.now jo v hai usse replace kr lo

    const formattedDate= dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");


  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
        <div>
            <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                <p className='badge-text'>{normalizedType}</p>
            </div>
            <Image src={getRandomInterviewCover()} alt="cover image" height={90} width={90} className='rounded-full object-fit size-[90px]' />
            <h3 className='mt-5 capitalize'>
                {role} Interview
            </h3>
            <div className='flex flex-row gap-5 mt-3'>
                <div className='flex flex-row gap-2'>
                    <Image src="/calendar.svg" alt="calendar" height={22} width={22} />
                    <p>{formattedDate}</p>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <Image src="/star.svg" alt="star" height={22} width={22} />
                    <p>{feedback?.totalScore || '---'}/100</p>


                </div>

            </div>
            <p className='line-clamp-2 mt-5'>
                {feedback?.finalAssessment || "No feedback yet. Take the interview to get feedback."}
            </p>
        </div>
        <div className='flex flex-row justify-between '>
            {/* <p>Tech Icons</p> */}
            <DisplayTechIcons techStack={techstack}/>
            <Button className='btn-primary' >
                 <Link href={feedback ? `/interview/${interviewId}/feedback`:`/interview/${interviewId}`}>
                     {feedback ? "View Feedback" : "View Interview"}
                 </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard
