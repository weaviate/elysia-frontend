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
import { Checkbox } from "@/components/ui/checkbox";
import { FaDatabase } from "react-icons/fa";

import { Button } from "@/components/ui/button";
const StartDialog: React.FC = () => {
  const router = useRouter();
  const dontShowAgainKey = "ELYSIA_START_DIALOG_DONT_SHOW_AGAIN";

  const [open, setOpen] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const dontShow = localStorage.getItem(dontShowAgainKey);
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
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setOpen(false);
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setOpen(false);
  };

  const handleLearnMore = () => {
    router.push("/about");
    if (dontShowAgain) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setOpen(false);
  };

  const handleExploreData = () => {
    router.push("/data");
    if (dontShowAgain) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="flex gap-3 items-center justify-start">
            <div
              className={`rounded-full border-2 transition-all duration-200 w-6 h-6 border-accent animate-spin shadow-[0_0_5px_#A5FF90,0_0_5px_#A5FF90]`}
            />
            <p className="text-primary text-3xl font-bold">
              Welcome to Elysia!
            </p>
          </DialogTitle>
          <DialogDescription className="flex justify-start">
            Open Source Release
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <p>
              Elysia is your newest open-source agentic AI platform powered by
              <strong> Weaviate </strong>. Import your own data and start
              exploring them with the power of agentic AI.
            </p>
            <p>
              You can start by adding existing data to Elysia, or import your
              own via the interface directly into your Weaviate database. Elysia
              will analyze your data and create an agentic chain-of-thought
              reasoning process to navigate your data.
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col justify-between w-full gap-4">
            <div className="flex w-full justify-start gap-2 items-center">
              <Checkbox
                id="dontshowagain"
                checked={dontShowAgain}
                onCheckedChange={handleCheck}
              />
              <p className="text-sm text-secondary">Don&apos;t show again</p>
            </div>
            <div className="flex flex-col lg:flex-row w-full justify-center gap-2">
              <Button
                variant="default"
                className="w-full"
                onClick={handleLearnMore}
              >
                <HiMiniSparkles />
                Learn More
              </Button>
              <Button
                variant="default"
                className="w-full text-primary"
                onClick={handleExploreData}
              >
                <FaDatabase />
                Import Data
              </Button>
              <Button
                className="w-full text-primary"
                variant="default"
                onClick={handleContinue}
              >
                <BiSolidHappy />
                Start Elysia
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartDialog;
