import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/ui/codeblock";
import { type SVGProps } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { auth, getUsername, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { Footer } from "@/ui/footer";
import { SubmissionListItem } from "./SubmissionListItem";
import { SubmissionForm } from "./SubmissionForm";
import { event2024 } from "@/lib/event";

export default async function DayPage(context: {
  params: Promise<{
    day: string; // 0-based
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const params = await context.params;
  const day = parseInt(params.day);

  if (typeof day !== "number" || Number.isNaN(day)) {
    return <div className="p-8 flex flex-col items-start">
      <h1 className="text-3xl font-semibold">Oops</h1>
      Invalid Day!
      <a className="block p-2 border rounded-md px-4 mt-8 hover:bg-zinc-50 cursor-pointer" href={"/"}>
        Go back to Home
      </a>
    </div>
  }

  if (day < 0 || day > 24) {
    return <div className="p-8 flex flex-col items-start">
      <h1 className="text-3xl font-semibold">Oops</h1>
      Invalid Day!
      <a className="block p-2 border rounded-md px-4 mt-8 hover:bg-zinc-50 cursor-pointer" href={"/"}>
        Go back to Home
      </a>
    </div>
  }
  const isUnlocked = event2024.isUnlocked(day);
  if (!isUnlocked) {
    return <div className="p-8 flex flex-col items-start">
      <h1 className="text-3xl font-semibold">Oops</h1>
      This day is not yet out! Please wait!
      <a className="block p-2 border rounded-md px-4 mt-8 hover:bg-zinc-50 cursor-pointer" href={"/"}>
        Go back to Home
      </a>
    </div>
  }

  let mdxSource;
  try {
    mdxSource = await unstable_cache(
      async () => {
        const token = process.env.CONTENT_TOKEN;
        if (!token)
          return notFound();
        const res = await fetch(
          new URL(`/2024-${ day }`, "https://advent-of-ui-content.vercel.app"),
          {
            headers: {
              "x-token": token,
            }
          }
        )
        const data = await res.json();
        if ('error' in data) {
          console.log(data.error);
          return notFound();
        }
        if ('content' in data) {
          return data.content;
        }
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
        <div className="mx-8 max-w-2xl pb-12 flex-1 grow-[2] min-w-0">
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
                    className="p-2 my-4 outline outline-black/5 rounded-md px-3 leading-6 overflow-auto text-sm tracking-tight font-medium"
                  />
                ),
              }}
            />
          </div>
        </div>
        <div className="min-h-screen mx-8 p-8 b border-t lg:border-t-0 lg:border-l max-w-2xl flex-col grow min-w-0 flex-1" id="submitAnchor">
          <h4 className="font-semibold text-xl tracking-tight" id="submitAnchor" >Submit your Design</h4>
          {!session ? (
            <button
              className="p-2 px-3 cursor-pointer hover:bg-black/5 rounded-md text-sm text-black/60 font-medium mt-2 flex items-center gap-2 border"
              onClick={async () => {
                "use server";
                await signIn("github", {
                  redirectTo: `/${ day }#submitAnchor`,
                });
              }}
            >
              <MdiGithub className="w-4 h-4" /> Sign In via GitHub
            </button>
          ) : (
            <div className="">
              <div className="flex items-center gap-2 text-sm">
                <div>Logged in as <a className="underline underline-offset-4 decoration-zinc-400" href={`/user/${ getUsername(session) }`}>{getUsername(session)}</a></div>
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
                  let url
                  try {
                    url = new URL(link);
                  } catch {
                    return redirect(`/${ day }?error=invalid-link`);
                  }

                  const username = getUsername(session);

                  await prisma.submission.create({
                    data: {
                      url: url.toString(),
                      day,
                      year: 2024,
                      user: {
                        connectOrCreate: {
                          where: { username },
                          create: { username },
                        },
                      },
                    },
                  });

                  fetch('https://discord.com/api/webhooks/1313492646534320220/4h6fEbVpOpj02vPaDOeiMymZl1FmbUGfB3AUjCltQgHP_QVt9jUWtM9B-27nKvWnEdzR', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      content: `(${ process.env.NODE_ENV === "development" ? "Dev" : "Prod" }) New submission for Day ${ day } from \`${ username }\`: <${ link }>`,
                    }),
                  })

                  revalidateTag(`submission-2024-${ day }`);
                  revalidateTag(`2024-submissions`);
                }}
              />
            </div>
          )}

          <hr className="-mx-8 lg:mx-0 my-8" />
          <h4 className="font-semibold text-xl tracking-tight">Submissions</h4>

          {
            submissionData.length === 0 ? (
              <div className="text-black/60 mt-4 text-sm">No submissions yet!</div>
            ) : null
          }

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
