"use client";

import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { ReplyToggleLikeResponseDto } from "@/model/reply/dto/ReplyToggleLikeResponseDto";
import { Reply } from "@/model/reply/types/Reply";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type QuestionReplyLikeButtonProps = {
  reply: Reply;
};

export const QuestionReplyLikeButton: React.FC<
  QuestionReplyLikeButtonProps
> = ({ reply }) => {
  const [toggleLikeLoading, setToggleLikeLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(reply.hasLiked);
  const [likesCount, setLikesCount] = useState(reply.likesCount);

  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLike = async () => {
    if (!data?.user?._id) {
      router.push(`${pathname}?showRegisterModal=true`, { scroll: false });
      return;
    }

    try {
      setToggleLikeLoading(true);
      setHasLiked((prev) => !prev);

      const { data } = (await NextClient(`/replies/toggle-like`, {
        method: "POST",
        data: { replyId: reply._id, questionId: reply.questionId },
      })) as { data: ReplyToggleLikeResponseDto };

      setLikesCount(data.likesCount);
    } catch (e) {
      setHasLiked((prev) => !prev);
      setLikesCount((prev) => (prev - 1 >= 0 ? prev - 1 : 0));

      console.log(e);
      Toast.apiError(e);
    } finally {
      setToggleLikeLoading(false);
    }
  };

  return (
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
      <span className="text-xs font-black">{likesCount || 0}</span>
    </Button>
  );
};
