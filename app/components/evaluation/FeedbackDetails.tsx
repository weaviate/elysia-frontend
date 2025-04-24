"use client";

import DebugMessageDisplay from "@/app/components/debugging/DebugMessage";
import { DebugMessage } from "@/app/components/debugging/types";
import CodeDisplay from "@/app/components/chat/display/Code";
import TaskDisplay from "@/app/components/evaluation/TaskDisplay";
import { Feedback } from "@/app/components/types";
import CopyToClipboardButton from "../navigation/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MdOutlineClose } from "react-icons/md";

export default function FeedbackDetails({
  feedbackData,
  selectedIndex,
  onClose,
}: {
  feedbackData: Feedback;
  selectedIndex: number;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-end w-full">
        <Button size={"sm"} onClick={onClose}>
          <MdOutlineClose />
          <p>Close</p>
        </Button>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between w-full">
          <div className="flex flex-col flex-grow w-full lg:w-fit p-2 border border-secondary bg-background_alt rounded-md">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-secondary">QueryID</p>
              <CopyToClipboardButton
                copyText={feedbackData.items[selectedIndex].query_id}
              />
            </div>
            <p className="text-primary truncate max-w-[180px]">
              {feedbackData.items[selectedIndex].query_id}
            </p>
          </div>
          <div className="flex flex-col flex-grow w-full lg:w-fit p-2 border border-secondary  bg-background_alt  rounded-md">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-secondary">ConversationID</p>
              <CopyToClipboardButton
                copyText={feedbackData.items[selectedIndex].conversation_id}
              />
            </div>
            <p className="text-primary truncate max-w-[180px]">
              {feedbackData.items[selectedIndex].conversation_id}
            </p>
          </div>
          <div className="flex flex-col flex-grow w-full lg:w-fit p-2 border border-secondary  bg-background_alt  rounded-md">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm  text-secondary">UserID</p>
              <CopyToClipboardButton
                copyText={feedbackData.items[selectedIndex].user_id}
              />
            </div>
            <p className="text-primary truncate max-w-[180px]">
              {feedbackData.items[selectedIndex].user_id}
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between w-full">
          <div className="flex flex-col flex-grow w-full lg:w-fit p-2 border border-secondary  bg-background_alt  rounded-md">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-secondary">Base Model</p>
            </div>
            <p className="text-primary">
              {feedbackData.items[selectedIndex].base_lm_used}
            </p>
          </div>
          <div className="flex flex-col flex-grow w-full lg:w-fit p-2 border border-secondary  bg-background_alt  rounded-md">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm  text-secondary">Complex Model</p>
            </div>
            <p className="text-primary">
              {feedbackData.items[selectedIndex].complex_lm_used}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Conversation History</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-25rem)] overflow-y-auto bg-background_alt p-4 rounded-lg">
            {(feedbackData as Feedback).items[
              selectedIndex
            ].conversation_history.map(
              (message: DebugMessage, messageIndex: number) => (
                <DebugMessageDisplay
                  key={messageIndex}
                  message={message}
                  messageIndex={messageIndex}
                />
              )
            )}
            {(feedbackData as Feedback).items[selectedIndex].action_information
              .length > 0 && (
              <>
                <p className="text-primary text-sm">Queries performed</p>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  {(feedbackData as Feedback).items[
                    selectedIndex
                  ].action_information.map((action, index) => (
                    <CodeDisplay
                      key={index}
                      payload={action.code}
                      metadata={{
                        collection_name: action.collection_name,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="tasks">
          <div className="flex flex-col gap-2 w-full max-h-[calc(100vh-25rem)] overflow-y-auto bg-background_alt p-4 rounded-lg">
            <div className="flex flex-row gap-2 items-center w-full justify-center">
              {(feedbackData as Feedback).items[selectedIndex].route.map(
                (step, index) => (
                  <div key={index} className="flex items-center">
                    <p className="font-bold text-primary">{step}</p>
                    {index <
                      (feedbackData as Feedback).items[selectedIndex].route
                        .length -
                        1 && <span className="mx-2">→</span>}
                  </div>
                )
              )}
            </div>
            <TaskDisplay
              tasks_completed={
                (feedbackData as Feedback).items[selectedIndex].tasks_completed
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
