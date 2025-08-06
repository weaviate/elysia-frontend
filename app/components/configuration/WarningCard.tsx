import { motion } from "framer-motion";
import { IoWarning } from "react-icons/io5";

// Warning Card Component
export default function WarningCard({
  title,
  issues,
}: {
  title: string;
  issues: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-4 border border-warning bg-warning/10 rounded-md mb-2"
    >
      <IoWarning className="text-warning flex-shrink-0 mt-0.5" size={20} />
      <div className="flex flex-col gap-1">
        <h3 className="text-warning font-medium">{title}</h3>
        <p className="text-sm text-secondary">
          The following settings need to be configured:
        </p>
        <ul className="text-sm text-secondary list-disc list-inside">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
