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

  if (!user) {
    return <div className="max-w-2xl min-h-screen mx-8">
      <div className="flex gap-2 justify-between p-4">
        <a href={"/"} className="font-semibold tracking-tighter">
          Advent Of UI
        </a>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Oops!</h1>
        <div>User Not Found!</div>
      </div>
    </div>
  }


  return (
    <div className="max-w-2xl min-h-screen mx-8">
      <div className="flex gap-2 justify-between p-4">
        <a href={"/"} className="font-semibold tracking-tighter">
          Advent Of UI
        </a>
      </div>
      <div className="p-8">
        Profile
        <div className="font-semibold text-3xl tracking-tighter">{user?.username}</div>
        <div className="my-4 text-sm">
          Joined: {user?.createdAt.toLocaleDateString()}<br />
          Last activity: {user?.updatedAt.toLocaleDateString()}
        </div>
        <hr className="-mx-8 my-8" />
        <div className="font-bold tracking-tighter">2024</div>
        <div className="flex gap-2 flex-wrap mt-4 max-w-[35.5rem]">
          {
            [...Array(24).keys()].map((i) => {
              const submissions = user?.submissions.filter(submission => submission.day === i + 1)
              if (submissions.length === 0)
                return (
                  <div className="w-16 h-16 flex items-center justify-center bg-black/10 font-semibold" key={i + 1}>
                    {i + 1}
                  </div>
                )

              return (
                <div className="min-w-16 min-h-16 flex 
              [&:nth-child(3n+1)]:bg-red-700
              [&:nth-child(3n+1)]:text-white
              [&:nth-child(3n+2)]:bg-green-700
              [&:nth-child(3n+2)]:text-white
              [&:nth-child(3n+3)]:bg-yellow-600
              cursor-pointer
              focus:w-full
              focus:cursor-default
              relative
              group
                " key={i + 1}
                  tabIndex={0}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-focus:hidden font-semibold">{i + 1}</div>
                  <div className="hidden group-focus:flex flex-col ml-6 mt-5 mb-5 ">
                    <div className="font-semibold">Day {i + 1} submission{submissions.length > 1 ? 's' : ''}</div>
                    <div>
                      {
                        submissions.map(s => {
                          return (
                            <div key={s.id} className="text-sm flex flex-wrap gap-2">
                              <div>{s.url}</div>
                              <div>{ }</div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}