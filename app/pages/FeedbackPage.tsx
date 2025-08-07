"use client";

import { useEffect, useRef, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { getCollectionData } from "@/app/api/getCollection";
import { GoTrash } from "react-icons/go";
import { Filter } from "@/app/types/objects";
import { motion } from "framer-motion";
import { MdFeedback } from "react-icons/md";

import { Feedback, FeedbackMetadata, FeedbackItem } from "../components/types";

// Type for feedback collection data that matches the Feedback structure
type FeedbackCollectionData = {
  properties: { [key: string]: string };
  items: FeedbackItem[];
  error?: string;
};

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackDetails from "../components/evaluation/FeedbackDetails";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SlOptions } from "react-icons/sl";

import { useSearchParams, usePathname } from "next/navigation";

import React, { useContext } from "react";
import { SessionContext } from "@/app/components/contexts/SessionContext";
import { getFeedback } from "@/app/api/getFeedback";
import { deleteFeedback } from "@/app/api/deleteFeedback";
import { RouterContext } from "../components/contexts/RouterContext";

// Import modern setting components
import {
  SettingCard,
  SettingHeader,
  SettingGroup,
} from "../components/configuration/SettingComponents";

export default function Home() {
  const searchParams = useSearchParams();
  const { changePage } = useContext(RouterContext);
  const pathname = usePathname();

  const { id } = useContext(SessionContext);

  const [feedbackData, setFeedbackData] =
    useState<FeedbackCollectionData | null>(null);
  const feedbackLoading = useRef(false);
  const [feedbackSortOn, setFeedbackSortOn] = useState<string | null>(
    "feedback_date"
  );
  const [feedbackAscending, setFeedbackAscending] = useState<boolean>(false);
  const [feedbackPage, setFeedbackPage] = useState<number>(1);
  const feedbackPageSize = 20;
  const [feedbackFilter, setFeedbackFilter] = useState<string>("all");
  const [maxPage, setMaxPage] = useState<number>(0);

  const fetchMetadata = async () => {
    if (!id) {
      return;
    }
    const data: FeedbackMetadata = await getFeedback(id);
    setMaxPage(Math.ceil(data.total_feedback / feedbackPageSize) - 1);
  };

  const fetchFeedbackData = async () => {
    if (!id || feedbackLoading.current) {
      return;
    }
    feedbackLoading.current = true;
    setSelectedIndex(null);

    const filters: Filter[] = [];

    if (feedbackFilter === "positive") {
      filters.push({
        field: "feedback",
        operator: "equal",
        value: 1.0,
      });
    } else if (feedbackFilter === "negative") {
      filters.push({
        field: "feedback",
        operator: "equal",
        value: 0.0,
      });
    } else if (feedbackFilter === "very_positive") {
      filters.push({
        field: "feedback",
        operator: "equal",
        value: 2.0,
      });
    }

    if (process.env.NODE_ENV != "development" && id) {
      filters.push({
        field: "user_id",
        operator: "equal",
        value: id,
      });
    }

    const filter_config: { type: string; filters: Filter[] } = {
      type: "all",
      filters: filters,
    };

    const feedbackData = await getCollectionData(
      id,
      "ELYSIA_FEEDBACK__",
      feedbackPage - 1, // Convert from 1-based UI to 0-based API
      feedbackPageSize,
      feedbackSortOn,
      feedbackAscending,
      filter_config,
      ""
    );
    setFeedbackData(feedbackData as FeedbackCollectionData);
    fetchMetadata();
    feedbackLoading.current = false;
  };

  const handleSortOrderChange = (value: string) => {
    setFeedbackAscending(value === "ascending");
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [
    feedbackPage,
    feedbackPageSize,
    feedbackSortOn,
    feedbackAscending,
    feedbackFilter,
    id,
  ]);

  useEffect(() => {
    if (pathname === "/eval/feedback") {
      const page = searchParams.get("page");
      if (page) {
        setFeedbackPage(parseInt(page));
      }
    }
  }, [searchParams, pathname]);

  const convert_date = (date: string) => {
    const date_obj = new Date(date);
    return date_obj.toLocaleDateString();
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const backToDashboard = () => {
    changePage("eval", {}, true);
  };

  const routerSetPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    changePage("eval", { page: "feedback" }, true);
  };

  const pageDown = () => {
    if (feedbackPage === 1) return;
    setSelectedIndex(null);
    routerSetPage(feedbackPage - 1);
  };

  const pageUp = () => {
    if (feedbackPage + 1 > maxPage) return;
    setSelectedIndex(null);
    routerSetPage(feedbackPage + 1);
  };

  const removeFeedback = async (index: number) => {
    const feedback = feedbackData?.items[index];
    if (feedback) {
      const res = await deleteFeedback(
        feedback.user_id,
        feedback.conversation_id,
        feedback.query_id
      );
      if (res.error) {
        throw new Error(res.error);
      }
      fetchFeedbackData();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full gap-4 min-h-0 items-start justify-start h-full fade-in p-2 lg:p-4">
        {/* Breadcrumb */}
        <div className="flex mb-2 w-full justify-start">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer text-lg flex items-center gap-2"
                  onClick={backToDashboard}
                >
                  Evaluation
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="cursor-pointer">
                <BreadcrumbPage className="text-lg gap-2 flex items-center justify-center">
                  <div className="flex items-center justify-center shrink-0 w-8 h-8 bg-highlight rounded-md">
                    <MdFeedback size={18} />
                  </div>
                  Feedback
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full gap-6">
          {/* Controls Card */}
          <SettingCard>
            <SettingHeader
              icon={<MdFeedback />}
              className="bg-highlight"
              header="User Feedback"
              buttonIcon={<LuRefreshCw />}
              buttonText="Refresh"
              onClick={() => fetchFeedbackData()}
            />

            <SettingGroup>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"sm"} variant={"outline"}>
                        {feedbackSortOn === "feedback_date"
                          ? "Date"
                          : feedbackSortOn === "time_taken_seconds"
                            ? "Query Time"
                            : "Sort By"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={feedbackSortOn || ""}
                        onValueChange={setFeedbackSortOn}
                      >
                        <DropdownMenuRadioItem value="feedback_date">
                          Date
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="time_taken_seconds">
                          Query Time
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"sm"} variant={"outline"}>
                        {feedbackAscending ? "Ascending" : "Descending"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={feedbackAscending ? "ascending" : "descending"}
                        onValueChange={handleSortOrderChange}
                      >
                        <DropdownMenuRadioItem value="ascending">
                          Ascending
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="descending">
                          Descending
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"sm"} variant={"outline"}>
                        Filter by {feedbackFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={feedbackFilter}
                        onValueChange={setFeedbackFilter}
                      >
                        <DropdownMenuRadioItem value="all">
                          All
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="very_positive">
                          Very Positive
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="positive">
                          Positive
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="negative">
                          Negative
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SettingGroup>
          </SettingCard>
          {/* Feedback Content Card */}
          <SettingCard>
            <div className="flex flex-col lg:flex-row items-start justify-start w-full gap-6 h-full min-h-0">
              {feedbackLoading.current ? (
                <div className="w-full flex flex-col gap-4 items-center justify-center fade-in">
                  <Skeleton className="w-full h-[15vh]" />
                  <Skeleton className="w-full h-[15vh]" />
                  <Skeleton className="w-full h-[15vh]" />
                </div>
              ) : (
                <>
                  {/* Feedback List */}
                  <div
                    className={`${
                      selectedIndex !== null ? "hidden lg:flex" : "flex"
                    } flex flex-col gap-4 w-full lg:w-1/3`}
                  >
                    {/* Pagination Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center w-full p-3 bg-background_alt rounded-md border border-foreground"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => pageDown()}
                          disabled={feedbackPage === 1}
                          className="flex items-center gap-2"
                        >
                          <MdOutlineKeyboardArrowLeft size={16} />
                          Previous
                        </Button>
                        <div className="flex items-center gap-2 px-3">
                          <span className="text-primary text-sm font-medium">
                            Page {feedbackPage} of {maxPage + 1}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => pageUp()}
                          disabled={feedbackPage + 1 > maxPage}
                          className="flex items-center gap-2"
                        >
                          Next
                          <MdOutlineKeyboardArrowRight size={16} />
                        </Button>
                      </div>
                    </motion.div>

                    {/* Feedback Items */}
                    <div className="flex flex-col max-h-[calc(100vh-20rem)] overflow-y-auto mb-20 gap-2">
                      {feedbackData &&
                        (feedbackData as Feedback).items &&
                        (feedbackData as Feedback).items.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-start justify-start w-full gap-3 p-4 rounded-md border transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm ${
                              selectedIndex === index
                                ? "bg-accent/10 border-accent shadow-sm"
                                : "bg-background_alt border-foreground hover:bg-background_alt/80"
                            }`}
                            onClick={() => handleClick(index)}
                          >
                            <div className="flex flex-col gap-3 w-full min-w-0">
                              <div className="flex items-start justify-between w-full gap-2">
                                <p className="text-sm text-primary line-clamp-2 flex-1">
                                  {item.user_prompt}
                                </p>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size={"icon"}
                                      variant={"ghost"}
                                      className="h-8 w-8 flex-shrink-0"
                                    >
                                      <SlOptions size={14} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    side="right"
                                    align="start"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFeedback(index);
                                      }}
                                      className="text-error focus:text-error focus:bg-error/10"
                                    >
                                      <GoTrash size={14} />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center justify-start gap-2 flex-wrap">
                                <Badge className="text-xs bg-background_alt text-secondary">
                                  {convert_date(item.feedback_date)}
                                </Badge>
                                <Badge className="text-xs bg-background_alt text-secondary">
                                  {Math.round(item.time_taken_seconds)}s
                                </Badge>
                                {item.feedback === 2 && (
                                  <Badge className="text-highlight bg-highlight/10 border-highlight/20 text-xs">
                                    Very Positive
                                  </Badge>
                                )}
                                {item.feedback === 1 && (
                                  <Badge className="text-accent bg-accent/10 border-accent/20 text-xs">
                                    Positive
                                  </Badge>
                                )}
                                {item.feedback === 0 && (
                                  <Badge className="text-error bg-error/10 border-error/20 text-xs">
                                    Negative
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Feedback Details */}
                  <div className="w-full lg:w-2/3 flex flex-col min-h-0 h-full">
                    {selectedIndex !== null && feedbackData ? (
                      <div className="h-[40rem] overflow-y-scroll">
                        <FeedbackDetails
                          feedbackData={feedbackData as Feedback}
                          selectedIndex={selectedIndex}
                          onClose={() => setSelectedIndex(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full min-h-[20rem] bg-background_alt rounded-md border border-foreground">
                        <div className="flex flex-col items-center gap-3 text-secondary">
                          <MdFeedback size={48} className="opacity-50" />
                          <p className="text-lg font-medium">
                            Select feedback to view details
                          </p>
                          <p className="text-sm text-center max-w-md">
                            Choose a feedback item from the list to see the full
                            conversation and details.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
}
