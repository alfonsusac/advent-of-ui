import { notFound } from "next/navigation";

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
    <div className="mx-8">
      <div className="flex gap-2 justify-between p-4">
        <a href={"/"} className="font-bold tracking-tighter">Advent Of UI</a>
        <div></div>
      </div>

      <hr className="" />

      <div className="p-8 pt-24 flex flex-row gap-8 justify-between">
        <div className="">
          <h1 className="text-6xl font-bold tracking-tighter">Day {day}</h1>
          <p className="">A UI challenge for the holiday season</p>
        </div>
        <div>
          23D:24H:59M:59S
        </div>
      </div>

      <hr className="" />

      
    </div>
  );
}
