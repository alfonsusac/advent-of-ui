import type { ComponentProps, DetailedHTMLProps, HTMLAttributes } from "react";
import { codeToHtml } from "shiki";

export async function CodeBlock(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  const { children, ...rest } = props;

  const out = await codeToHtml((children as any).props.children, {
    lang: "ts",
    theme: "github-light",
  });

  return <pre dangerouslySetInnerHTML={{ __html: out }} {...rest} />;
}