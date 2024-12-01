"use client"

import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const { pending } = useFormStatus();

  return (
    <input
      {...props}
      disabled={pending}
      className={`w-full p-2 mt-2 rounded-md outline outline-black/5 font-mono tracking-tight text-sm ${
        props.className || ""
      }`}
    />
  );
}
