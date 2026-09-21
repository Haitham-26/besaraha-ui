"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Countdown } from "./Countdown";
import { Toast } from "@/tools/Toast";
import { useTranslations } from "next-intl";

const RESEND_DELAY = 2 * 60 * 1000;

type ResendTokenButtonProps = {
  localStorageKey: string;
  onResend: () => Promise<void>;
};

export const ResendTokenButton: React.FC<ResendTokenButtonProps> = ({
  onResend,
  localStorageKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);

  const t = useTranslations("common.resendToken");

  const hasInitialized = useRef(false);

  const handleResend = useCallback(async () => {
    try {
      setLoading(true);

      await onResend();

      const expiresAt = Date.now() + RESEND_DELAY;

      localStorage.setItem(localStorageKey, String(expiresAt));
      setDeadline(expiresAt);

      Toast.success(t("success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  }, [localStorageKey, onResend, t]);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const stored = localStorage.getItem(localStorageKey);

    const expiresAt = Number(stored);

    if (!stored || expiresAt <= Date.now()) {
      handleResend();
    } else {
      setDeadline(expiresAt);
    }
  }, [localStorageKey, handleResend]);

  return (
    <Fragment>
      {deadline ? (
        <div className="flex items-center gap-1.5 text-sm mt-3">
          <p className="font-medium text-white/90">
            {t.rich("countdownText", {
              countdown: () => (
                <Countdown
                  deadline={deadline}
                  onFinish={() => setDeadline(null)}
                />
              ),
            })}
          </p>
        </div>
      ) : (
        <Button
          onClick={handleResend}
          disabled={loading}
          className="w-fit bg-transparent shadow-none rounded-none !p-0 mt-4 text-[0.75rem] text-accent hover:bg-transparent hover:text-accent"
        >
          <span>{t("button")}</span>
          {loading ? <Spinner className="static" /> : null}
        </Button>
      )}
    </Fragment>
  );
};
