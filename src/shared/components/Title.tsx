import { Slot, component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";

type Props = {
  class?: string;
};

export const Title = component$(({ class: className }: Props) => {
  return (
    <h1 class={twMerge("text-3xl tracking-normal font-medium mb-8", className)}>
      <Slot />
    </h1>
  );
});
