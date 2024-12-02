import { cn } from "lazy-cn";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { SvgSpinners90Ring } from "./spinner";

export function DialogButton(
  props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    loading?: boolean,
  }
) {
  const {loading, ...rest} = props;

  return (
    <button
      {...rest}
      className={cn("p-1.5 px-4 self-stretch border rounded-md hover:bg-zinc-100 flex items-center justify-center " + props.className)}
    >
      {props.loading ? (
        <SvgSpinners90Ring />
      ) : (
        props.children
      )}
    </button>
  )
}