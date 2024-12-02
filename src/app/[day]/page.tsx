import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/ui/codeblock";
import { type SVGProps } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { auth, getUsername, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { Footer } from "@/ui/footer";
import { Input } from "@/ui/input";
import { SubmitButton } from "@/ui/submitButton";
import { FormSpinner } from "@/ui/formSpinner";
import { SubmissionListItem } from "./SubmissionListItem";
import { SubmissionForm } from "./SubmissionForm";

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
  if (day < 1 || day > 25) {
    return notFound();
  }
  if (Date.now() > Date.UTC(2024, 11, day, 5, 0, 0)) {
    return notFound();
  }

  let mdxSource;
  try {
    mdxSource = await unstable_cache(
      async () => {
        const res = await fetch(
          `https://raw.githubusercontent.com/alfonsusac/advent-of-ui/refs/heads/main/src/content/2024/day${ day }.mdx`
        );
        if (!res.ok) {
          return notFound();
        }
        return res.text();
      },
      ["day" + day],
      {
        revalidate: 30,
      }
    )();
  } catch {
    notFound();
  }

  const session = await auth();

  const submissionData = await unstable_cache(
    async () => {
      const data = await prisma.submission.findMany({
        where: {
          day,
          year: 2024,
          deleted: false,
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
      tags: [`submission-2024-${ day }`],
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
      return data;
    },
    [day + ""],
    {
      tags: [`submission-2024-${ day }`],
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
        <div className="min-h-screen mx-8 p-8 b border-t lg:border-t-0 lg:border-l max-w-2xl flex-col grow min-w-0">
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
              <SubmissionForm
                error={error}
                onSubmit={async data => {
                  "use server";
                  const link = data.get("submisison_link");
                  if (!link) return;
                  if (typeof link !== "string") return;
                  if (!session) return;
                  let url: URL;
                  try {
                    url = new URL(link);
                  } catch {
                    return redirect(`/${ day }?error=invalid-link`);
                  }
                  if (
                    url.hostname !== "codepen.io" &&
                    url.hostname !== "play.tailwindcss.com"
                  ) {
                    redirect(`/${ day }?error=invalid-host`);
                  }

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
                  revalidateTag(`submission-2024-${ day }`);
                  // redirect(`/${day}`);
                }}
              />
              {/* <form
                action={async form => {
                  "use server";
                  const link = form.get("submisison_link");
                  if (!link) return;
                  if (typeof link !== "string") return;
                  if (!session) return;
                  let url: URL;
                  try {
                    url = new URL(link);
                  } catch {
                    return redirect(`/${ day }?error=invalid-link`);
                  }
                  if (
                    url.hostname !== "codepen.io" &&
                    url.hostname !== "play.tailwindcss.com"
                  ) {
                    redirect(`/${ day }?error=invalid-host`);
                  }

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
                  revalidateTag(`submission-2024-${ day }`);
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
                <Input
                  type="text"
                  id="submisison_link"
                  name="submisison_link"
                  required
                  autoComplete="off"
                  className="w-full p-2 mt-2 rounded-md outline outline-black/5 font-mono tracking-tight text-sm"
                />
                <div className="flex items-center gap-4">
                  <SubmitButton
                    type="submit"
                    className="p-2 mt-4 text-sm px-4 bg-white rounded-md outline-black/10 outline  hover:bg-black/5"
                  >
                    Submit
                  </SubmitButton>
                  <FormSpinner className="flex" />
                </div>
              </form> */}
            </div>
          )}



          {submissionData.map(post => {
            const liked = currentUserLikes.some(sub => sub.id === post.id);
            const isAuthor = session
              ? getUsername(session) === post.user.username
              : false;
            return (
              <SubmissionListItem
                key={post.id}
                user={{ liked, isAuthor }}
                post={{
                  id: post.id,
                  url: post.url,
                  username: post.user.username,
                  likeCount: post._count.likes,
                }}
                onLike={
                  async () => {
                    "use server";
                    if (!session) redirect(`/${ day }`);
                    await prisma.user.update({
                      where: {
                        username: getUsername(session),
                      },
                      data: {
                        likes: {
                          connect: {
                            id: post.id,
                          },
                        },
                      },
                    });
                    // revalidateTag(`submission-2024-${ day }`);
                    // redirect(`/${ day }`);
                  }}
                onUnlike={
                  async () => {
                    "use server";
                    if (!session) redirect(`/${ day }`);
                    await prisma.user.update({
                      where: {
                        username: getUsername(session),
                      },
                      data: {
                        likes: {
                          disconnect: {
                            id: post.id,
                          },
                        },
                      },
                    });
                    // revalidateTag(`submission-2024-${ day }`);
                    // redirect(`/${ day }`);
                  }}
                onDelete={
                  async () => {
                    "use server";
                    if (!session) redirect(`/${ day }`);
                    await prisma.submission.update({
                      where: {
                        id: post.id,
                      },
                      data: {
                        likes: {
                          set: [],
                        },
                        deleted: true,
                      },
                    });
                    revalidateTag(`submission-2024-${ day }`);
                    // redirect(`/${ day }`);
                  }}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </>
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
