"use client";

import { Message, ResponsePayload } from "@/app/types/chat";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import CopyToClipboardButton from "@/app/components/navigation/CopyButton";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa";
import { EvaluationContext } from "@/app/components/contexts/EvaluationContext";
import { useContext } from "react";

interface ResponseButtonsProps {
  conversationID: string;
  queryID: string;
  messages: Message[];
  query_start: Date;
  query_end: Date | null;
  feedback: number | null;
  updateFeedback: (
    conversationId: string,
    queryId: string,
    feedback: number,
  ) => void;
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ResponseButtons: React.FC<ResponseButtonsProps> = ({
  conversationID,
  queryID,
  messages,
  query_start,
  query_end,
  feedback,
  updateFeedback,
}) => {
  const [content, setContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [superLiked, setSuperLiked] = useState(false);

  const { showFeedbackNotification, disableFeedbackNotification } =
    useContext(EvaluationContext);

  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setLiked(feedback === 1);
    setDisliked(feedback === 0);
    setSuperLiked(feedback === 2);
  }, [feedback]);

  const handleSuperLike = () => {
    updateFeedback(conversationID, queryID, 2);
  };

  const handleLike = () => {
    updateFeedback(conversationID, queryID, 1);
  };

  const handleDislike = () => {
    updateFeedback(conversationID, queryID, 0);
  };

  useEffect(() => {
    if (messages.length > 0) {
      let content = "";
      messages.forEach((message) => {
        if (message.type === "text") {
          const response = message.payload as ResponsePayload;
          if (
            response.type === "summary" ||
            response.type === "text_with_citations" ||
            response.type === "text_with_title"
          ) {
            content += response.metadata.title || "";
            content += "\n\n";
            for (const object of response.objects) {
              content += object.text;
              content += "\n\n";
            }
          }
        }
      });
      setContent(content);
    }
  }, [messages]);

  useEffect(() => {
    if (showFeedbackNotification) {
      // Start fade out after 4 seconds
      const fadeTimer = setTimeout(() => {
        setFadeIn(false);
      }, 4000);

      // Disable notification after fade out (7 seconds total)
      const disableTimer = setTimeout(() => {
        disableFeedbackNotification();
      }, 7000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(disableTimer);
      };
    }
  }, [showFeedbackNotification, disableFeedbackNotification]);

  return (
    <div className="w-full flex justify-end items-center gap-2">
      {/* TODO: Fix feedback notification UI - needs better positioning and styling */}
      {/* {showFeedbackNotification && (
        <div className="relative">
          <div
            className={`flex absolute bottom-full transition-opacity duration-300 gap-2 right-0 mb-2 bg-foreground backdrop-blur-sm rounded-lg p-3 ${
              fadeIn ? "fade-in" : "fade-out"
            }`}
          >
            <GrInfo size={16} className="text-primary" />
            <p className="text-sm text-primary">
              Rate this response and help Elysia improve!
            </p>
          </div>
        </div>
      )} */}
      <p className="text-sm text-secondary">
        Finished in{" "}
        {query_end
          ? query_end.getTime() - query_start.getTime() > 60000
            ? `${Math.round(
                (query_end.getTime() - query_start.getTime()) / 60000,
              )}m`
            : `${Math.round(
                (query_end.getTime() - query_start.getTime()) / 1000,
              )}s`
          : "0s"}
      </p>
      <div className="flex ">
        <CopyToClipboardButton copyText={content} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className={`bg-background ${
                  superLiked ? "text-alt_color_a" : ""
                }`}
                onClick={handleSuperLike}
              >
                <FaHeart size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Very Good Response</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className={`bg-background ${liked ? "text-accent" : ""}`}
                onClick={handleLike}
              >
                <FaThumbsUp size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Good Response</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className={`bg-background ${disliked ? "text-error" : ""}`}
                onClick={handleDislike}
              >
                <FaThumbsDown size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bad Response</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ResponseButtons;
