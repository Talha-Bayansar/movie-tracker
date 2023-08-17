import { Slot, component$ } from "@builder.io/qwik";
import { type ClassNameValue, twMerge } from "tailwind-merge";

type Props = {
  class?: ClassNameValue;
};

export const SubTitle = component$(({ class: className }: Props) => {
  return (
    <h2 class={twMerge("uppercase font-medium text-base", className)}>
      <Slot />
    </h2>
  );
});
