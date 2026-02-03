import { motion } from "framer-motion";

interface ViewEnvironmentEntryProps {
  isLast?: boolean;
}

const pulseVariants = {
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const ViewEnvironmentEntry = ({ isLast = false }: ViewEnvironmentEntryProps) => {
  return (
    <div className="py-1.5">
      <motion.div
        className="inline-flex justify-center items-center px-2.5 py-1 rounded-md bg-accent/10 border border-accent/30 w-full"
        variants={isLast ? pulseVariants : undefined}
        animate={isLast ? "animate" : undefined}
      >
        <span className="text-[11px] font-bold text-accent">
          Viewing environment
        </span>
      </motion.div>
    </div>
  );
};

export default ViewEnvironmentEntry;
