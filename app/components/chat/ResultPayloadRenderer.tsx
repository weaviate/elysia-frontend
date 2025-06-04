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

import TicketsDisplay from "./display/TicketDisplay";
import ProductDisplay from "./display/ProductDisplay";
import ThreadDisplay from "./display/ThreadDisplay";
import SingleMessageDisplay from "./display/SingleMessageDisplay";
import BoringGenericDisplay from "./display/BoringGeneric";
import AggregationDisplay from "./display/aggregation";
import DocumentDisplay from "./display/DocumentDisplay";

interface ResultPayloadRendererProps {
  payload: ResultPayload;
  index: number;
  messageId: string;
  handleResultPayloadChange: (
    type: string,
    payload: /* eslint-disable @typescript-eslint/no-explicit-any */ any
  ) => void;
}

const ResultPayloadRenderer: React.FC<ResultPayloadRendererProps> = ({
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
    case "boring_generic":
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
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn("Unhandled ResultPayload type:", payload.type);
      }
      return null;
  }
};

export default ResultPayloadRenderer;
