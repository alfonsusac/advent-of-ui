import { notFound } from "next/navigation";
import Day1 from "../../content/2024/day1.mdx"

export default async function DayPage(
  context: Promise<{
    params: {
      day: string;
    };
  }>
) {
  const { params } = await context;
  const day = parseInt(params.day)
  if (typeof day !== "number" || Number.isNaN(day)) {
    return notFound();
  }

  return (
    <div className="mx-8 max-w-xl">
      <div className="flex gap-2 justify-between p-4">
        <a href={"/"} className="font-semibold tracking-tighter">
          Advent Of UI
        </a>
      </div>

      <div className="p-8 pt-18 flex flex-row gap-8 justify-between">
        <div className="">
          <h1 className="text-5xl font-bold tracking-tighter">Day {day}</h1>
          <p className="">A UI challenge for the holiday season</p>
        </div>
      </div>

      <hr className="" />

      {day === 1 && <Day1 />}
    </div>
  );
}
