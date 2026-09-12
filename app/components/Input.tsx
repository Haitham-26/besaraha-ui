import React, { useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  title?: string;
  valid?: boolean;
  errorMessage?: string;
  classNames?: {
    container?: string;
    label?: string;
    input?: string;
  };
};

export const Input: React.FC<InputProps> = ({
  title,
  valid = true,
  errorMessage,
  classNames,
  required,
  type: initialType = "text",
  dir: propDir,
  ...props
}) => {
  const [type, setType] = useState<HTMLInputElement["type"]>(initialType);

  const getInputDirectionByType = () => {
    if (propDir) {
      return propDir;
    }

    const ltrInputTypes = [
      "password",
      "email",
      "tel",
      "number",
      "url",
    ] as React.HTMLInputTypeAttribute[];

    if (ltrInputTypes.includes(initialType as React.HTMLInputTypeAttribute)) {
      return "ltr";
    }

    return "inherit";
  };

  const docDirection = "rtl";
  const inputDirectionByType = getInputDirectionByType();
  const isLtrInRtl = inputDirectionByType === "ltr" && docDirection === "rtl";

  return (
    <div
      className={`flex flex-col gap-1.5 w-full group ${classNames?.container || ""}`}
    >
      {title ? (
        <label
          htmlFor={props.id || props.name}
          className={`text-sm font-bold tracking-tight transition-colors duration-200 px-1 ${
            valid
              ? "text-text-primary group-focus-within:text-accent"
              : "text-danger"
          } ${classNames?.label || ""}`}
        >
          {title}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {initialType === "password" ? (
          <Button
            className="shadow-none !bg-transparent !p-2 !text-accent !absolute top-1/2 left-3 -translate-y-1/2 z-10"
            icon={type === "text" ? faEye : faEyeSlash}
            onClick={() =>
              setType((prev) => (prev === "password" ? "text" : "password"))
            }
          />
        ) : null}
        <input
          id={props.id}
          {...props}
          dir={inputDirectionByType}
          type={type}
          className={`
            w-full py-3.5 px-5 rounded-2xl outline-none transition-all duration-300
            bg-surface border-2 text-text-primary placeholder:text-text-muted/50
            
            ${valid ? "border-border shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/10 focus:shadow-md" : "border-danger bg-danger/5 focus:ring-4 focus:ring-danger/10"}
            ${initialType === "password" ? "pl-12" : ""}
            ${isLtrInRtl ? "placeholder:text-right [&:placeholder-shown]:text-right" : ""}
            
            ${classNames?.input || ""}
          `}
        />

        {!valid ? (
          <div
            className={`absolute inset-y-0 ${initialType === "password" ? "right-4" : "end-4"} left-4 flex items-center pointer-events-none text-danger`}
          >
            <Icon icon={faCircleExclamation} />
          </div>
        ) : null}
      </div>

      {!valid && errorMessage ? (
        <div className="min-h-[20px] px-1">
          <p className="text-danger text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMessage}
          </p>
        </div>
      ) : null}

      {props.maxLength ? (
        <span className={`block ms-auto text-xs font-black text-text-muted`}>
          {props.value?.toString().length || 0} / {props.maxLength}
        </span>
      ) : null}
    </div>
  );
};
