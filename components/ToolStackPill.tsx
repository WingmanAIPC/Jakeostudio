import React from "react";
import {
  TOOL_STACK_ICON_SIZE,
  toolStackIconMap,
  toolStackPillTheme,
} from "../lib/toolStackIcons";

const baseClass =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs leading-none text-zinc-200 sm:px-3";

export function ToolStackPill({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const Icon = toolStackIconMap[label];
  const theme = toolStackPillTheme[label];

  return (
    <span
      className={`${baseClass} ${className}`.trim()}
      style={
        theme
          ? {
              backgroundColor: theme.background,
              borderColor: theme.border,
            }
          : {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
            }
      }
    >
      {Icon ? (
        <Icon
          className={theme ? "shrink-0" : "shrink-0 text-zinc-400"}
          style={theme ? { color: theme.color } : undefined}
          size={TOOL_STACK_ICON_SIZE}
          aria-hidden
        />
      ) : null}
      {label}
    </span>
  );
}
