import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export default async function UserPage(props: {
  params: Promise<{ userid: string }>,
  searchParams: Promise<{ [key: string]: string }>,
}) {
  const params = await props.params

  const user = await prisma.user.findUnique({
    where: {
      username: params.userid
    },
    include: { submissions: { where: { deleted: false } } }
  })


  return (
    <div className="bg-red-500 max-w-2xl min-h-screen mx-8">
      <div className="flex gap-2 justify-between p-4">
        <a href={"/"} className="font-semibold tracking-tighter">
          Advent Of UI
        </a>
      </div>
    </div>
  )
}