"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { IoWarning } from "react-icons/io5";
import { FaArrowsRotate, FaGear, FaTrash } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { SessionContext } from "@/app/components/contexts/SessionContext";
import { RouterContext } from "../contexts/RouterContext";
import { migrateCollections } from "@/app/api/migrateCollections";
import { ToastContext } from "../contexts/ToastContext";

const UpgradeDialog: React.FC = () => {
  const { changePage } = useContext(RouterContext);
  const { showErrorToast, showSuccessToast } = useContext(ToastContext);
  const { elysiaCollectionsSupported, showUpgradeDialog, id } =
    useContext(SessionContext);

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const prevElysiaCollectionsSupported = useRef(elysiaCollectionsSupported);

  // Reset dismissed state when elysiaCollectionsSupported changes
  // This ensures the dialog reappears after saving a config if still unsupported
  useEffect(() => {
    if (prevElysiaCollectionsSupported.current !== elysiaCollectionsSupported) {
      setDismissed(false);
      setUpgradeError(null);
      prevElysiaCollectionsSupported.current = elysiaCollectionsSupported;
    }
  }, [elysiaCollectionsSupported]);

  // Listen for external trigger to show the dialog (from sidebar button)
  useEffect(() => {
    if (showUpgradeDialog) {
      setDismissed(false);
      setUpgradeError(null);
    }
  }, [showUpgradeDialog]);

  // Only show dialog when collections are explicitly false (not null) and not dismissed
  // null means we haven't loaded the value yet, so we don't show the dialog
  // Also keep open while upgrading
  const open =
    (elysiaCollectionsSupported === false && !dismissed) || isUpgrading;

  const handleChangeConfig = () => {
    if (isUpgrading) return; // Prevent closing while upgrading
    setDismissed(true);
    changePage("settings");
  };

  const handleUpgrade = async (reset: boolean) => {
    if (!id) {
      setUpgradeError("User ID not available");
      return;
    }

    setIsUpgrading(true);
    setUpgradeError(null);

    try {
      const response = await migrateCollections(reset, id);

      if (response.error) {
        setUpgradeError(response.error);
        showErrorToast("Upgrade Failed", response.error);
      } else {
        // Success - re-initialize the user
        showSuccessToast(
          "Upgrade Successful",
          reset
            ? "Collections have been reset. Re-initializing..."
            : "Collections have been migrated. Re-initializing...",
        );

        // Re-initialize user to refresh the state
        // This will update elysiaCollectionsSupported and close the dialog
        window.location.reload();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setUpgradeError(errorMessage);
      showErrorToast("Upgrade Failed", errorMessage);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto"
        // Prevent closing the dialog by clicking outside or pressing escape
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        // Hide the close button
        hideCloseButton
      >
        <div className="max-h-full overflow-y-auto space-y-4">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center justify-start">
              <motion.div
                animate={isUpgrading ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
                transition={
                  isUpgrading
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
              >
                {isUpgrading ? (
                  <FaArrowsRotate className="text-warning text-3xl" />
                ) : (
                  <IoWarning className="text-warning text-3xl" />
                )}
              </motion.div>
              <p className="text-primary text-2xl font-bold">
                {isUpgrading
                  ? "Upgrading Collections..."
                  : "Collection Upgrade Required"}
              </p>
            </DialogTitle>
            <DialogDescription className="flex justify-start text-secondary">
              {isUpgrading
                ? "Please wait while your collections are being upgraded"
                : "Your Elysia collections need to be updated"}
            </DialogDescription>
          </DialogHeader>

          {isUpgrading ? (
            // Upgrading state
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaArrowsRotate className="text-warning text-5xl" />
                </motion.div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-primary font-semibold text-lg">
                    Upgrading your collections...
                  </p>
                  <p className="text-secondary text-sm text-center">
                    This may take a few minutes depending on your data size.
                    <br />
                    Please do not close this window.
                  </p>
                </div>
                <motion.div
                  className="w-full h-2 bg-foreground rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-warning"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ width: "50%" }}
                  />
                </motion.div>
              </div>
            </div>
          ) : (
            // Normal state - show options
            <div className="flex flex-col gap-4">
              {upgradeError && (
                <div className="flex flex-col gap-2 p-4 bg-error/10 rounded-lg border border-error/20">
                  <p className="text-error font-semibold">Upgrade Failed</p>
                  <p className="text-error text-sm">{upgradeError}</p>
                </div>
              )}

              <div className="flex flex-col gap-4 p-4 bg-foreground/10 rounded-lg border border-foreground">
                <p className="text-primary">
                  The current Weaviate cluster is using{" "}
                  <strong>outdated Elysia collections</strong> that are not
                  compatible with this version of Elysia.
                </p>
                <p className="text-secondary">
                  Choose how you want to upgrade your collections:
                </p>
              </div>

              {/* Option 1: Migrate */}
              <div className="flex flex-col gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-accent" />
                  <p className="text-accent font-semibold">
                    Migrate Existing Data
                  </p>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <ul className="list-disc list-inside text-secondary text-sm space-y-1 ml-2">
                  <li>
                    Your existing data will be <strong>preserved</strong>
                  </li>
                  <li>Conversations and configs will be migrated</li>
                  <li>May take longer depending on data size</li>
                </ul>
              </div>

              {/* Option 2: Reset */}
              <div className="flex flex-col gap-3 p-4 bg-highlight/10 rounded-lg border border-highlight/20">
                <div className="flex items-center gap-2">
                  <FaTrash className="text-highlight" />
                  <p className="text-highlight font-semibold">
                    Fresh Start (Reset)
                  </p>
                </div>
                <ul className="list-disc list-inside text-secondary text-sm space-y-1 ml-2">
                  <li>
                    All Elysia collections will be <strong>deleted</strong>
                  </li>
                  <li>Conversations and configs will be cleared</li>
                  <li>Your source data collections are untouched</li>
                  <li>Faster upgrade process</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2 bg-alt_color_b/10 rounded-lg p-3 text-sm text-alt_color_b border border-alt_color_b/20">
                <p className="font-semibold">
                  Alternatively, you can change your configuration to use a
                  different Weaviate cluster.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <motion.div
              className="flex flex-col w-full gap-3 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {!isUpgrading && (
                <>
                  {/* Primary actions row */}
                  <div className="flex flex-col lg:flex-row w-full justify-center gap-3 px-1 overflow-visible">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full lg:w-auto lg:flex-1"
                    >
                      <motion.div
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-full rounded-md"
                      >
                        <Button
                          className="w-full bg-accent/10 hover:bg-accent/20 text-accent border border-accent"
                          onClick={() => handleUpgrade(false)}
                        >
                          <FaDatabase className="mr-2" />
                          Migrate Data
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full lg:w-auto lg:flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-highlight/50 text-highlight hover:bg-highlight/10"
                        onClick={() => handleUpgrade(true)}
                      >
                        <FaTrash className="mr-2" />
                        Fresh Start
                      </Button>
                    </motion.div>
                  </div>

                  {/* Secondary action */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className="w-full px-1"
                  >
                    <Button
                      variant="ghost"
                      className="w-full text-secondary hover:text-primary"
                      onClick={handleChangeConfig}
                    >
                      <FaGear className="mr-2" />
                      Change Configuration Instead
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
