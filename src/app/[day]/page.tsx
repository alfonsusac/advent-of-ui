import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile, readdir } from "fs/promises";
import { CodeBlock } from "@/ui/codeblock";
import type { SVGProps } from "react";

export default async function DayPage(
  context: Promise<{
    params: {
      day: string;
    };
  }>
) {
  const { params } = await context;
  const day = parseInt(params.day);
  if (typeof day !== "number" || Number.isNaN(day)) {
    return notFound();
  }

  let mdxSource
  try {
    mdxSource = await readFile(`./src/content/2024/day${day}.mdx`);
  } catch (error) {
    notFound()
  }


  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="mx-8 max-w-2xl pb-12">
          <div className="flex gap-2 justify-between p-4">
            <a href={"/"} className="font-semibold tracking-tighter">
              Advent Of UI
            </a>
          </div>

          <div className="px-8 pb-12">
            <MDXRemote
              source={mdxSource}
              components={{
                h1: props => (
                  <div className="">
                    <div className="my-8">
                      <div>Day {day}</div>
                      <h1
                        className="text-4xl font-bold tracking-tight"
                        {...props}
                      />
                    </div>
                    <hr className="-mx-8 my-8" />
                  </div>
                ),
                h2: props => (
                  <h2
                    className="mt-12 text-2xl font-bold tracking-tight"
                    {...props}
                  />
                ),
                p: props => <p className="my-4" {...props} />,
                li: props => (
                  <li className="my-2 list-decimal ml-6" {...props} />
                ),
                pre: props => (
                  <CodeBlock
                    {...props}
                    className="p-2 my-4 outline outline-black/5 rounded-md px-3 leading-6"
                  />
                ),
              }}
            />
          </div>
        </div>
        <div className="min-h-screen mx-8 p-8 b border-t lg:border-t-0 lg:border-l max-w-2xl">
          <h4 className="font-semibold text-xl tracking-tight">Submissions</h4>
          <div className="p-2 cursor-pointer hover:bg-black/5 rounded-md text-sm text-black/60 font-medium mt-2 flex items-center gap-2">
            <MdiPlus /> Add submission
          </div>
          {[...Array(5).keys()].map(post => {
            return (
              <div key={post} className="my-4 flex gap-4 items-center text-sm">
                {/* Upvotes */}
                <div className="flex flex-row items-center gap-2 lg:w-1/6 md:w-1/12 w-2/12 flex-shrink-0">
                  <div className="text-2xl font-semibold">
                    <MdiCandyOutline className="w-4 h-4" />
                  </div>
                  <div className="text-center">0</div>
                </div>
                <div className="font-semibold text tracking-tight lg:w-2/6 md:w-1/5 w-2/5 flex-shrink-0">
                  User {post}
                </div>
                <div className="w-full flex-shrink-0">
                  {/* Codepen link */}
                  <a href="#" className="text-blue-600 hover:underline text-ellipsis">
                    View submission
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-8">Made by @alfonsusac</div>
    </>
  );
}




export function MdiCandy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15.54 8.46c1.96 1.96 1.96 5.12 0 7.08s-5.12 1.96-7.07 0s-1.97-5.12 0-7.08s5.11-1.96 7.07 0m3.93-3.91s-.97.12-2.04.81a5.24 5.24 0 0 0-1.5-2.94a4.03 4.03 0 0 0-1.1 3.92c1.39.36 2.47 1.44 2.83 2.83c1.12.3 2.68.15 3.92-1.1a5.25 5.25 0 0 0-2.9-1.49c.39-.58.7-1.25.79-2.03M4.53 19.45s.97-.12 2.04-.81c.15 1.04.65 2.09 1.5 2.94c1.25-1.24 1.4-2.8 1.1-3.92a3.94 3.94 0 0 1-2.83-2.83c-1.12-.3-2.68-.15-3.92 1.1c.84.84 1.87 1.34 2.9 1.49c-.39.58-.7 1.26-.79 2.03"
      ></path>
    </svg>
  );
}


export function MdiCandyOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.88 9.88c1.17-1.17 3.07-1.17 4.24 0s1.17 3.07 0 4.24a3 3 0 0 1-4.24 0a3 3 0 0 1 0-4.24M8.46 8.46c-1.96 1.96-1.96 5.12 0 7.08s5.12 1.96 7.08 0s1.96-5.12 0-7.08s-5.12-1.96-7.08 0m11.01-3.91s-.97.12-2.04.82c-.15-1.05-.65-2.1-1.5-2.95c-1.25 1.25-1.4 2.8-1.1 3.92c1.39.36 2.47 1.44 2.83 2.83c1.12.3 2.68.15 3.92-1.1a5.25 5.25 0 0 0-2.9-1.49c.39-.58.7-1.25.79-2.03M4.53 19.45s.97-.12 2.04-.81c.15 1.04.65 2.09 1.5 2.94c1.25-1.24 1.4-2.8 1.1-3.92a3.96 3.96 0 0 1-2.83-2.83c-1.12-.3-2.67-.15-3.92 1.1c.84.84 1.87 1.34 2.9 1.49c-.39.58-.7 1.26-.79 2.03"
      ></path>
    </svg>
  );
}


function MdiPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
    </svg>
  );
}