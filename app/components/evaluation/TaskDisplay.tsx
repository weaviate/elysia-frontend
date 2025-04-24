"use client";

import { TaskCompleted } from "@/app/components/types";
import { Badge } from "@/components/ui/badge";
interface TaskDisplayProps {
  tasks_completed: TaskCompleted[];
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks_completed }) => {
  if (!tasks_completed) return null;

  return (
    <div className="w-full flex flex-col gap-2 justify-start items-start bg-background_alt p-4 rounded-md">
      {tasks_completed.map((tasks, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="text-secondary text-sm">Task {index + 1}</p>
            <p className="text-primary text-lg">{tasks.prompt}</p>
          </div>
          <div className="flex flex-col gap-4">
            {tasks.task.map((task, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-primary text-sm">{task.todo}</p>
                <p className="text-secondary text-sm">{task.reasoning}</p>
                <p className="text-secondary text-sm">{task.extra_string}</p>
                <div className="flex flex-row gap-2 items-center">
                  <Badge>{task.task}</Badge>
                  <Badge>Count {task.count}</Badge>
                  {task.action && <Badge>Action {task.action}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskDisplay;
