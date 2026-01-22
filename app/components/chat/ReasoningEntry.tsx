import { TextObject, TextPayload } from "@/app/types/chat";
import MarkdownFormat from "./components/MarkdownFormat";
import { Separator } from "@/components/ui/separator";

interface ReasoningEntryProps {
  payload: TextPayload;
  isLast?: boolean;
}

const ReasoningEntry = ({ payload, isLast = false }: ReasoningEntryProps) => {
  return (
    <div className="">
      {payload.objects.map((text, idx) => {
        const textObj = text as TextObject;
        return (
          <div
            key={idx}
            className="text-sm text-primary flex flex-col gap-2 w-full"
          >
            <div className="flex-1">
              <MarkdownFormat
                text={text.text}
                size="sm"
                ref_ids={textObj.ref_ids || []}
                variant={isLast ? "primary" : "secondary"}
              />
              <Separator className="my-2" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReasoningEntry;