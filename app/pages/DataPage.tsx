"use client";

import Dashboard from "../components/explorer/DataDashboard";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden p-2 md:p-6">
      <Dashboard />
    </div>
  );
}
