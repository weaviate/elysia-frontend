"use client";

import DebugMessageDisplay from "@/app/components/debugging/DebugMessage";
import { DebugMessage } from "@/app/components/debugging/types";
import TaskDisplay from "@/app/components/evaluation/TaskDisplay";
import { Feedback } from "@/app/components/types";
import CopyToClipboardButton from "../navigation/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MdOutlineClose, MdInfo } from "react-icons/md";
import { motion } from "framer-motion";

// Import modern setting components
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
} from "../configuration/SettingComponents";

export default function FeedbackDetails({
  feedbackData,
  selectedIndex,
  onClose,
}: {
  feedbackData: Feedback;
  selectedIndex: number;
  onClose: () => void;
}) {
  const feedbackItem = feedbackData.items[selectedIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 w-full pb-8"
    >
      {/* Header Card */}
      <SettingCard>
        <SettingHeader
          icon={<MdInfo />}
          className="bg-accent"
          header="Feedback Details"
          buttonIcon={<MdOutlineClose />}
          buttonText="Close"
          onClick={onClose}
        />

        {/* Information Grid */}
        <SettingGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col p-4 border border-foreground bg-background_alt rounded-md"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-secondary">Query ID</p>
                <CopyToClipboardButton copyText={feedbackItem.query_id} />
              </div>
              <p className="text-primary text-sm font-mono truncate">
                {feedbackItem.query_id}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col p-4 border border-foreground bg-background_alt rounded-md"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-secondary">
                  Conversation ID
                </p>
                <CopyToClipboardButton
                  copyText={feedbackItem.conversation_id}
                />
              </div>
              <p className="text-primary text-sm font-mono truncate">
                {feedbackItem.conversation_id}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col p-4 border border-foreground bg-background_alt rounded-md"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-secondary">User ID</p>
                <CopyToClipboardButton copyText={feedbackItem.user_id} />
              </div>
              <p className="text-primary text-sm font-mono truncate">
                {feedbackItem.user_id}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col p-4 border border-foreground bg-background_alt rounded-md"
            >
              <p className="text-sm font-medium text-secondary mb-2">
                Base Model
              </p>
              <p className="text-primary text-sm">
                {feedbackItem.base_lm_used}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col p-4 border border-foreground bg-background_alt rounded-md"
            >
              <p className="text-sm font-medium text-secondary mb-2">
                Complex Model
              </p>
              <p className="text-primary text-sm">
                {feedbackItem.complex_lm_used}
              </p>
            </motion.div>
          </div>
        </SettingGroup>
      </SettingCard>

      {/* Content Tabs */}
      <SettingCard>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="history" className="flex items-center gap-2">
                Conversation History
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-0">
              <div className="flex flex-col gap-4 w-full overflow-y-auto">
                <div className="flex flex-col gap-3 p-4 bg-background_alt rounded-md border border-foreground">
                  {feedbackItem.conversation_history.map(
                    (message: DebugMessage, messageIndex: number) => (
                      <motion.div
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: messageIndex * 0.05 }}
                      >
                        <DebugMessageDisplay
                          message={message}
                          messageIndex={messageIndex}
                        />
                      </motion.div>
                    )
                  )}
                </div>

                {feedbackItem.action_information.length > 0 && (
                  <div className="flex flex-col gap-3 p-4 bg-background_alt rounded-md border border-foreground">
                    <div className="flex items-center gap-2">
                      <p className="text-primary text-sm font-medium">
                        Queries Performed
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feedbackItem.action_information.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-background rounded-md border border-foreground"
                        >
                          <p className="text-primary text-sm font-medium mb-1">
                            {action.code.text}
                          </p>
                          <p className="text-secondary text-xs">
                            Collection: {action.collection_name}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <div className="flex flex-col gap-4 w-full overflow-y-auto">
                {/* Route Display */}
                <div className="flex flex-col gap-3 p-4 bg-background_alt rounded-md border border-foreground">
                  <p className="text-primary text-sm font-medium">Task Route</p>
                  <div className="flex flex-row gap-2 items-center w-full justify-center flex-wrap">
                    {feedbackItem.route.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <div className="px-3 py-1 bg-accent/10 text-accent rounded-md border border-accent/20">
                          <p className="font-medium text-sm">{step}</p>
                        </div>
                        {index < feedbackItem.route.length - 1 && (
                          <span className="mx-2 text-secondary">→</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Task Details */}
                <TaskDisplay tasks_completed={feedbackItem.tasks_completed} />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </SettingCard>
    </motion.div>
  );
}
