import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs'
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({id,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
    const feedback = userId && id ? await getFeedbackByInterviewId({interviewId:id,userId}) : null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96 bg-white">
            <div className="card-interview bg-white text-black shadow-md">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-800">
                        <p className="badge-text text-white">{normalizedType}</p>
                    </div>
                    <Image src={getRandomInterviewCover()} alt="cover image" height={90} width={90} className="rounded-full object-fit size-[90px]" />
                    <h3 className="mt-5 capitalize text-black">
                        {role} Interview
                    </h3>
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2">
                            <Image src="/calendar.svg" alt="calendar" height={22} width={22} />
                            <p className="text-black">{formattedDate}</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" alt="star" height={22} width={22} />
                            <p className="text-black">{feedback?.totalScore || '---'}/100</p>
                        </div>
                    </div>
                    <p className="line-clamp-2 mt-5 text-black">
                        {feedback?.finalAssessment || "No feedback yet. Take the interview to get feedback."}
                    </p>
                </div>
                <div className="flex flex-row justify-between">
                    <DisplayTechIcons techStack={techstack} />
                 <Button  className="btn-primary bg-gray-800 hover:bg-gray-900 text-white shadow font-bold">
  <Link
    href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
    className="inherit-link"
  >
    {feedback ? "View Feedback" : "View Interview"}
  </Link>
</Button>
                </div>
            </div>
        </div>
    )
}

export default InterviewCard