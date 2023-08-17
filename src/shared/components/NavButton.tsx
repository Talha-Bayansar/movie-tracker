import { type QwikIntrinsicElements, Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type Props = {
  class?: string;
  isActive?: boolean;
} & QwikIntrinsicElements["button"];

export const NavButton = component$(
  ({ class: className, isActive = false, ...props }: Props) => {
    return (
      <button
        class={twMerge(
          "rounded-full p-3",
          `${isActive && "bg-c-background-light"}`,
          className
        )}
        {...props}
      >
        <Slot />
      </button>
    );
  }
);
