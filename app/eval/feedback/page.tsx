"use client";

import { useEffect, useRef, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { getCollection } from "../../components/explorer/hooks";
import { Separator } from "@/components/ui/separator";
import { GoTrash } from "react-icons/go";
import {
  CollectionData,
  Feedback,
  FeedbackMetadata,
  Filter,
} from "../../components/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackDetails from "../../components/evaluation/FeedbackDetails";
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

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import React, { useContext } from "react";
import { SessionContext } from "@/app/components/contexts/SessionContext";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { id } = useContext(SessionContext);

  const [feedbackData, setFeedbackData] = useState<CollectionData | null>(null);
  const feedbackLoading = useRef(false);
  const [feedbackSortOn, setFeedbackSortOn] = useState<string | null>(
    "feedback_date"
  );
  const [feedbackAscending, setFeedbackAscending] = useState<boolean>(false);
  const [feedbackPage, setFeedbackPage] = useState<number>(0);
  const feedbackPageSize = 20;
  const [feedbackFilter, setFeedbackFilter] = useState<string>("all");
  const [maxPage, setMaxPage] = useState<number>(0);

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

    const feedbackData = await getCollection(
      "ELYSIA_FEEDBACK__",
      feedbackPage,
      feedbackPageSize,
      feedbackSortOn,
      feedbackAscending,
      filter_config,
      true
    );
    setFeedbackData(feedbackData);
    fetchMetadata();
    feedbackLoading.current = false;
  };

  const fetchMetadata = async () => {
    if (!id) {
      return;
    }
    const user_id = process.env.NODE_ENV === "development" ? "admin" : id;
    const res = await fetch("/api/get_feedback_metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user_id || "" }),
    });
    const data: FeedbackMetadata = await res.json();
    setMaxPage(Math.ceil(data.total_feedback / feedbackPageSize) - 1);
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
        setFeedbackPage(parseInt(page) - 1);
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
    router.push(`/eval`);
  };

  const routerSetPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const path = pathname;
    params.set("page", (page + 1).toString());
    router.push(`${path}?${params.toString()}`);
  };

  const pageDown = () => {
    if (feedbackPage === 0) return;
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
      const res = await fetch("/api/delete_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: feedback.user_id,
          query_id: feedback.query_id,
          conversation_id: feedback.conversation_id,
        }),
      });
      const data: { error: string } = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      fetchFeedbackData();
    }
  };

  return (
    <div className="flex flex-col w-full gap-2 items-start justify-start">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={backToDashboard}
            >
              Evaluation
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="cursor-pointer">
            <BreadcrumbPage>Feedback</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col w-full md:w-1/3 gap-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xl font-bold font-heading text-primary">
            User Feedback
          </p>
          <Button size={"sm"} onClick={() => fetchFeedbackData()}>
            <LuRefreshCw size={14} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center justify-start gap-2 w-full">
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
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
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
        <Separator />
      </div>
      <div className="flex w-full gap-4">
        {feedbackLoading.current ? (
          <div className="w-full lg:w-1/3 flex flex-col gap-4 items-center justify-center fade-in">
            <Skeleton className="w-full h-[15vh]" />
            <Skeleton className="w-full h-[15vh]" />
            <Skeleton className="w-full h-[15vh]" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start justify-start w-full gap-4">
            <div
              className={`${
                selectedIndex !== null ? "hidden lg:flex" : "flex"
              } flex flex-col gap-4 w-full lg:w-1/3`}
            >
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => pageDown()}>
                    <MdOutlineKeyboardArrowLeft />
                    Previous
                  </Button>
                  <p className="text-primary text-xs font-light">
                    {"Page " + (feedbackPage + 1) + " of " + (maxPage + 1)}
                  </p>
                  <Button size="sm" variant="ghost" onClick={() => pageUp()}>
                    Next
                    <MdOutlineKeyboardArrowRight />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col max-h-[calc(100vh-15rem)] overflow-y-auto gap-1">
                {feedbackData &&
                  (feedbackData as Feedback).items &&
                  (feedbackData as Feedback).items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-start w-full gap-2 bg-background_alt p-4 rounded-md hover:bg-foreground_alt transition-all duration-300 ease-in-out cursor-pointer ${
                        selectedIndex === index ? "bg-foreground" : ""
                      }`}
                      onClick={() => handleClick(index)}
                    >
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-base text-primary">
                            {item.user_prompt}
                          </p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size={"icon"} variant={"ghost"}>
                                <SlOptions size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem
                                onClick={() => removeFeedback(index)}
                              >
                                <GoTrash className="text-error" />
                                <span className="text-error">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          <Badge>{convert_date(item.feedback_date)}</Badge>
                          <Badge>
                            {Math.round(item.time_taken_seconds)}s Query Time
                          </Badge>
                          {item.feedback === 2 && (
                            <Badge className="text-highlight bg-background">
                              Very Positive
                            </Badge>
                          )}
                          {item.feedback === 1 && (
                            <Badge className="text-accent bg-background">
                              Positive
                            </Badge>
                          )}
                          {item.feedback === 0 && (
                            <Badge className="text-error bg-background">
                              Negative
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full lg:w-2/3 flex">
              {selectedIndex !== null && feedbackData && (
                <FeedbackDetails
                  feedbackData={feedbackData as Feedback}
                  selectedIndex={selectedIndex}
                  onClose={() => setSelectedIndex(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
