"use client"

import type { SVGProps } from "react";
import { useFormStatus } from "react-dom";
import { SvgSpinners90Ring } from "./spinner";

export function FormSpinner(props: SVGProps<SVGSVGElement>) {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return <SvgSpinners90Ring {...props} />;
}


