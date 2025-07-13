import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params; //isse to interview ka id niklega na..kyuki url hai interview-->[id]..i.e interviewId
  //we will also fetch userId kyuki feedback fectch krne k liye ye v chahiye..ye cookie se utha lenge
  const user = await getCurrentUser();
  //also we need to get the interview details..jo ki ye hai
  const interview = await getInterviewById(id);

  //if no any interview go to the home page...

  if (!interview) redirect("/");

  //but if there is interview we are gonna provide feedback
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });
  // console.log(feedback);//you can see kisa dikhta hai tera feedback
  return (
    // yha se just copy pasted the ui
    //
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="bg-gray-800 hover:bg-gray-900 text-white flex-1 rounded-full font-bold">
          <Link href="/" className="flex w-full justify-center">
            <span className="text-sm font-semibold text-white text-center">
              Back to dashboard
            </span>
          </Link>
        </Button>

        <Button className="bg-white hover:bg-gray-100 text-black flex-1 rounded-full font-bold border border-gray-300 shadow">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <span className="text-sm font-semibold text-black text-center">
              Retake Interview
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
