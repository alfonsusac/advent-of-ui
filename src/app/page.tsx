// https://v0.dev/chat/k3J02qcHbJb

import { Footer } from "@/ui/footer";
import { AdventTimer } from "@/ui/adventTiner";
import { DaysTimer } from "@/ui/daysTimer";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { unstable_cache } from "next/cache";
import { event2024 } from "@/lib/event";

export default async function Home() {

  await auth();

  const groups = await unstable_cache(async () => prisma.submission.groupBy({
    by: ['year', 'day'],
    _count: true,
    where: {
      deleted: false
    }
  }),
    [],
    {
      tags: ['2024-submissions'],
      revalidate: 60,
    }
  )()

  return (
    <div className="mx-8">

      <div className="p-8 px-0 md:px-8 pt-24 flex flex-row gap-8 justify-between flex-wrap">
        <div className="shrink-0">
          <h1 className="text-6xl font-bold tracking-tighter">Advent of UI</h1>
          <p className="">A UI creative challenge for the holiday season</p>
        </div>
        <div className="flex flex-col">
          <AdventTimer />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 relative">
        {event2024.days.map((timestamp, i) => {
          const day = i + 1;
          const isUnlocked = event2024.isUnlocked(day);
          return (
            <a
              href={`/${ day + 1 }`}
              key={day}
              className={`flex gap-1 flex-col items-center justify-center 
                border-4 group
                ${ !isUnlocked
                  ? `
                      hover:bg-black hover:text-white transition-all opacity-20 pointer-events-none
                      `
                  : `
                [&:nth-child(3n+1)]:border-green-700 
                [&:nth-child(3n+1)]:hover:bg-green-700 
                [&:nth-child(3n+2)]:border-red-700 
                [&:nth-child(3n+2)]:hover:bg-red-700
                [&:nth-child(3n+3)]:border-yellow-500 
                [&:nth-child(3n+3)]:hover:bg-yellow-500
                `
                }
                
                p-2 w-40 h-40
                hover:bg-black hover:text-white transition-all
                cursor-pointer
                block
                relative
                `}
            >
              <div
                className={`font-medium text-sm tracking-tighter text-zinc-500/80 group-hover:text-white`}
              >
                Day
              </div>
              <div className={`font-bold text-5xl`}>{day}</div>
              <DaysTimer days={day} />
              <div className="absolute bottom-0 left-1 text-sm">{
                groups.find(group => group.year === 2024 && group.day === day)?._count || 0
              }</div>
            </a>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
