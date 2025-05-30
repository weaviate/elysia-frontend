"use client";

import DataTable from "@/app/components/explorer/DataTable";

interface BoringGenericDisplayProps {
  payload: { [key: string]: string }[];
}

const BoringGenericDisplay: React.FC<BoringGenericDisplayProps> = ({
  payload,
}) => {
  console.log("payload", payload);
  return (
    <div className="w-full flex flex-col justify-start items-start max-h-[30vh] overflow-y-auto">
      <DataTable data={payload} header={payload[0]} />
    </div>
  );
};

export default BoringGenericDisplay;
