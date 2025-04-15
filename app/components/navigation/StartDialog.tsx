"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { BiSolidHappy } from "react-icons/bi";
import { HiMiniSparkles } from "react-icons/hi2";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FaDatabase } from "react-icons/fa";

import { Button } from "@/components/ui/button";
const StartDialog: React.FC = () => {
  const router = useRouter();

  const [open, setOpen] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const dontShow = localStorage.getItem("dont_show_start_dialog");
      return dontShow ? false : true;
    }
    return true; // Default to showing dialog on server-side render
  });
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCheck = () => {
    setDontShowAgain((prev) => !prev);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dont_show_start_dialog", "true");
    }
    setOpen(false);
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem("dont_show_start_dialog", "true");
    }
    setOpen(false);
  };

  const handleLearnMore = () => {
    router.push("/about");
    if (dontShowAgain) {
      localStorage.setItem("dont_show_start_dialog", "true");
    }
    setOpen(false);
  };

  const handleExploreData = () => {
    router.push("/data");
    if (dontShowAgain) {
      localStorage.setItem("dont_show_start_dialog", "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Welcome to the Elysia!</DialogTitle>
          <DialogDescription>Alpha Demo</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex lg:flex-row flex-col items-center gap-4">
            <p>
              Elysia is our newest agentic AI platform powered by
              <strong> Weaviate Agents</strong>.
            </p>
            <Button
              variant="outline"
              className="w-fit"
              onClick={handleLearnMore}
            >
              <HiMiniSparkles />
              Learn more
            </Button>
          </div>
          <Separator />
          <div className="flex lg:flex-row flex-col items-center gap-4">
            <p>
              This demo showcases Elysia&apos;s agentic Retrieval-Augmented
              Generation (RAG) capabilities. We provide static datasets from
              various domains for you to explore and query.
            </p>
            <Button
              variant="outline"
              className="w-fit"
              onClick={handleExploreData}
            >
              <FaDatabase />
              Explore Data
            </Button>
          </div>
          <Separator />
          <p>
            <strong>Try it out</strong> by choosing one of the pre-defined
            prompts and watch how Elysia is thinking through its
            chain-of-thought reasoning, as it retrieves, aggregates, and
            summarizes data.
          </p>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dontshowagain"
                checked={dontShowAgain}
                onCheckedChange={handleCheck}
              />
              <p className="text-sm">Don&apos;t show again</p>
            </div>
            <Button
              className="w-fit"
              variant="outline"
              onClick={handleContinue}
            >
              <BiSolidHappy />
              Start demo
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartDialog;
