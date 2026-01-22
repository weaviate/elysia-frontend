import { SelfHealingErrorPayload } from "@/app/types/chat";
import MarkdownFormat from "./components/MarkdownFormat";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

interface SelfHealingEntryProps {
  payload: SelfHealingErrorPayload;
  isLast?: boolean;
}

const pulseVariants = {
  animate: {
    scale: [0.6, 1, 0.6],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const SelfHealingEntry = ({ payload, isLast = false }: SelfHealingEntryProps) => {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-highlight font-bold">Self-Healing Details</p>
        <MarkdownFormat
          text={payload.feedback}
          size="sm"
          variant="highlight"
        />
      </div>
    </div>
  );
};

export default SelfHealingEntry;
