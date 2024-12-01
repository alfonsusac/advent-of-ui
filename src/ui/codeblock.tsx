import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { codeToHtml } from "shiki";

export async function CodeBlock(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  const { children, ...rest } = props;

  // @ts-expect-error children is a string
  const out = await codeToHtml((children).props.children, {
    lang: "ts",
    theme: "github-light",
  });

  return <pre dangerouslySetInnerHTML={{ __html: out }} {...rest} />;
}