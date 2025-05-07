// Edward TODO: Find font because Victoria sucks at finding fonts
// Add more sizing options
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownFormatProps {
  text: string;
  variant?: "primary" | "secondary";
}

const MarkdownFormat: React.FC<MarkdownFormatProps> = ({
  text,
  variant = "primary",
}) => {
  const paragraph_class = `${
    variant === "primary" ? "prose-p:text-primary" : "prose-p:text-secondary"
  } prose-p:leading-relaxed prose-p:my-1`;
  const img_class = "prose-img:hidden";
  const strong_class = "prose-strong:text-primary prose-strong:font-bold";
  const a_class = "prose-a:text-primary";
  const heading_class =
    "prose-headings:text-primary prose-headings:text-xl prose-headings:font-heading prose-headings:font-bold";
  const ol_class =
    "prose-ol:text-primary prose-ol:text-base prose-ol:font-light";
  const ul_class =
    "prose-ul:text-primary prose-ul:text-base prose-ul:font-normal";
  const code_class =
    "prose-code:font-mono prose-code:text-primary prose-code:text-base prose-code:bg-background_alt prose-code:p-1 prose-code:rounded-lg";
  const pre_class =
    "prose-pre:bg-background_alt prose-pre:p-4 prose-pre:text-base prose-pre:font-light prose-pre:w-full prose-pre:my-2";
  
  // TODO: Figure out how to add some stripy colors to the table
    const table_class = "prose-table:text-primary prose-th:text-primary prose-td:text-primary prose-table:border-0";

  const cleaned_text = text.trim();

  return (
    <div
    className={`flex flex-col markdown-container flex-grow justify-start items-start text-wrap prose max-w-none prose:w-full space-y-10 space-y-reverse break-words ${paragraph_class} ${img_class} ${strong_class} ${a_class} ${heading_class} ${ol_class} ${ul_class} ${code_class} ${pre_class} ${table_class}`}    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {cleaned_text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownFormat;
