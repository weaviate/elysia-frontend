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
import { motion } from "framer-motion";

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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center gap-2"
              transition={{
                duration: 0.3,
                type: "tween",
              }}
            >
              <motion.div
                className="flex items-center justify-center shrink-0 w-8 h-8 bg-accent/10 text-accent border border-accent rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 150,
                  delay: 0.3,
                }}
              >
                <LuDatabase size={18} />
              </motion.div>
              {collectionName || "Loading..."}
            </motion.div>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CollectionBreadcrumb;
