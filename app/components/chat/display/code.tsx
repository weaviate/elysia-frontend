"use client";

import { CodePayload } from "@/app/components/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import { IoIosCode } from "react-icons/io";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";
import { useRouter } from "next/navigation";
import { GoDatabase } from "react-icons/go";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CodeDisplayProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  metadata?: any;
  payload: CodePayload | null;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ payload, metadata }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);

  useEffect(() => {
    setCollectionName(metadata?.collection_name || "");
    setTotalObjects(metadata?.total_objects || 0);
  }, [metadata]);

  const routerChangeCollection = () => {
    router.push(`/data?collection_id=${collectionName}&page=1`);
  };

  if (!payload) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={"ghost"}
        className="border-secondary text-secondary"
        size={"sm"}
        onClick={() => setOpen(true)}
      >
        <IoIosCode size={12} />
        {collectionName ? (
          <p className="text-xs font-bold">
            {collectionName}
            {totalObjects && totalObjects > 0 ? `(${totalObjects})` : ""}
          </p>
        ) : (
          <p className="text-xs font-bold">Query</p>
        )}
      </Button>
      {open && (
        <Dialog
          open={open}
          onOpenChange={(open) => {
            if (!open) setOpen(false);
          }}
        >
          <DialogContent>
            <Card className="fixed top-1/2 bg-background left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full lg:w-[70vw] overflow-auto">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between items-center">
                    {payload.title && <p>{payload.title}</p>}
                    <div className="flex gap-2">
                      {collectionName && (
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="text-secondary"
                          onClick={routerChangeCollection}
                        >
                          <GoDatabase size={12} />
                          {collectionName}
                        </Button>
                      )}
                      <CopyToClipboardButton copyText={payload.text} />
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => setOpen(false)}
                      >
                        <IoClose size={12} />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SyntaxHighlighter
                  language={payload.language}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  style={oneDark}
                  customStyle={{
                    backgroundColor: "#121212",
                    color: "#ffffff",
                    width: "100%",
                    maxHeight: "calc(80vh - 2rem)",
                  }}
                  className="rounded-lg"
                >
                  {payload.text}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CodeDisplay;
