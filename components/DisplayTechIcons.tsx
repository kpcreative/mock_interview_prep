import { cn, getTechLogos } from '@/lib/utils';
import { get } from 'http'
import Image from 'next/image';
import React from 'react'

const DisplayTechIcons = async ({techStack}:TechIconProps) => {
    const techIcons=await getTechLogos(techStack);
  return (
    <div className='flex flex-row'>
      {/* {techStack} */}
      {techIcons.slice(0,3).map(({tech,url},index)=>(
        <div key={tech} className={cn('relative group bg-gray-800 hover:bg-gray-900 rounded-full p-2 flex-centre font-bold',index>=1 && '-ml-3')}>
          <span className='tech-tooltip'>{tech}</span>
           <Image src={url} alt={tech} width={100} height={100}  className='size-5'/>
        </div>
      ))}
    </div>
  )
}

export default DisplayTechIcons
