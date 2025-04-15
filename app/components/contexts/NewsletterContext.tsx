"use client";

import { createContext, useState } from "react";

export const NewsletterContext = createContext<{
  openDialog: boolean;
  handleOpenDialog: () => void;
  handleCloseDialog: () => void;
  subscribeToElysia: (email: string) => void;
  unsubscribeFromElysia: () => void;
  email: string;
  subscribed: boolean;
}>({
  openDialog: false,
  handleOpenDialog: () => {},
  handleCloseDialog: () => {},
  subscribeToElysia: () => {},
  unsubscribeFromElysia: () => {},
  email: "",
  subscribed: false,
});

export const NewsletterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const subscribeToElysia = (email: string) => {
    if (!verifyEmail(email)) {
      return;
    }
    setEmail(email);
    setSubscribed(true);
    fetch(`api/add_subscription`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const verifyEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const unsubscribeFromElysia = () => {
    setEmail("");
    setSubscribed(false);
  };

  return (
    <NewsletterContext.Provider
      value={{
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        subscribeToElysia,
        unsubscribeFromElysia,
        email,
        subscribed,
      }}
    >
      {children}
    </NewsletterContext.Provider>
  );
};
