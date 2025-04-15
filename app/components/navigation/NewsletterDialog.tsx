"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FaNewspaper } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";

import { NewsletterContext } from "../contexts/NewsletterContext";

const NewsletterDialog: React.FC = () => {
  const {
    openDialog,
    handleCloseDialog,
    subscribeToElysia,
    email,
    subscribed,
    unsubscribeFromElysia,
  } = useContext(NewsletterContext);
  const [_email, _setEmail] = useState(email);

  const handleSubscribe = () => {
    subscribeToElysia(_email);
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (email) {
      _setEmail(email);
    }
  }, [email]);

  return (
    <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to our newsletter</DialogTitle>
          <DialogDescription>
            You can either subscribe our Weaviate newsletter to get updates on
            all of our products, or subscribe to our Elysia newsletter to get
            updates on our latest Elysia features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p> Subscribe to the Elysia newsletter</p>
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Enter your email"
              value={_email}
              onChange={(e) => _setEmail(e.target.value)}
              disabled={subscribed}
              className={`${subscribed ? "border-accent" : "border-secondary"}`}
            />
            <Button
              variant="outline"
              className={`${
                subscribed
                  ? "text-accent border-accent"
                  : "text-primary border-secondary"
              }`}
              onClick={handleSubscribe}
              disabled={subscribed}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </Button>
            {subscribed && (
              <Button
                variant="outline"
                className="text-error border-error w-9 h-9"
                onClick={unsubscribeFromElysia}
              >
                <IoClose />
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center justify-between">
            <p> Subscribe to the Weaviate newsletter</p>
            <Button
              variant="outline"
              className={`text-primary border-secondary`}
              onClick={() => openLink("https://newsletter.weaviate.io/")}
            >
              <FaNewspaper />
              weaviate.io
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterDialog;
