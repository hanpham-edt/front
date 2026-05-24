"use client";

import { useEffect, useState } from "react";
import { formatVndInput, parseVndInput } from "@/lib/format";

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
};

export default function CurrencyInput({
  value,
  onChange,
  id,
  name,
  required,
  disabled,
  placeholder = "0",
  className = "",
  "aria-label": ariaLabel,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => formatVndInput(value));

  useEffect(() => {
    if (!focused) {
      setText(formatVndInput(value));
    }
  }, [value, focused]);

  const inputClassName =
    className ||
    "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 tabular-nums";

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        autoComplete="off"
        placeholder={placeholder}
        value={focused ? text : formatVndInput(value)}
        onFocus={() => {
          setFocused(true);
          setText(value > 0 ? String(value) : "");
        }}
        onBlur={() => {
          setFocused(false);
          const n = parseVndInput(text);
          onChange(n);
          setText(formatVndInput(n));
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          onChange(parseVndInput(raw));
        }}
        className={`${inputClassName} pr-10`}
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
        aria-hidden
      >
        ₫
      </span>
    </div>
  );
}
