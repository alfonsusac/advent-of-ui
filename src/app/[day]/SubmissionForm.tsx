"use client"

import { FormSpinner } from "@/ui/formSpinner";
import { Input } from "@/ui/input";
import { SubmitButton } from "@/ui/submitButton";
import { useEffect, useState } from "react";
import Confetti from 'react-confetti'

const christmasColors = [
  "#FF0000", // Red
  "#008000", // Green
  "#FFD700", // Gold
];
export function SubmissionForm(props: {
  onSubmit: (data: FormData) => Promise<void>,
  error: string,
}) {
  const { onSubmit, error } = props;

  const [confetti, setConfetti] = useState(false)
  const [stopConfetti, setStopConfetti] = useState(false)

  useEffect(() => {
    if (confetti) {
      setTimeout(() => {
        setStopConfetti(true)
      }, 5000)
    }
  }, [confetti])



  return (
    <form
      action={async (data) => {
        await onSubmit(data)
        setConfetti(true)
      }}
    >
      {
        confetti && <Confetti className="fixed inset-0" colors={christmasColors} recycle={!stopConfetti} />
      }
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
        /
        <a
          href="https://www.figma.com/"
          target="_blank"
          className="underline text-zinc-800 font-normal underline-offset-4"
        >
          figma
        </a>
        /
        <a
          href="https://codesandbox.io/"
          target="_blank"
          className="underline text-zinc-800 font-normal underline-offset-4"
        >
          codesandbox
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
    </form>
  )
}