"use client";

import { ResultPayload } from "@/app/types/chat";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { IoIosCode } from "react-icons/io";
import { Button } from "@/components/ui/button";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";
import { useRouter } from "next/navigation";
import { GoDatabase } from "react-icons/go";
import { IoClose } from "react-icons/io5";

interface CodeDisplayProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  merged?: boolean;
  payload: ResultPayload[];
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ payload, merged }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const routerChangeCollection = (collectionName: string) => {
    router.push(`/data?collection_id=${collectionName}&page=1`);
  };

  if (!payload) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={"default"}
        className="text-secondary"
        size={"sm"}
        onClick={() => setOpen(true)}
      >
        <IoIosCode size={12} />

        {!merged &&
          (payload[0].metadata.collection_name ? (
            <p className="text-xs font-bold">
              {payload[0].metadata.collection_name}
              {payload[0].metadata.total_objects &&
              payload[0].metadata.total_objects > 0
                ? `(${payload[0].metadata.total_objects})`
                : ""}
            </p>
          ) : (
            <p className="text-xs font-bold">Query</p>
          ))}
      </Button>
      {open && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/3 z-50 flex justify-center">
          <div className="relative w-[50vw] bg-background_alt border border-secondary border-b-0 rounded-t-lg shadow-lg transition-all duration-300 ease-in-out">
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <IoClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 p-6 overflow-hidden mt-8 max-h-[80vh]">
              {payload.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    {item.metadata.code.title && (
                      <p className="font-semibold">
                        {item.metadata.code.title}
                      </p>
                    )}
                    <div className="flex gap-2 items-center">
                      {payload[0].metadata.collection_name && (
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="text-secondary"
                          onClick={() =>
                            routerChangeCollection(
                              item.metadata.collection_name,
                            )
                          }
                        >
                          <GoDatabase size={12} />
                          {item.metadata.collection_name}
                        </Button>
                      )}
                      <CopyToClipboardButton
                        copyText={item.metadata.code.text}
                      />
                    </div>
                  </div>
                  <div className="overflow-y-scroll">
                    <SyntaxHighlighter
                      language={item.metadata.code.language}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      style={oneDark}
                      customStyle={{
                        backgroundColor: "#121212",
                        color: "#ffffff",
                        width: "100%",
                        maxHeight: "calc(70vh - 2rem)",
                      }}
                      className="rounded-lg overflow-y-scroll"
                    >
                      {item.metadata.code.text}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
