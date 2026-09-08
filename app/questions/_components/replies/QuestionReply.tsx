import { Reply } from "@/model/reply/types/Reply";
import { formattedDate } from "@/tools/Date";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { Icon } from "@/app/components/Icon";
import { QuestionReplyLikeButton } from "./QuestionReplyLikeButton";

type QuestionReplyProps = {
  reply: Reply;
};

export default function QuestionReply({ reply }: QuestionReplyProps) {
  const isAnonymous = !reply.name || reply.name === "مجهول";

  return (
    <div className="group relative flex flex-col gap-3 p-5 rounded-3xl bg-surface border border-border/60 hover:border-accent/20 hover:bg-surface-muted/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isAnonymous
                ? "bg-primary/5 text-primary/40"
                : "bg-accent/10 text-accent"
            }`}
          >
            <Icon
              icon={isAnonymous ? faUserSecret : faCircleUser}
              className="text-lg"
            />
          </div>
          <div>
            <p className="text-sm font-black text-text-primary">
              {reply.name || "مجهول الهوية"}
            </p>
            <p className="text-[10px] text-text-muted font-bold tracking-tight uppercase">
              {formattedDate(reply.createdAt)}
            </p>
          </div>
        </div>

        <QuestionReplyLikeButton reply={reply} />
      </div>

      <div className="relative">
        <div className="absolute right-0 top-0 w-1 h-full bg-border/40 rounded-full" />
        <p className="text-base text-text-primary leading-relaxed pr-5 font-medium">
          {reply.reply}
        </p>
      </div>
    </div>
  );
}
