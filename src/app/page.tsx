// https://v0.dev/chat/k3J02qcHbJb

import { Footer } from "@/ui/footer";
import { AdventTimer } from "@/ui/adventTiner";
import { DaysTimer } from "@/ui/daysTimer";
import { Mount } from "@/ui/mounted";

export default function Home() {
  return (
    <div className="mx-8">
      <div className="p-8 pt-24 flex flex-row gap-8 justify-between">
        <div className="">
          <h1 className="text-6xl font-bold tracking-tighter">Advent of UI</h1>
          <p className="">A UI challenge for the holiday season</p>
        </div>
        <div className="flex flex-col">
          <AdventTimer />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 relative">
        {[...Array(24).keys()].map(day => {
          const date = new Date(Date.UTC(new Date().getFullYear(), 11, day+1, 5, 0)); // December = month 11 (zero-indexed)
          const hidden = new Date(Date.now()) < date;
          // const nextDay = new Date(Date.now()).getDate() === day + 1;
          // const hidden = false
          return (
            <a
              href={`/${day + 1}`}
              key={day}
              className={`flex gap-1 flex-col items-center justify-center 
                border-4 group
                ${
                  hidden
                    ? `
                      hover:bg-black hover:text-white transition-all opacity-20 pointer-events-none
                      `
                    : `[&:nth-child(2n)]:border-green-700 
                [&:nth-child(2n)]:hover:bg-green-700 
                [&:nth-child(2n+1)]:border-red-700 
                [&:nth-child(2n+1)]:hover:bg-red-700`
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
              <div className={`font-bold text-5xl`}>{day + 1}</div>
              {day + 1 === new Date(Date.now()).getDate() && (
                <DaysTimer days={day + 1} />
              )}
            </a>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
