import {
  type QwikIntrinsicElements,
  Slot,
  component$,
  useSignal,
} from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type Props = {
  class?: string;
  isActive?: boolean;
} & QwikIntrinsicElements["button"];

export const NavButton = component$(
  ({ class: className, isActive = false, ...props }: Props) => {
    const isTouching = useSignal(false);
    return (
      <button
        onTouchStart$={() => (isTouching.value = true)}
        onTouchEnd$={() => (isTouching.value = false)}
        onTouchCancel$={() => (isTouching.value = false)}
        class={twMerge(
          "rounded-full p-3 transition-transform",
          `${isActive && "bg-c-background-light"}`,
          `${isTouching.value ? "scale-75" : "scale-100"}`,
          className
        )}
        {...props}
      >
        <Slot />
      </button>
    );
  }
);
