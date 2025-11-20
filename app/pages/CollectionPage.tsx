"use client";

import DataExplorer from "../components/explorer/DataExplorer";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden w-full p-2 md:p-6">
      <DataExplorer />
    </div>
  );
}
