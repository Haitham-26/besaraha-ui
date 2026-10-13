import React from "react";
import { Icon } from "./Icon";
import { faInbox } from "@fortawesome/free-solid-svg-icons/faInbox";
import { Button } from "./Button";

type Props = {
  title: string;
  description: string;
  action?: {
    title: string;
    onClick: VoidFunction;
  };
};

export const Empty: React.FC<Props> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 bg-surface border-2 border-dashed border-border rounded-[3rem] text-center">
      <div className="w-20 h-20 bg-surface-muted rounded-3xl flex items-center justify-center text-text-muted mb-6">
        <Icon icon={faInbox} className="text-3xl" />
      </div>
      <h3 className="text-2xl font-black text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mx-auto mb-8">{description}</p>
      {action ? <Button onClick={action.onClick}>{action.title}</Button> : null}
    </div>
  );
};
