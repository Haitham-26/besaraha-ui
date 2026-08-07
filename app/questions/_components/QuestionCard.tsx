"use client";

import React, { useEffect, useState } from "react";
import { Question } from "@/model/question/Question";
import { Reply } from "@/model/reply/Reply";
import { Button } from "@/app/components/Button";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons/faQuoteRight";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";

import { usePathname } from "next/navigation";
import { formattedDate } from "@/tools/Date";
import { QuestionReply } from "./QuestionReply";
import { NextClient } from "@/tools/NextClient";
import Link from "next/link";
import { useGlobalContext } from "../context/global-context";
import { Icon } from "@/app/components/Icon";
import { Empty } from "@/app/components/Empty";
import { Toast } from "@/tools/Toast";
import { QuestionActions } from "./QuestionActions";
import { Textarea } from "@/app/components/Textarea";

type QuestionCardProps = {
  question: Question;
  userId: string | null;
  openRegisterModal?: VoidFunction;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userId,
  openRegisterModal,
}) => {
  const [replyLoading, setReplyLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [replyAsAnnonymous, setReplyAsAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [repliesLoading, setRepliesLoading] = useState(false);

  const { replies, setReplies } = useGlobalContext();
  const pathname = usePathname();

  const isOnProfilePage = !Boolean(pathname.replace("/questions", "").length);
  const isListView = isOnProfilePage || pathname === "/questions/public";
  const isOwner = userId === question.userId;

  const onShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/questions/${question._id}`,
    );
    Toast.success("تم نسخ الرابط بنجاح");
  };

  const onReply = async () => {
    if (!reply.trim()) {
      return;
    }

    try {
      setReplyLoading(true);

      await NextClient(`/replies/${question._id}/reply`, {
        method: "POST",
        data: { reply, name },
      });

      const { data } = await NextClient<Reply[]>(
        `/replies/${question._id}/all`,
        { method: "POST", data: { userId } },
      );

      setReplies(data);
      setReply("");
      setName("");
      setReplyAsAnonymous(true);
      Toast.success("تم إرسال الرد بنجاح");
    } catch (e: any) {
      Toast.apiError(e);
    } finally {
      setReplyLoading(false);
    }
  };

  useEffect(() => {
    if (isListView) {
      return;
    }

    const fetchReplies = async () => {
      try {
        setRepliesLoading(true);

        const { data } = await NextClient<Reply[]>(
          `/replies/${question._id}/all`,
          { method: "POST", data: { userId } },
        );

        setReplies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setRepliesLoading(false);
      }
    };

    fetchReplies();
  }, [question._id, setReplies, userId, isListView]);

  return (
    <div className="relative group/card max-w-3xl mx-auto w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-surface border border-border/60 rounded-[2.5rem] transition-all duration-300 hover:border-accent/30">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Icon icon={faQuoteRight} className="text-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter opacity-60">
                  تاريخ النشر
                </span>
                <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs">
                  <Icon icon={faClock} className="text-[10px] text-accent" />
                  <span className="dir-ltr">
                    {formattedDate(question.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {isOnProfilePage && isOwner ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase ${question.isPublic ? "bg-accent/5 border-accent/20 text-accent" : "bg-surface-muted border-border/50 text-text-muted"}`}
              >
                <Icon icon={question.isPublic ? faEarthAmericas : faLock} />
                <span>{question.isPublic ? "عام" : "خاص"}</span>
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            {isListView ? (
              <Link
                href={`/questions/${question._id}`}
                className="group/title flex items-center justify-between gap-4"
              >
                <h2 className="text-xl md:text-2xl font-black text-text-primary leading-snug group-hover/title:text-accent transition-colors line-clamp-2">
                  {question.question}
                </h2>
                <div className="shrink-0 w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-muted group-hover/title:bg-accent group-hover/title:text-white transition-all">
                  <Icon icon={faAngleLeft} className="text-sm" />
                </div>
              </Link>
            ) : (
              <h2 className="text-2xl md:text-4xl font-black text-text-primary leading-tight tracking-tight">
                {question.question}
              </h2>
            )}
          </div>

          {!isListView ? (
            <div className="mt-8 pt-8 border-t border-border/40">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">
                  الردود المباشرة
                </span>
                <div className="h-px w-full bg-gradient-to-r from-border/60 to-transparent" />
              </div>

              <div className="space-y-4 mb-8">
                {repliesLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : replies.length > 0 ? (
                  <div className="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                    {replies.map((reply) => (
                      <QuestionReply
                        key={reply._id}
                        reply={reply}
                        userId={userId}
                        openRegisterModal={openRegisterModal}
                      />
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="لا توجد ردود"
                    description="كن أول من يترك بصمته هنا."
                  />
                )}
              </div>

              <div className="bg-surface-muted/40 p-1.5 rounded-[2rem] border border-border/40">
                <div className="bg-surface rounded-[1.8rem] p-4">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), onReply())
                    }
                    placeholder="اكتب ردك هنا..."
                  />
                  <div className="flex justify-between border-t border-border/30 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer group/anon">
                          <input
                            type="checkbox"
                            checked={replyAsAnnonymous}
                            onChange={(e) => {
                              setReplyAsAnonymous(e.target.checked);
                              setName("");
                            }}
                          />
                          <span className="text-[11px] font-bold text-text-muted group-hover/anon:text-text-primary">
                            هوية مجهولة
                          </span>
                        </label>

                        {!replyAsAnnonymous ? (
                          <input
                            placeholder="اسمك المستعار"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="sm:hidden mt-2 bg-surface-muted border-none rounded-lg px-3 py-2 text-[11px] focus:ring-1 focus:ring-accent outline-none w-28 animate-in fade-in zoom-in-95"
                          />
                        ) : null}
                      </div>

                      {!replyAsAnnonymous ? (
                        <input
                          placeholder="اسمك المستعار"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="hidden sm:inline bg-surface-muted border-none rounded-lg px-3 py-2 text-[11px] focus:ring-1 focus:ring-accent outline-none w-28 animate-in fade-in zoom-in-95"
                        />
                      ) : null}
                    </div>
                    <Button
                      loading={replyLoading}
                      onClick={onReply}
                      className="!h-10 !px-3 !rounded-xl !text-xs !font-black !bg-primary !text-secondary hover:!bg-accent transition-all"
                      icon={faPaperPlane}
                    >
                      إرسال
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
            <button
              onClick={onShare}
              className="cursor-pointer flex items-center gap-2 text-[11px] font-black text-text-muted hover:text-accent transition-colors px-2 py-1"
            >
              <Icon icon={faShareNodes} />
              <span>مشاركة</span>
            </button>

            {isOnProfilePage && isOwner ? (
              <QuestionActions question={question} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
