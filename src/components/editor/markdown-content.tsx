import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-8 font-editorial text-3xl font-semibold first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-7 font-editorial text-2xl font-semibold first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 font-interface text-lg font-bold first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-8 first:mt-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l-2 border-primary pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <code
      className={
        className
          ? `${className} font-mono text-sm`
          : "rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
      }
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-5 overflow-x-auto rounded-card bg-foreground p-4 text-background">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border bg-muted px-3 py-2 font-interface font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border px-3 py-2">{children}</td>,
  hr: () => <hr className="my-8 border-border" />,
  img: ({ alt }) =>
    alt ? <span className="text-muted-foreground">Imagem: {alt}</span> : null,
};

export function MarkdownContent({
  markdown,
  linksEnabled = true,
}: {
  markdown: string;
  linksEnabled?: boolean;
}) {
  return (
    <div className="font-editorial text-lg text-foreground">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          ...components,
          a: ({ children, href }) =>
            linksEnabled ? (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="font-semibold text-primary underline decoration-primary/40 underline-offset-4"
              >
                {children}
              </a>
            ) : (
              <span className="font-semibold text-primary underline decoration-primary/40 underline-offset-4">
                {children}
              </span>
            ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
