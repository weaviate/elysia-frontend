"use client";

import React from "react";

import { FaDatabase } from "react-icons/fa";

interface CollectionNavbarProps {
  collection_name: string | null;
  total_objects: number;
  handleFilterChange: (collection_name: string) => void;
  routerChangeCollection: (collection_id: string) => void;
}

const CollectionNavbar: React.FC<CollectionNavbarProps> = ({
  collection_name,
  total_objects,
  handleFilterChange,
  routerChangeCollection,
}) => {
  return (
    collection_name && (
      <div className="flex flex-row justify-between items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleFilterChange(collection_name);
          }}
          className="flex justify-between items-center transition-all duration-300 cursor-pointer hover:text-primary text-secondary rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FaDatabase className="" />
            <p className="text-xs font-bold ">
              {collection_name}
              {" ("}
              {total_objects}
              {") "}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default CollectionNavbar;
