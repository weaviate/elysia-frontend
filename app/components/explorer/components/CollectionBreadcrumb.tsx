import React, { useContext } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LuDatabase } from "react-icons/lu";
import { RouterContext } from "../../contexts/RouterContext";

interface CollectionBreadcrumbProps {
  collectionName?: string;
}

const CollectionBreadcrumb: React.FC<CollectionBreadcrumbProps> = ({
  collectionName,
}) => {
  const { changePage } = useContext(RouterContext);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="cursor-pointer text-lg flex items-center gap-2"
            onClick={() => changePage("data", {}, true)}
          >
            Data Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="cursor-pointer">
          <BreadcrumbPage className="text-lg gap-2 flex items-center justify-center">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 bg-accent rounded-md">
              <LuDatabase size={18} />
            </div>
            {collectionName || "Loading..."}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CollectionBreadcrumb;
