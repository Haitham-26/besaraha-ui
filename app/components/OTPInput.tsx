"use client";

import { OTPInput as InputOTP } from "input-otp";

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  errorMessage?: string;
};

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        containerClassName="flex justify-center gap-3 [direction:ltr]"
        render={({ slots }) =>
          slots.map((slot, index) => (
            <div
              key={index}
              className={`w-20 aspect-square rounded-xl border flex items-center justify-center text-xl font-black text-white transition-all duration-200
                ${
                  slot.isActive
                    ? "border-accent bg-accent/10 ring-2 ring-accent/20 scale-105"
                    : "border-white/10 bg-white/5"
                }
              `}
            >
              {slot.char}
            </div>
          ))
        }
      />

      {errorMessage ? (
        <p className="px-1 text-danger text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
