import React from "react";
import { ResultPayload } from "@/app/types/chat";
import { getDisplayIcon } from "@/app/types/displayIcons";

interface DisplayIconProps {
  payload: ResultPayload[];
}

const DisplayIcon: React.FC<DisplayIconProps> = ({ payload }) => {
  return getDisplayIcon(payload[0].type);
};

export default DisplayIcon;
