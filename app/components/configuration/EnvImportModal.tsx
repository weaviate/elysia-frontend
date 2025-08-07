"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EnvImportModalProps {
  isOpen: boolean;
  envContent: string;
  onOpenChange: (open: boolean) => void;
  onEnvContentChange: (content: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Modal component for importing API keys from .env file format
 * Supports both KEY=value and KEY="value" formats with comment filtering
 */
export default function EnvImportModal({
  isOpen,
  envContent,
  onOpenChange,
  onEnvContentChange,
  onSubmit,
  onCancel,
}: EnvImportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import API Keys from .env</DialogTitle>
          <DialogDescription>
            Paste your .env file content below. We&apos;ll automatically parse
            and add your API keys. Supports both <code>KEY=value</code> and{" "}
            <code>KEY=&quot;value&quot;</code> formats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="env-content" className="text-sm font-medium">
              .env Content
            </label>
            <textarea
              id="env-content"
              value={envContent}
              onChange={(e) => onEnvContentChange(e.target.value)}
              placeholder={`OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY="your_key_here"
GOOGLE_API_KEY=your_key_here`}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Comments (lines starting with #) will be ignored
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!envContent.trim()}
            className="bg-accent/10 text-accent hover:bg-accent/20"
          >
            Import Keys
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
