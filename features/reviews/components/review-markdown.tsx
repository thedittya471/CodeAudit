"use client";

import ReactMarkdown, { type Components } from "react-markdown";

/** Element styling for rendered review markdown (dark, theme-aware). */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-4 mb-2 text-base font-semibold text-foreground first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-4 mb-2 text-sm font-semibold text-foreground first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1.5 text-sm font-semibold text-foreground first:mt-0">{children}</h3>
  ),
  p: ({ children }) => <p className="my-2 leading-relaxed text-foreground/85">{children}</p>,
  ul: ({ children }) => <ul className="my-2 space-y-1 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-2 text-foreground/85 [&>ol]:mt-1 [&>ul]:mt-1">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-[#ff4d00]" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#ff7a3d] underline underline-offset-2 hover:text-[#ff4d00]"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="border border-border bg-muted/60 px-1 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[12px] leading-relaxed [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-[#ff4d00]/50 pl-3 text-foreground/70">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
};

export function ReviewMarkdown({ content }: { content: string }) {
  return (
    <div className="text-[13px]">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
