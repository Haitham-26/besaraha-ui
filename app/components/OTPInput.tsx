"use client";

import { OTPInput as InputOTP } from "input-otp";
import { Fragment } from "react";

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={onChange}
      containerClassName="flex justify-center gap-3 [direction:ltr]"
      render={({ slots }) => (
        <Fragment>
          {slots.map((slot, index) => (
            <div
              key={index}
              className={`
                w-20
                aspect-square
                rounded-xl
                border
                flex
                items-center
                justify-center
                text-xl
                font-black
                text-white
                transition-all
                duration-200
                ${
                  slot.isActive
                    ? "border-accent bg-accent/10 ring-2 ring-accent/20 scale-105"
                    : "border-white/10 bg-white/5"
                }
              `}
            >
              {slot.char}
            </div>
          ))}
        </Fragment>
      )}
    />
  );
};
