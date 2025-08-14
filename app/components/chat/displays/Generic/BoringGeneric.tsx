"use client";

import DataTable from "@/app/components/explorer/DataTable";

interface BoringGenericDisplayProps {
  payload: { [key: string]: string }[];
}

const BoringGenericDisplay: React.FC<BoringGenericDisplayProps> = ({
  payload,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <DataTable
        data={payload}
        header={payload[0]}
        stickyHeaders={true}
        maxHeight="30vh"
      />
    </div>
  );
};

export default BoringGenericDisplay;
