/* eslint-disable */

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import CitationBubble from "./CitationBubble";
import { visit } from "unist-util-visit";
import { Element, Root } from "hast";

interface MarkdownFormatProps {
  text?: string;
  variant?: "primary" | "secondary" | "highlight";
  ref_ids?: string[];
}

const MarkdownFormat: React.FC<MarkdownFormatProps> = ({
  text,
  variant = "primary",
  ref_ids = [],
}) => {
  const { getCitationPreview } = useContext(ChatContext);

  // Filter ref_ids to only include those with valid citation previews
  const validRefIds = ref_ids.filter(
    (ref_id) => getCitationPreview(ref_id) !== null
  );

  // Create citation markers map for quick lookup (only for valid citations)
  const citationMap = new Map<number, string>();
  validRefIds.forEach((ref_id, index) => {
    citationMap.set(index + 1, ref_id);
  });

  // Custom rehype plugin to convert citation markers to CitationBubble components
  const rehypeCitations = () => {
    return (tree: Root) => {
      visit(tree, "text", (node, index, parent) => {
        if (!node.value || !parent || typeof index !== "number") return;

        const citationRegex = /\[(\d+)\]/g;
        const matches = [...node.value.matchAll(citationRegex)];

        if (matches.length === 0) return;

        const newNodes: (Element | { type: "text"; value: string })[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const citationNumber = parseInt(match[1]);
          const matchIndex = match.index!;

          // Add text before the citation
          if (matchIndex > lastIndex) {
            newNodes.push({
              type: "text",
              value: node.value.slice(lastIndex, matchIndex),
            });
          }

          // Get the ref_id for this citation number
          const ref_id = citationMap.get(citationNumber);
          if (ref_id) {
            const citationPreview = getCitationPreview(ref_id);
            if (citationPreview) {
              // Create a span element with citation data
              newNodes.push({
                type: "element",
                tagName: "span",
                properties: {
                  "data-citation": "true",
                  "data-ref-id": ref_id,
                  "data-citation-number": citationNumber.toString(),
                },
                children: [],
              } as Element);
            } else {
              // Safety fallback: if no preview found (shouldn't happen since we pre-filter), keep the original text
              newNodes.push({
                type: "text",
                value: fullMatch,
              });
            }
          } else {
            // Safety fallback: if no ref_id found (shouldn't happen since we pre-filter), keep the original text
            newNodes.push({
              type: "text",
              value: fullMatch,
            });
          }

          lastIndex = matchIndex + fullMatch.length;
        });

        // Add remaining text after the last citation
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex),
          });
        }

        // Replace the original text node with the new nodes
        parent.children.splice(index, 1, ...newNodes);
      });
    };
  };

  // Add citation markers to the text (only for valid citations)
  const processTextWithCitations = (
    originalText: string,
    validRefIds: string[]
  ): string => {
    if (!validRefIds || validRefIds.length === 0) {
      return originalText;
    }

    // For now, append citations at the end. In the future, you might want to
    // integrate them more intelligently based on content analysis
    let processedText = originalText;

    // Add citation markers at the end of sentences or key points
    // This is a simple implementation - you could make this more sophisticated
    validRefIds.forEach((_, index) => {
      const citationMarker = `[${index + 1}]`;
      // For now, just append all citations at the end
      if (index === 0) {
        processedText += " ";
      }
      processedText += citationMarker;
      if (index < validRefIds.length - 1) {
        processedText += " ";
      }
    });

    return processedText;
  };

  // Custom component renderer for citation spans
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    span: ({ node, ...props }: any) => {
      if (props["data-citation"] === "true") {
        const refId = props["data-ref-id"];
        const citationPreview = getCitationPreview(refId);

        if (!citationPreview) {
          // Safety fallback: shouldn't happen since we pre-filter citations
          return null;
        }

        return <CitationBubble citationPreview={citationPreview} />;
      }

      return <span {...props} />;
    },
  };

  const paragraph_class = `${
    variant === "primary"
      ? "prose-p:text-primary"
      : variant === "secondary"
        ? "prose-p:text-secondary"
        : "prose-p:text-highlight"
  } prose-p:leading-relaxed prose-p:my-2`;
  const img_class = "prose-img:hidden";
  const strong_class = "prose-strong:text-primary prose-strong:font-bold";
  const a_class = "prose-a:text-primary";
  const heading_class =
    "prose-headings:text-primary prose-headings:text-xl prose-headings:font-heading prose-headings:font-bold";
  const ol_class =
    "prose-ol:text-primary prose-ol:text-base prose-ol:font-light";
  const ul_class =
    "prose-ul:text-primary prose-ul:text-base prose-ul:font-normal";
  const code_class = `${
    variant === "primary"
      ? "prose-code:text-accent"
      : "prose-code:text-secondary"
  } prose-code:font-mono prose-code:text-sm prose-code:font-normal`;
  const pre_class =
    "prose-pre:bg-background_alt prose-pre:p-4 prose-pre:text-sm prose-pre:font-light prose-pre:w-full prose-pre:my-2";

  // TODO: Figure out how to add some stripy colors to the table
  const table_class =
    "prose-table:text-primary prose-th:text-primary prose-td:text-primary prose-table:border-0";

  const processedText = processTextWithCitations(
    text?.trim() || "",
    validRefIds
  );

  if (!text) {
    return null;
  }

  return (
    <div
      className={`markdown-container flex-grow justify-start items-start text-wrap prose max-w-none prose:w-full break-words ${paragraph_class} ${img_class} ${strong_class} ${a_class} ${heading_class} ${ol_class} ${ul_class} ${code_class} ${pre_class} ${table_class}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeCitations]}
        components={components}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownFormat;
