"use client"

import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      disabled={pending}
      className={`${
        props.className || ""
      }`}
    />
  );
}
