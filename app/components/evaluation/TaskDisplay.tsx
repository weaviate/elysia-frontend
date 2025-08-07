"use client";

import { TaskCompleted } from "@/app/components/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MdTask } from "react-icons/md";

interface TaskDisplayProps {
  tasks_completed: TaskCompleted[];
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks_completed }) => {
  if (!tasks_completed || tasks_completed.length === 0) {
    return (
      <div className="flex items-center justify-center w-full p-8 bg-background_alt rounded-md border border-foreground">
        <div className="flex flex-col items-center gap-3 text-secondary">
          <MdTask size={32} className="opacity-50" />
          <p className="text-sm">No tasks completed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {tasks_completed.map((taskGroup, groupIndex) => (
        <motion.div
          key={groupIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="flex flex-col gap-4 p-4 bg-background_alt rounded-md border border-foreground"
        >
          {/* Task Group Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-accent rounded-full">
                <span className="text-xs font-bold text-white">
                  {groupIndex + 1}
                </span>
              </div>
              <p className="text-secondary text-sm font-medium">
                Task {groupIndex + 1}
              </p>
            </div>
            <div className="p-3 bg-background rounded-md border border-foreground">
              <p className="text-primary text-sm leading-relaxed">
                {taskGroup.prompt}
              </p>
            </div>
          </div>

          {/* Individual Tasks */}
          <div className="flex flex-col gap-3">
            {taskGroup.task.map((task, taskIndex) => (
              <motion.div
                key={taskIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 + taskIndex * 0.05 }}
                className="flex flex-col gap-3 p-3 bg-background rounded-md border border-foreground"
              >
                {/* Task Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-highlight/20 rounded-full flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-highlight">
                        {taskIndex + 1}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <p className="text-primary text-sm font-medium leading-relaxed">
                        {task.todo}
                      </p>
                      {task.reasoning && (
                        <p className="text-secondary text-xs leading-relaxed">
                          <span className="font-medium">Reasoning:</span>{" "}
                          {task.reasoning}
                        </p>
                      )}
                      {task.extra_string && (
                        <p className="text-secondary text-xs leading-relaxed">
                          <span className="font-medium">Details:</span>{" "}
                          {task.extra_string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Badges */}
                <div className="flex flex-row gap-2 items-center flex-wrap pl-8">
                  <Badge className="text-xs bg-accent/10 text-accent border-accent/20">
                    {task.task}
                  </Badge>
                  <Badge className="text-xs bg-highlight/10 text-highlight border-highlight/20">
                    Count: {task.count}
                  </Badge>
                  {task.action && (
                    <Badge className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                      Action: {task.action}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskDisplay;
