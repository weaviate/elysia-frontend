"use client";

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoSparkles, IoRocketSharp } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { Checkbox } from "@/components/ui/checkbox";
import { FaDatabase, FaBrain, FaSearch, FaChartLine } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { SessionContext } from "@/app/components/contexts/SessionContext";
import { RouterContext } from "../contexts/RouterContext";
import { CollectionContext } from "../contexts/CollectionContext";
import { CorrectSettings } from "@/app/types/payloads";

// Feature card component
const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-start gap-3 p-3 rounded-lg bg-foreground/50 hover:bg-foreground transition-colors"
  >
    <div className="flex-shrink-0 p-2 rounded-md bg-purple-500/10 text-purple-400">
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="text-xs text-secondary">{description}</p>
    </div>
  </motion.div>
);

const StartDialog: React.FC = () => {
  const { changePage } = useContext(RouterContext);
  const dontShowAgainKey = "ELYSIA_START_DIALOG_DONT_SHOW_AGAIN";
  const { correctSettings, elysiaCollectionsSupported } =
    useContext(SessionContext);
  const { collections } = useContext(CollectionContext);
  const [internalOpen, setInternalOpen] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const dontShow = localStorage.getItem(dontShowAgainKey);
      return dontShow ? false : true;
    }
    return true; // Default to showing dialog on server-side render
  });

  // UpgradeDialog has higher priority - don't show StartDialog when UpgradeDialog should be shown
  // UpgradeDialog shows when elysiaCollectionsSupported === false
  const open = internalOpen && elysiaCollectionsSupported !== false;
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [invalidSettings, setInvalidSettings] = useState(false);

  // Helper function to check if deployment type has issues
  const checkDeploymentTypeIssues = (deploymentConfig: {
    enabled: boolean;
    [key: string]: boolean;
  }): boolean => {
    if (!deploymentConfig.enabled) return false; // Skip if not enabled
    // Check if any field (other than enabled) is false
    return Object.entries(deploymentConfig).some(
      ([key, value]) => key !== "enabled" && value === false,
    );
  };

  // Helper function to check if correctSettings has any issues
  const hasSettingsIssues = (settings: CorrectSettings): boolean => {
    // Check single fields
    if (!settings.base_model) return true;
    if (!settings.base_provider) return true;
    if (!settings.complex_model) return true;
    if (!settings.complex_provider) return true;

    // Check deployment types - only flag if enabled and has false values
    if (checkDeploymentTypeIssues(settings.weaviate_cloud)) return true;
    if (checkDeploymentTypeIssues(settings.weaviate_local)) return true;
    if (checkDeploymentTypeIssues(settings.weaviate_custom)) return true;

    return false;
  };

  useEffect(() => {
    if (correctSettings) {
      // Note: elysia_collections_supported is handled separately by UpgradeDialog
      const hasIncorrectSettings = hasSettingsIssues(correctSettings);
      if (!hasIncorrectSettings) {
        setInvalidSettings(false);
      } else {
        if (collections.length === 0) {
          setInvalidSettings(true);
        }
      }
    }
  }, [correctSettings]);

  const handleCheck = () => {
    setDontShowAgain((prev) => !prev);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setInternalOpen(false);
  };

  const handleSetupElysia = () => {
    changePage("settings");
    if (dontShowAgain) {
      localStorage.setItem(dontShowAgainKey, "true");
    }
    setInternalOpen(false);
  };

  const handleElysiaDocs = () => {
    window.open("https://weaviate.github.io/elysia/", "_blank");
  };

  const handleWeaviateCloud = () => {
    window.open("https://console.weaviate.cloud/", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="max-h-full overflow-y-auto space-y-4">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center justify-start">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <IoSparkles className="text-purple-400 text-3xl" />
              </motion.div>
              <div className="flex flex-col">
                <motion.p
                  className="text-primary text-2xl font-bold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome to Elysia!
                </motion.p>
              </div>
            </DialogTitle>
            <DialogDescription className="flex justify-start text-secondary">
              Your open-source agentic AI platform
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Hero section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/20"
            >
              <p className="text-primary">
                Elysia transforms how you interact with your data using{" "}
                <strong className="text-purple-400">agentic AI</strong> powered
                by <strong className="text-accent">Weaviate</strong>.
              </p>
              <p className="text-sm text-secondary">
                Import your data and let Elysia&apos;s intelligent agents
                navigate, analyze, and discover insights through
                chain-of-thought reasoning.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FeatureCard
                icon={<FaBrain className="text-lg" />}
                title="Agentic Reasoning"
                description="AI agents that think step-by-step to solve complex queries"
                delay={0.2}
              />
              <FeatureCard
                icon={<FaSearch className="text-lg" />}
                title="Smart Search"
                description="Semantic search across all your connected data"
                delay={0.3}
              />
              <FeatureCard
                icon={<FaDatabase className="text-lg" />}
                title="Vector Storage"
                description="Powered by Weaviate's vector database"
                delay={0.4}
              />
              <FeatureCard
                icon={<FaChartLine className="text-lg" />}
                title="Data Insights"
                description="Aggregate and analyze your data intelligently"
                delay={0.5}
              />
            </div>

            {/* Status section */}
            {invalidSettings ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex flex-col gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20"
              >
                <div className="flex items-center gap-2">
                  <FaGear className="text-warning" />
                  <p className="text-warning font-semibold">Setup Required</p>
                </div>
                <p className="text-sm text-secondary">
                  Connect your Weaviate cluster and configure your AI models to
                  get started. Need a cluster? Create one free at Weaviate Cloud
                  Console.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex flex-col gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="flex items-center gap-2">
                  <IoIosCheckmarkCircleOutline className="text-accent text-lg" />
                  <p className="text-accent font-semibold">Ready to Go!</p>
                </div>
                <p className="text-sm text-secondary">
                  Your configuration is set up. Start exploring your data with
                  Elysia&apos;s agentic AI capabilities.
                </p>
              </motion.div>
            )}
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
              <motion.div
                className="flex flex-col lg:flex-row w-full justify-center gap-3 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full lg:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleElysiaDocs}
                  >
                    <HiMiniSparkles className="mr-2" />
                    Elysia Docs
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full lg:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleWeaviateCloud}
                  >
                    <FaDatabase className="mr-2" />
                    Weaviate Cloud
                  </Button>
                </motion.div>
                {invalidSettings ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full lg:w-auto"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(168, 85, 247, 0.3), 0 0 15px rgba(168, 85, 247, 0.2)",
                          "0 0 15px rgba(168, 85, 247, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)",
                          "0 0 10px rgba(168, 85, 247, 0.3), 0 0 15px rgba(168, 85, 247, 0.2)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-full rounded-md"
                    >
                      <Button
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={handleSetupElysia}
                      >
                        <FaGear className="mr-2" />
                        Setup Elysia
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full lg:w-auto"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.3), 0 0 15px rgba(34, 197, 94, 0.2)",
                          "0 0 15px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.3)",
                          "0 0 10px rgba(34, 197, 94, 0.3), 0 0 15px rgba(34, 197, 94, 0.2)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-full rounded-md"
                    >
                      <Button
                        className="w-full bg-accent hover:bg-accent/80 text-white"
                        onClick={handleClose}
                      >
                        <IoRocketSharp className="mr-2" />
                        Get Started
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartDialog;
