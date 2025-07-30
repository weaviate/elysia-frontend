"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { RouterContext } from "./RouterContext";

export const EvaluationContext = createContext<{
  evalPage: "feedback" | null;
  changeEvalPage: (page: "feedback" | null) => void;
  showFeedbackNotification: boolean;
  disableFeedbackNotification: () => void;
}>({
  evalPage: null,
  changeEvalPage: () => {},
  showFeedbackNotification: true,
  disableFeedbackNotification: () => {},
});

export const EvaluationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { changePage } = useContext(RouterContext);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [evalPage, setEvalPage] = useState<"feedback" | null>(null);

  const [showFeedbackNotification, setShowFeedbackNotification] =
    useState(true);

  const disableFeedbackNotification = () => {
    setShowFeedbackNotification(false);
  };

  useEffect(() => {
    if (pathname === "/eval") {
      setEvalPage(null);
    } else if (pathname === "/eval/feedback") {
      setEvalPage("feedback");
    }
  }, [searchParams, pathname]);

  const changeEvalPage = (page: "feedback" | null) => {
    if (page === null) {
      changePage("eval", {}, true);
    } else {
      changePage("eval", { page }, true);
    }
  };

  return (
    <EvaluationContext.Provider
      value={{
        evalPage,
        changeEvalPage,
        showFeedbackNotification,
        disableFeedbackNotification,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
