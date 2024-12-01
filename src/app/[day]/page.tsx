import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile } from "fs/promises";
import { CodeBlock } from "@/ui/codeblock";
import type { SVGProps } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { auth, getUsername, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function DayPage(context: {
  params: Promise<{
    day: string;
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const params = await context.params;
  const day = parseInt(params.day);
  if (typeof day !== "number" || Number.isNaN(day)) {
    return notFound();
  }

  let mdxSource;
  try {
    mdxSource = await readFile(`./src/content/2024/day${day}.mdx`);
  } catch (error) {
    notFound();
  }

  const session = await auth();

  const submissionData = await unstable_cache(
    async () => {
      const data = await prisma.submission.findMany({
        where: {
          day,
          year: 2024,
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: [
          {
            likes: {
              _count: "desc",
            },
          },
          {
            createdAt: "desc",
          },
        ],
        take: 20,
      });
      return data;
    },
    [day + ""],
    {
      tags: [`submission-2024-${day}`],
      revalidate: 5,
    }
  )();

  const currentUserLikes = await unstable_cache(
    async () => {
      if (!session) return [];
      const data = await prisma.submission.findMany({
        where: {
          day,
          year: 2024,
          likes: {
            some: {
              username: getUsername(session),
            },
          },
        },
      });
      // console.log(data);
      return data;
    },
    [day + ""],
    {
      tags: [`submission-2024-${day}`],
      revalidate: 5,
    }
  )();

  const sp = await context.searchParams;
  const error = sp.error;

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="mx-8 max-w-2xl pb-12 min-w-[32rem]">
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
        <div className="min-h-screen mx-8 p-8 b border-t lg:border-t-0 lg:border-l max-w-2xl flex-col w-full min-w-0">
          <h4 className="font-semibold text-xl tracking-tight">Submissions</h4>
          {!session ? (
            <button
              className="p-2 cursor-pointer hover:bg-black/5 rounded-md text-sm text-black/60 font-medium mt-2 flex items-center gap-2"
              onClick={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <MdiGithub className="w-4 h-4" /> Sign In to add Submission
            </button>
          ) : (
            <div className="mt-3 py-7 border-b border-t">
              <div className="flex items-center gap-2 text-sm">
                <div>Logged in as {getUsername(session)}</div>
                <button
                  className="cursor-pointer hover:underline rounded-md text-sm text-black/60 font-medium flex items-center gap-2"
                  onClick={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  Log out
                </button>
              </div>
              <form
                action={async form => {
                  "use server";
                  // console.log("HELLOOOO??");
                  // console.log("Form", form);
                  const link = form.get("submisison_link");
                  // console.log("Link", link);
                  if (!link) return;
                  if (typeof link !== "string") return;
                  if (!session) return;
                  let url: URL;
                  try {
                    url = new URL(link);
                  } catch (error) {
                    return redirect(`/${day}?error=invalid-link`);
                  }
                  if (
                    url.hostname !== "codepen.io" &&
                    url.hostname !== "play.tailwindcss.com"
                  ) {
                    redirect(`/${day}?error=invalid-host`);
                  }

                  // console.log("Success!!");
                  await prisma.submission.create({
                    data: {
                      url: link,
                      day,
                      year: 2024,
                      user: {
                        connectOrCreate: {
                          where: {
                            username: getUsername(session),
                          },
                          create: {
                            username: getUsername(session),
                          },
                        },
                      },
                    },
                  });
                  revalidateTag(`submission-2024-${day}`);
                  // redirect(`/${day}`);
                }}
              >
                <label
                  className="block text-sm font-semibold mt-2"
                  htmlFor="submisison_link"
                >
                  Link (
                  <a
                    href="https://codepen.io/pen"
                    target="_blank"
                    className="underline text-zinc-800 font-normal underline-offset-4"
                  >
                    codepen
                  </a>
                  /
                  <a
                    href="https://play.tailwindcss.com/"
                    target="_blank"
                    className="underline text-zinc-800 font-normal underline-offset-4"
                  >
                    tailwindplay
                  </a>
                  ){" "}
                  {error && (
                    <span className="text-red-500 font-normal">
                      {error === "invalid-host" && "Invalid host"}
                      {error === "invalid-link" && "Invalid link"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="submisison_link"
                  name="submisison_link"
                  required
                  autoComplete="off"
                  className="w-full p-2 mt-2 rounded-md outline outline-black/5 font-mono tracking-tight text-sm"
                />
                <button
                  type="submit"
                  className="p-2 mt-4 text-sm px-4 bg-white rounded-md outline-black/10 outline  hover:bg-black/5"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          {submissionData.map(post => {
            const liked = currentUserLikes.some(sub => sub.id === post.id);
            const isAuthor = session
              ? getUsername(session) === post.user.username
              : false;
            return (
              <div
                key={post.id}
                className="my-4 flex gap-4 items-center text-sm"
              >
                {/* Upvotes */}
                <div className="flex flex-row items-center gap-2 lg:w-1/6 md:w-1/12 w-2/12">
                  {liked ? (
                    <button
                      type="button"
                      onClick={async () => {
                        "use server";
                        await prisma.user.update({
                          where: {
                            username: post.user.username,
                          },
                          data: {
                            likes: {
                              disconnect: {
                                id: post.id,
                              },
                            },
                          },
                        });
                        revalidateTag(`submission-2024-${day}`);
                        redirect(`/${day}`);
                      }}
                      className="w-8 h-8 rounded-md hover:bg-zinc-50 flex items-center justify-center shrink-0"
                    >
                      <MdiCandy className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        "use server";
                        await prisma.user.update({
                          where: {
                            username: post.user.username,
                          },
                          data: {
                            likes: {
                              connect: {
                                id: post.id,
                              },
                            },
                          },
                        });
                        revalidateTag(`submission-2024-${day}`);
                        redirect(`/${day}`);
                      }}
                      className="w-8 h-8 rounded-md hover:bg-zinc-50 flex items-center justify-center shrink-0"
                    >
                      <MdiCandyOutline className="w-4 h-4" />
                    </button>
                  )}

                  <div className="text-center">{post._count.likes}</div>
                </div>
                <div className="font-semibold text tracking-tight">
                  {post.user.username}
                </div>
                <div className="min-w-0 truncate overflow-hidden text-blue-600 hover:underline">
                  {/* Codepen link */}
                  <a href={post.url} className="" target="_blank">
                    {post.url}
                  </a>
                </div>
                {
                  // Delete Button
                  isAuthor ? (
                    <button
                      type="button"
                      onClick={async () => {
                        "use server";
                        await prisma.submission.delete({
                          where: {
                            id: post.id,
                          },
                        });
                        revalidateTag(`submission-2024-${day}`);
                        redirect(`/${day}`);
                      }}
                      className="w-8 h-8 rounded-md hover:bg-red-50 flex items-center justify-center"
                    >
                      <MaterialSymbolsDeleteOutline className="shrink-0 w-4 h-4 text-red-500" />
                    </button>
                  ) : (
                    <></>
                  )
                }
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

function MdiGithub(props: SVGProps<SVGSVGElement>) {
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
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
      ></path>
    </svg>
  );
}

function MaterialSymbolsDeleteOutline(props: SVGProps<SVGSVGElement>) {
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
        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
      ></path>
    </svg>
  );
}
