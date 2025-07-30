import React from "react";
import { ResultPayload } from "@/app/types/chat";
import {
  ProductPayload,
  ThreadPayload,
  SingleMessagePayload,
  AggregationPayload,
  DocumentPayload,
  TicketPayload,
} from "@/app/types/displays";

import TicketsDisplay from "./displays/Ticket/TicketDisplay";
import ProductDisplay from "./displays/Product/ProductDisplay";
import ThreadDisplay from "./displays/MessageThread/ThreadDisplay";
import SingleMessageDisplay from "./displays/MessageThread/SingleMessageDisplay";
import BoringGenericDisplay from "./displays/Generic/BoringGeneric";
import AggregationDisplay from "./displays/ChartTable/AggregationDisplay";
import DocumentDisplay from "./displays/Document/DocumentDisplay";
import BarDisplay from "./displays/ChartTable/BarDisplay";
import ScatterOrLineDisplay from "./displays/ChartTable/ScatterOrLineDisplay";
import HistogramDisplay from "./displays/ChartTable/HistogramDisplay";

interface RenderDisplayProps {
  payload: ResultPayload;
  index: number;
  messageId: string;
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const RenderDisplay: React.FC<RenderDisplayProps> = ({
  payload,
  index,
  messageId,
  handleResultPayloadChange,
}) => {
  const keyBase = `${index}-${messageId}`;

  switch (payload.type) {
    case "ticket":
      return (
        <TicketsDisplay
          key={`${keyBase}-tickets`}
          tickets={payload.objects as TicketPayload[]}
          handleResultPayloadChange={handleResultPayloadChange}
        />
      );
    case "product":
    case "ecommerce":
      return (
        <ProductDisplay
          key={`${keyBase}-product`}
          products={payload.objects as ProductPayload[]}
          handleResultPayloadChange={handleResultPayloadChange}
        />
      );
    case "conversation":
      return (
        <ThreadDisplay
          key={`${keyBase}-conversation`}
          payload={payload.objects as ThreadPayload[]}
          handleResultPayloadChange={handleResultPayloadChange}
        />
      );
    case "message":
      return (
        <SingleMessageDisplay
          key={`${keyBase}-message`}
          payload={payload.objects as SingleMessagePayload[]}
        />
      );
    case "table":
    case "mapped":
      return (
        <BoringGenericDisplay
          key={`${keyBase}-boring-generic`}
          payload={payload.objects as { [key: string]: string }[]}
        />
      );
    case "aggregation":
      return (
        <AggregationDisplay
          key={`${keyBase}-aggregation`}
          aggregation={payload.objects as AggregationPayload[]}
        />
      );
    case "document":
      return (
        <DocumentDisplay
          key={`${keyBase}-document`}
          payload={payload.objects as DocumentPayload[]}
          handleResultPayloadChange={handleResultPayloadChange}
        />
      );
    case "bar_chart":
      return <BarDisplay key={`${keyBase}-chart`} result={payload} />;
    case "scatter_or_line_chart":
      return <ScatterOrLineDisplay key={`${keyBase}-chart`} result={payload} />;
    case "histogram_chart":
      return <HistogramDisplay key={`${keyBase}-chart`} result={payload} />;
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn("Unhandled ResultPayload type:", payload.type);
      }
      return null;
  }
};

export default RenderDisplay;
