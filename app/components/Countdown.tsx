"use client";

import React, { useEffect, useState } from "react";

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));

  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

type CountdownProps = {
  deadline: number;
  onFinish?: VoidFunction;
};

export const Countdown: React.FC<CountdownProps> = ({ deadline, onFinish }) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setRemaining(Math.max(0, deadline - Date.now()));

    const interval = setInterval(() => {
      const nextRemaining = Math.max(0, deadline - Date.now());

      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        clearInterval(interval);
        onFinish?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onFinish]);

  return (
    <span className="text-sm font-medium text-[inherit] tabular-nums">
      {formatTime(remaining)}
    </span>
  );
};
