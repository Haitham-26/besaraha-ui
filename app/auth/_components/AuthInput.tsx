import { Input, InputProps } from "@/app/components/Input";
import React from "react";

const inputClass = `!bg-white/[0.03] !border-white/10 !!h-14 !text-secondary placeholder:!text-slate-600 !shadow-none`;
const labelClass = "!text-slate-300 !font-black !text-xs !tracking-widest";

type AuthInputProps = InputProps;

export const AuthInput: React.FC<AuthInputProps> = ({
  className,
  ...props
}) => {
  return (
    <Input
      className={`${inputClass} ${className || ""}`}
      labelClassName={labelClass}
      {...props}
    />
  );
};
