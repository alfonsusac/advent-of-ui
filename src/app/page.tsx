// https://v0.dev/chat/k3J02qcHbJb

export default function Home() {
  return (
    <div className="mx-8">
      <div className="p-8 pt-24 flex flex-row gap-8 justify-between">
        <div className="">
          <h1 className="text-6xl font-bold tracking-tighter">Advent of UI</h1>
          <p className="">A UI challenge for the holiday season</p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-end tracking-tight">
            <div className="text-3xl font-bold">23</div>
            <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
              D
            </div>
            <div className="text-3xl font-bold">23</div>
            <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
              H
            </div>
            <div className="text-3xl font-bold">59</div>
            <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
              M
            </div>
            <div className="text-3xl font-bold">59</div>
            <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[...Array(24).keys()].map(day => {
          const hidden = new Date(Date.now()).getDate() < day + 1;
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
                relative
                `}
            >
              <div
                className={`font-medium text-sm tracking-tighter text-zinc-500/80 group-hover:text-white`}
              >
                Day
              </div>
              <div className={`font-bold text-5xl`}>{day + 1}</div>
            </a>
          );
        })}
      </div>

      <div className="p-8 tracking-tight">
        Made by{" "}
        <a
          href="https://x.com/alfonsusac"
          className="underline underline-offset-4 "
        >
          @alfonsusac
        </a>
      </div>
    </div>
  );
}
