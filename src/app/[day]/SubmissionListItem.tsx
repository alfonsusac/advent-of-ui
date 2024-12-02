"use client"

import { DialogButton } from "@/ui/dialogButton";
import { startTransition, useRef, useState, useTransition, type SVGProps } from "react";

export function SubmissionListItem(props: {
  user: {
    liked: boolean,
    isAuthor: boolean,
  }
  post: {
    id: string,
    url: string,
    username: string,
    likeCount: number,
  }
  onLike: () => Promise<void>,
  onUnlike: () => Promise<void>,
  onDelete: () => Promise<void>,
}) {
  const { post, user, onLike, onUnlike } = props;

  return (
    <div key={post.id} className="my-4 flex gap-4 items-center text-sm">
      {/* Upvotes */}
      <LikeCounter
        liked={user.liked}
        likeCount={post.likeCount}
        onLike={onLike}
        onUnlike={onUnlike}
      />
      <div className="font-semibold text tracking-tight">{post.username}</div>
      <div className="min-w-0 truncate overflow-hidden text-blue-600 hover:underline">
        {/* Codepen link */}
        <a href={post.url} className="" target="_blank">
          {post.url}
        </a>
      </div>
      {
        // Delete Button
        user.isAuthor ? (
          <>
            <DeleteButton
              onDelete={props.onDelete}
            />
            {/* <button
              type="button"
              onClick={props.onDelete}
              className="w-8 h-8 rounded-md hover:bg-red-50 flex items-center justify-center"
            >
              <MaterialSymbolsDeleteOutline className="shrink-0 w-4 h-4 text-red-500" />
            </button> */}
          </>
        ) : (
          <></>
        )
      }
    </div>
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


// - - - - - - - - - - - - - - - - 
// Likes


function LikeCounter(props: {
  liked: boolean,
  likeCount: number,
  onLike: () => Promise<void>,
  onUnlike: () => Promise<void>,
}) {
  const { liked, likeCount } = props;

  const [like, setLike] = useState({
    liked: liked,
    likeCount: likeCount,
  })

  async function onLike() {
    setLike({ liked: true, likeCount: like.likeCount + 1 })
    await props.onLike()
  }

  async function onUnlike() {
    setLike({ liked: false, likeCount: like.likeCount - 1 })
    await props.onUnlike()
  }

  return (
    <div className="flex flex-row items-center gap-2 lg:w-1/6 md:w-1/12 w-2/12">
      {like.liked ? (

        <button
          onClick={onUnlike}
          type="submit"
          className="w-8 h-8 rounded-md hover:bg-zinc-50 flex items-center justify-center shrink-0"
        >
          <MdiCandy className="w-4 h-4" />
        </button>

      ) : (

        <button
          onClick={onLike}
          type="submit"
          className="w-8 h-8 rounded-md hover:bg-zinc-50 flex items-center justify-center shrink-0"
        >
          <MdiCandyOutline className="w-4 h-4" />
        </button>

      )}

      <div className="text-center">{like.likeCount}</div>
    </div>
  )
}

function MdiCandy(props: SVGProps<SVGSVGElement>) {
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

function MdiCandyOutline(props: SVGProps<SVGSVGElement>) {
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




// - - - - - - - - - - - - - - - - 
// Deletes

function DeleteButton(props: {
  onDelete: () => Promise<void>,
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [isPending, startTransition] = useTransition()

  return (
    <>
      <dialog
        className="hidden open:flex fixed backdrop:bg-black/50 backdrop:fixed backdrop:inset-0 p-8 rounded-md flex-col items-center gap-1 animate-in zoom-in-95 backdrop:animate-in backdrop:fade-in-35 shadow-xl"
        ref={dialogRef}
      >
        <MingcuteUserWarningFill className="w-5 h-5 opacity-50 mb-2" />
        <b>Delete this submission?</b>
        You will not be able to recover this submission.
        <DialogButton
          type="button"
          disabled={isPending}
          loading={isPending}
          onClick={() => {
            startTransition(async () => {
              await props.onDelete()
              dialogRef.current?.close()
            })
          }
          }
          className="h-9 border-red-200 bg-red-50 hover:bg-red-100 mt-4 text-red-500">Delete</DialogButton>
        <DialogButton
          type="button"
          disabled={isPending}
          className="h-9"
          onClick={
            () => {
              dialogRef.current?.close()
            }}>Cancel</DialogButton>
      </dialog>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal()
        }}
        className="w-8 h-8 rounded-md hover:bg-red-50 flex items-center justify-center"
      >
        <MaterialSymbolsDeleteOutline className="shrink-0 w-4 h-4 text-red-500" />
      </button>
    </>
  )


}



function MingcuteUserWarningFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7m-1.178 7.672C6.425 13.694 8.605 13 11 13q.671 0 1.316.07a1 1 0 0 1 .72 1.557A5.97 5.97 0 0 0 12 18c0 .92.207 1.79.575 2.567a1 1 0 0 1-.89 1.428L11 22c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69ZM18 14a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1m0 6a1 1 0 0 0-.117 1.993l.119.007a1 1 0 0 0 .117-1.993z"></path></g></svg>
  )
}