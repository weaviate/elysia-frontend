"use client";

import { createContext, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
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
      router.push("/eval");
    } else {
      router.push(`/eval/${page}`);
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
