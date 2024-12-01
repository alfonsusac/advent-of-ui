"use server"

import { auth, getUsername } from "@/lib/auth"
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function submitAdvent(form: FormData, day: number) {
  const session = await auth()
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
  revalidateTag(`submission-2024-${ day }`);
}