"use client";

import { Reply } from "@/model/reply/types/Reply";
import { formattedDate } from "@/tools/Date";
import { NextClient } from "@/tools/NextClient";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { ReplyToggleLikeResponseDto } from "@/model/reply/dto/ReplyToggleLikeResponseDto";
import { Toast } from "@/tools/Toast";

type QuestionReplyProps = {
  reply: Reply;
  userId: string | null;
  openRegisterModal?: VoidFunction;
};

export const QuestionReply: React.FC<QuestionReplyProps> = ({
  reply: _reply,
  userId,
  openRegisterModal,
}) => {
  const [reply, setReply] = useState<Reply>(_reply);
  const [toggleLikeLoading, setToggleLikeLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(reply.hasLiked);

  const toggleLike = async () => {
    if (!userId) {
      openRegisterModal?.();
      return;
    }

    try {
      setToggleLikeLoading(true);
      setHasLiked((prev) => !prev);

      const { data } = (await NextClient(`/replies/${reply._id}/toggle-like`, {
        method: "POST",
      })) as { data: ReplyToggleLikeResponseDto };

      setReply((prev) => ({
        ...prev,
        hasLiked: data.hasLiked,
        likesCount: data.likesCount,
      }));
    } catch (e) {
      setHasLiked((prev) => !prev);

      console.log(e);
      Toast.apiError(e);
    } finally {
      setToggleLikeLoading(false);
    }
  };

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

        <Button
          onClick={toggleLike}
          disabled={toggleLikeLoading}
          className={`shadow-none flex items-center gap-2 !px-3 !py-1.5 rounded-xl border-2 transition-all duration-300 ${
            hasLiked
              ? "!bg-danger/10 !border-danger/20 !text-danger shadow-sm shadow-danger/10"
              : "!bg-surface !border-border !text-text-muted hover:!border-danger/30 hover:!text-danger"
          }`}
        >
          <Icon
            icon={faHeart}
            className={`text-sm transition-transform duration-300 ${
              hasLiked ? "scale-110" : "group-hover:scale-110"
            }`}
          />
          <span className="text-xs font-black">{reply.likesCount || 0}</span>
        </Button>
      </div>

      <div className="relative">
        <div className="absolute right-0 top-0 w-1 h-full bg-border/40 rounded-full" />
        <p className="text-base text-text-primary leading-relaxed pr-5 font-medium">
          {reply.reply}
        </p>
      </div>
    </div>
  );
};
