"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { IoClose } from "react-icons/io5";

import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaNewspaper } from "react-icons/fa6";

import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

import { NewsletterContext } from "../contexts/NewsletterContext";
import { Input } from "@/components/ui/input";

const RateLimitDialog: React.FC = () => {
  const [open, setOpen] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const dontShow = localStorage.getItem("dont_show_rate_limit_dialog");
      return dontShow ? false : true;
    }
    return true; // Default to showing dialog on server-side render
  });
  const { subscribeToElysia, email, subscribed, unsubscribeFromElysia } =
    useContext(NewsletterContext);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const [_email, _setEmail] = useState(email);

  const handleSubscribe = () => {
    subscribeToElysia(_email);
  };

  const handleCheck = () => {
    setDontShowAgain((prev) => !prev);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dont_show_rate_limit_dialog", "true");
    }
    setOpen(false);
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem("dont_show_rate_limit_dialog", "true");
    }
    setOpen(false);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank you for trying Elysia!</DialogTitle>
          <DialogDescription>
            You hit today&apos;s rate limit, but no worries, we&apos;ll reset it
            tomorrow!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <p>
            In the meantime, you can follow us on social media to stay updated
            on Elysia, or subscribe to one of our newsletters to get updates on
            our latest features.
          </p>
          <div className="flex flex-col gap-2">
            <p>Subscribe to our newsletter</p>
            <div className="flex flex-row gap-2">
              <Input
                placeholder="Enter your email"
                value={_email}
                onChange={(e) => _setEmail(e.target.value)}
                disabled={subscribed}
                className={`${
                  subscribed ? "border-accent" : "border-secondary"
                }`}
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
          <div className="flex flex-col lg:flex-row gap-3 lg:justify-between">
            <div className="flex flex-row gap-2 items-center">
              <Avatar>
                <AvatarImage
                  src="https://media.licdn.com/dms/image/v2/D4D0BAQFfgBLRA2U4Og/company-logo_200_200/company-logo_200_200/0/1698828873823/weaviate_io_logo?e=1747872000&v=beta&t=7pT2HiWmf65d6gnJGebFDriKy_3Ml08On_ELqmD3XAs"
                  alt="@weaviate"
                />
                <AvatarFallback>Weaviate</AvatarFallback>
              </Avatar>
              <p>Weaviate</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  openLink(
                    "https://www.linkedin.com/company/weaviate-io/posts/?feedView=all",
                  )
                }
              >
                <FaLinkedin className="text-primary" /> LinkedIn
              </Button>
              <Button
                variant="ghost"
                onClick={() => openLink("https://x.com/weaviate_io")}
              >
                <FaSquareXTwitter className="text-primary" /> X
              </Button>
              <Button
                variant="ghost"
                onClick={() => openLink("https://newsletter.weaviate.io/")}
              >
                <FaNewspaper className="text-primary" /> Newsletter
              </Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:justify-between">
            <div className="flex flex-row gap-2 items-center">
              <Avatar>
                <AvatarImage
                  src="https://media.licdn.com/dms/image/v2/C5603AQGp4PgKAHLdoQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1571675697175?e=1745452800&v=beta&t=UTDpZtOEpJetUHsoIgJbEIY4-5YITAvLmyDNCMFtdyA"
                  alt="@danny"
                />
                <AvatarFallback>Danny Williams</AvatarFallback>
              </Avatar>
              <p>Danny Williams</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  openLink("https://www.linkedin.com/in/dannyjameswilliams/")
                }
              >
                <FaLinkedin className="text-primary" /> LinkedIn
              </Button>
              <Button
                variant="ghost"
                onClick={() => openLink("https://x.com/drdannywilliams")}
              >
                <FaSquareXTwitter className="text-primary" /> X
              </Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:justify-between">
            <div className="flex flex-row gap-2 items-center">
              <Avatar>
                <AvatarImage
                  src="https://media.licdn.com/dms/image/v2/D4D03AQERM97c20Fx2A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707575479597?e=1745452800&v=beta&t=bDGsQFmXa5ISIEIQgQTFQ8aJfTKN3JnpSikYDqnakJY"
                  alt="@edward"
                />
                <AvatarFallback>Edward</AvatarFallback>
              </Avatar>
              <p>Edward Schmuhl</p>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  openLink("https://www.linkedin.com/in/edwardschmuhl/")
                }
              >
                <FaLinkedin className="text-primary" /> LinkedIn
              </Button>
              <Button
                variant="ghost"
                onClick={() => openLink("https://x.com/aestheticedwar1")}
              >
                <FaSquareXTwitter className="text-primary" /> X
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col lg:flex-row justify-center lg:justify-between w-full gap-4 mt-5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontshowagain"
              checked={dontShowAgain}
              onCheckedChange={handleCheck}
            />
            <p className="text-sm">Don&apos;t show again</p>
          </div>
          <Button variant="outline" onClick={handleContinue}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RateLimitDialog;
