"use client";

import { Separator } from "@/components/ui/separator";
import { FaCircle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GoDatabase } from "react-icons/go";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { IoShirtOutline } from "react-icons/io5";
import AggregationDisplay from "@/app/components/chat/display/aggregation";
import TicketsDisplay from "@/app/components/chat/display/tickets";
import DocumentDisplay from "@/app/components/chat/display/document";
import EcommerceDisplay from "@/app/components/chat/display/ecommerce";
import { CiCloudOn } from "react-icons/ci";

import { RiRobot2Line } from "react-icons/ri";
import { MdOutlineDataThresholding } from "react-icons/md";
import { NewsletterContext } from "@/app/components/contexts/NewsletterContext";
import { useContext } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

import {
  example_verba_github_issues,
  example_verba_emails,
  example_machine_learning_articles,
  example_weaviate_documentation,
  example_ecommerce,
  example_weather,
} from "./example_data";
import ConversationsDisplay from "@/app/components/chat/display/conversations";
import {
  ConversationDisplayType,
  DocumentPayload,
  Message,
  AggregationPayload,
  ResultPayload,
} from "@/app/components/types";
export default function Home() {
  const router = useRouter();

  const { handleOpenDialog } = useContext(NewsletterContext);

  const viewDataset = (dataset: string) => {
    router.push(`/data?collection_id=${dataset}&page=1`);
  };

  return (
    <div className="w-full flex items-center justify-center mt-8">
      <div className="w-full lg:w-[60vw] flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-2 fade-in">
          <div className="flex items-center gap-4 w-full justify-start">
            <FaCircle className="text-lg pulsing_color" />
            <p className="text-4xl">Welcome to Elysia</p>
          </div>
          <p className="text-lg">
            Elysia is an AI-driven data platform built on top of{" "}
            <strong>Weaviate Agents</strong>. It integrates{" "}
            <strong>agentic</strong> behavior to perform advanced operations
            such as agentic Retrieval-Augmented Generation (RAG), dynamic data
            transformation, generative feedback loops, and data visualization.
          </p>
          <p className="text-lg">
            This alpha demo showcases Elysia&apos;s agentic RAG capability that
            involves multi-step reasoning and chain-of-thought processing. This
            also involves generating Weaviate queries, dynamic data
            visualization, and more.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2 fade-in">
          <div className="flex flex-col lg:flex-row gap-2 w-full justify-end">
            <Button
              onClick={() => router.push("/")}
              className="w-full lg:w-fit"
              variant="outline"
            >
              <RiRobot2Line />
              <p>Start Demo</p>
            </Button>
            <Button onClick={handleOpenDialog}>
              <IoMdNotificationsOutline />
              <p>Subscribe to Elysia Updates</p>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 fade-in">
          <div className="flex items-center gap-4 w-full justify-start">
            <p className="text-3xl">Datasets in Elysia</p>
          </div>
          <p className="text-lg">
            Elysia provides a set of <strong>eight static datasets</strong> from
            different domains for the alpha demo that you&apos;re able to query.
            Some of these datasets share the same context and can be queried
            together. You&apos;ll learn here all about the datasets and what
            possible queries you can make.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2 fade-in">
          <div className="flex flex-col lg:flex-row gap-2 w-full justify-end">
            <Button
              onClick={() => router.push("/data")}
              className="w-full lg:w-fit"
            >
              <MdOutlineDataThresholding />
              <p>Data Explorer</p>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <FaGithub size={24} />
              <p className="text-2xl">Github Issues</p>
            </div>
            <Button onClick={() => viewDataset("example_verba_github_issues")}>
              <GoDatabase />
              View Dataset
            </Button>
          </div>
          <p className="fade-in">
            The Github Issues dataset contains a set of issues from the Verba
            Github repository.{" "}
            <a href="https://verba.weaviate.io">
              <span className="text-highlight font-bold">Verba</span>
            </a>{" "}
            is our open-source RAG app. It contains fields such as title, tags,
            date, and issue content.
          </p>
          <TicketsDisplay message={example_verba_github_issues as Message} />
          <Separator />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <MdOutlineEmail size={24} />
              <p className="text-2xl">Slack & Email Conversations</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => viewDataset("example_verba_email_chains")}>
                <GoDatabase />
                View Emails
              </Button>
              <Button
                onClick={() => viewDataset("example_verba_slack_conversations")}
              >
                <GoDatabase />
                View Slack
              </Button>
            </div>
          </div>
          <p className="fade-in">
            The Slack and Email datasets are synthetically generated around the
            Verba Github Issues. For example, you could look for certain issues
            and then check whether there are any conversations around it within
            the Slack and Email datasets. This is a great use case for
            multi-step querying and reasoning.
          </p>
          <ConversationsDisplay
            payload={
              (example_verba_emails.payload as ResultPayload)
                .objects as ConversationDisplayType[]
            }
          />
          <Separator />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <IoShirtOutline size={24} />
              <p className="text-2xl">Fashion Ecommerce</p>
            </div>
            <Button onClick={() => viewDataset("ecommerce")}>
              <GoDatabase />
              View Dataset
            </Button>
          </div>
          <p className="fade-in">
            The ecommerce dataset contains a set of synthetically generated
            products from a fashion ecommerce store. This dataset is a great
            usecase for applying dynamic filters and sorting.
          </p>
          <EcommerceDisplay
            payload={example_ecommerce.payload as ResultPayload}
          />
          <Separator />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <CiCloudOn size={24} />
              <p className="text-2xl">Weather Data</p>
            </div>
            <Button onClick={() => viewDataset("weather")}>
              <GoDatabase />
              View Dataset
            </Button>
          </div>
          <p className="fade-in">
            The weather dataset contains a set of weather measurements from from
            2014 to 2016. This dataset is a great usecase for aggregation tasks
            and time series analysis.
          </p>
          <AggregationDisplay
            aggregation={
              (example_weather.payload as ResultPayload)
                .objects as AggregationPayload[]
            }
          />
          <Separator />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <LuNewspaper size={24} />
              <p className="text-2xl">Machine Learning Articles</p>
            </div>
            <Button onClick={() => viewDataset("ML_Wikipedia")}>
              <GoDatabase />
              View Dataset
            </Button>
          </div>
          <p className="fade-in">
            The Machine Learning dataset contains a set of articles from
            wikipedia articles about different machine learning topics. This
            dataset is a great use case for Retrieval Augmented Generation (RAG)
            tasks.
          </p>
          <DocumentDisplay
            payload={
              (example_machine_learning_articles.payload as ResultPayload)
                .objects as DocumentPayload[]
            }
          />
          <Separator />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col items-center gap-2 fade-in">
            <div className="flex items-center gap-2">
              <img src="/weaviate-logo.svg" className="w-10 h-10" />
              <p className="text-2xl">Weaviate Documentation & Blogs</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => viewDataset("weaviate_documentation")}>
                <GoDatabase />
                View Documentation
              </Button>
              <Button onClick={() => viewDataset("weaviate_blogs")}>
                <GoDatabase />
                View Blogs
              </Button>
            </div>
          </div>
          <p className="fade-in">
            The Weaviate dataset contains all Weaviate Documentation and
            published blog posts.
          </p>
          <DocumentDisplay
            payload={
              (example_weaviate_documentation.payload as ResultPayload)
                .objects as DocumentPayload[]
            }
          />
          <Separator />
        </div>
      </div>
    </div>
  );
}
